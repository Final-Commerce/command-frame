import { useState, useEffect, useRef } from 'react';
import { topics, type TopicDefinition, type TopicEvent } from '@final-commerce/command-frame';
import { CommandSection } from '../CommandSection';
import { JsonViewer } from '../JsonViewer';
import './Sections.css';

interface EventsSectionProps {
  isInIframe: boolean;
}

interface ReceivedEvent {
  id: string;
  event: TopicEvent;
  receivedAt: string;
}

export function EventsSection({ isInIframe }: EventsSectionProps) {
  const [availableTopics, setAvailableTopics] = useState<TopicDefinition[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string>('');

  const [selectedTopic, setSelectedTopic] = useState<string>('customers');
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const eventIdCounter = useRef(0);
  const subscriptionCallbackRef = useRef<((event: TopicEvent) => void) | null>(null);

  // Load events from localStorage on mount
  const loadEventsFromStorage = (): ReceivedEvent[] => {
    try {
      const stored = localStorage.getItem('command-frame-events');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Restore eventIdCounter to be higher than the last event ID
          const lastId = parsed[0]?.id || '';
          const match = lastId.match(/event_(\d+)/);
          if (match) {
            eventIdCounter.current = parseInt(match[1], 10);
          }
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
    }
    return [];
  };

  // Initialize eventIdCounter from localStorage
  useEffect(() => {
    const counterStored = localStorage.getItem('command-frame-event-counter');
    if (counterStored) {
      try {
        eventIdCounter.current = parseInt(counterStored, 10) || 0;
      } catch (error) {
        // Fallback to reading from events - extract counter from ID format: event_timestamp_counter
        const eventsStored = localStorage.getItem('command-frame-events');
        if (eventsStored) {
          try {
            const parsed = JSON.parse(eventsStored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const lastId = parsed[0]?.id || '';
              // Match format: event_timestamp_counter
              const match = lastId.match(/event_\d+_(\d+)/);
              if (match) {
                eventIdCounter.current = parseInt(match[1], 10);
              }
            }
          } catch (error) {
            // Ignore
          }
        }
      }
    }
  }, []);

  const [receivedEvents, setReceivedEvents] = useState<ReceivedEvent[]>(loadEventsFromStorage);

  // Save events to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('command-frame-events', JSON.stringify(receivedEvents));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [receivedEvents]);

  // Restore subscription when component remounts (only once)
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current) return; // Only restore once
    hasRestoredRef.current = true;

    const storedSubscription = localStorage.getItem('command-frame-subscription');
    if (storedSubscription && isInIframe && !isSubscribed) {
      try {
        const { topic } = JSON.parse(storedSubscription);
        if (topic) {
          setSelectedTopic(topic);
          // Create and restore subscription
          const callback = createEventCallback();
          subscriptionCallbackRef.current = callback;
          const subId = topics.subscribe(topic, callback);
          setSubscriptionId(subId);
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error('Error restoring subscription:', error);
      }
    }
  }, [isInIframe]); // Only run once on mount

  // Keep subscription active - don't cleanup on unmount
  // Subscription will persist even when navigating away

  // Shared callback function that persists across component unmounts
  const createEventCallback = () => {
    return (event: TopicEvent) => {
      try {
        // Read current events from localStorage
        const stored = localStorage.getItem('command-frame-events');
        const currentEvents: ReceivedEvent[] = stored ? JSON.parse(stored) : [];
        
        // Check for duplicate events (same topic, type, and timestamp)
        const isDuplicate = currentEvents.some(existing => 
          existing.event.topic === event.topic &&
          existing.event.type === event.type &&
          existing.event.timestamp === event.timestamp
        );

        if (isDuplicate) {
          // Skip duplicate event
          return;
        }
        
        // Increment counter and create event with unique ID (timestamp + counter)
        const newId = ++eventIdCounter.current;
        const timestamp = Date.now();
        const uniqueId = `event_${timestamp}_${newId}`;
        
        const receivedEvent: ReceivedEvent = {
          id: uniqueId,
          event,
          receivedAt: new Date().toISOString()
        };

        // Add new event and keep last 50
        const updated = [receivedEvent, ...currentEvents].slice(0, 50);
        
        // Save to localStorage (works even when component is unmounted)
        localStorage.setItem('command-frame-events', JSON.stringify(updated));
        localStorage.setItem('command-frame-event-counter', newId.toString());
        
        // Update state if component is mounted (this is safe even if unmounted)
        setReceivedEvents(updated);
      } catch (error) {
        console.error('Error handling event in callback:', error);
      }
    };
  };

  const handleGetTopics = async () => {
    if (!isInIframe) {
      setTopicsError('Error: Not running in iframe');
      return;
    }

    setTopicsLoading(true);
    setTopicsError('');

    try {
      const result = await topics.getTopics();
      setAvailableTopics(result || []);
    } catch (error) {
      setTopicsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleSubscribe = () => {
    if (!isInIframe) {
      alert('Error: Not running in iframe');
      return;
    }

    if (!selectedTopic) {
      alert('Error: Please select a topic');
      return;
    }

    // Prevent duplicate subscriptions
    if (isSubscribed && subscriptionId) {
      // If already subscribed to the same topic, don't subscribe again
      const storedSubscription = localStorage.getItem('command-frame-subscription');
      if (storedSubscription) {
        try {
          const { topic: storedTopic } = JSON.parse(storedSubscription);
          if (storedTopic === selectedTopic) {
            console.log('Already subscribed to this topic');
            return;
          }
        } catch (error) {
          // Continue with unsubscribe
        }
      }
      // Unsubscribe from previous topic first
      topics.unsubscribe(selectedTopic, subscriptionId);
    }

    // Create callback that persists across component unmounts
    const callback = createEventCallback();
    subscriptionCallbackRef.current = callback;

    // Subscribe to topic
    const subId = topics.subscribe(selectedTopic, callback);

    setSubscriptionId(subId);
    setIsSubscribed(true);

    // Save subscription info to localStorage
    try {
      localStorage.setItem('command-frame-subscription', JSON.stringify({
        topic: selectedTopic,
        subscriptionId: subId
      }));
    } catch (error) {
      console.error('Error saving subscription to localStorage:', error);
    }
  };

  const handleUnsubscribe = () => {
    if (subscriptionId && selectedTopic) {
      topics.unsubscribe(selectedTopic, subscriptionId);
      setSubscriptionId(null);
      setIsSubscribed(false);
      // Remove subscription from localStorage
      localStorage.removeItem('command-frame-subscription');
    }
  };

  const handleClearEvents = () => {
    setReceivedEvents([]);
  };

  const selectedTopicDefinition = availableTopics.find(t => t.id === selectedTopic);

  return (
    <div className="section-content">
      <CommandSection title="Get Available Topics">
        <button 
          onClick={handleGetTopics} 
          disabled={topicsLoading}
          className="btn btn--primary"
        >
          {topicsLoading ? 'Loading...' : 'Get Topics'}
        </button>
        
        {topicsError && (
          <JsonViewer data={topicsError} title="Error" />
        )}
        
        {availableTopics.length > 0 && (
          <div className="data-table-wrapper">
            <h4>Available Topics ({availableTopics.length})</h4>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Event Types</th>
                </tr>
              </thead>
              <tbody>
                {availableTopics.map((topic) => (
                  <tr key={topic.id}>
                    <td>{topic.id}</td>
                    <td>{topic.name}</td>
                    <td>{topic.description || '-'}</td>
                    <td>
                      {topic.eventTypes.map(et => et.id).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CommandSection>

      <CommandSection title="Subscribe to Topic">
        <div className="form-group">
          <label className="form-label">Select Topic:</label>
          <select
            value={selectedTopic}
            onChange={(e) => {
              // Unsubscribe from current topic if subscribed
              if (isSubscribed && subscriptionId) {
                topics.unsubscribe(selectedTopic, subscriptionId);
                setSubscriptionId(null);
                setIsSubscribed(false);
              }
              setSelectedTopic(e.target.value);
              setReceivedEvents([]);
            }}
            className="form-input"
            disabled={isSubscribed}
          >
            {availableTopics.length > 0 ? (
              availableTopics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name} ({topic.id})
                </option>
              ))
            ) : (
              <option value="customers">customers (default)</option>
            )}
          </select>
        </div>

        {selectedTopicDefinition && (
          <div className="form-group">
            <label className="form-label">Event Types:</label>
            <div className="event-types-list">
              {selectedTopicDefinition.eventTypes.map(eventType => (
                <div key={eventType.id} className="event-type-item">
                  <strong>{eventType.id}</strong>
                  {eventType.description && (
                    <span className="event-type-desc"> - {eventType.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="button-group">
          {!isSubscribed ? (
            <button 
              onClick={handleSubscribe} 
              className="btn btn--primary"
            >
              Subscribe
            </button>
          ) : (
            <button 
              onClick={handleUnsubscribe} 
              className="btn btn--danger"
            >
              Unsubscribe
            </button>
          )}
        </div>

        {isSubscribed && (
          <div className="subscription-status">
            <span className="status-indicator status-indicator--active"></span>
            <span>Subscribed to: {selectedTopic}</span>
          </div>
        )}
      </CommandSection>

      <CommandSection title="Received Events">
        <div className="events-header">
          <span>Events received: {receivedEvents.length}</span>
          {receivedEvents.length > 0 && (
            <button 
              onClick={handleClearEvents} 
              className="btn btn--small"
            >
              Clear Events
            </button>
          )}
        </div>

        {receivedEvents.length === 0 ? (
          <p className="section-description">
            No events received yet. Subscribe to a topic and wait for events to be published.
          </p>
        ) : (
          <div className="events-list">
            {receivedEvents.map((receivedEvent) => (
              <div key={receivedEvent.id} className="event-item">
                <div className="event-header">
                  <span className="event-topic">{receivedEvent.event.topic}</span>
                  <span className="event-type">{receivedEvent.event.type}</span>
                  <span className="event-timestamp">
                    {new Date(receivedEvent.event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <JsonViewer 
                  data={JSON.stringify(receivedEvent.event.data, null, 2)} 
                  title="Event Data"
                />
              </div>
            ))}
          </div>
        )}
      </CommandSection>
    </div>
  );
}

