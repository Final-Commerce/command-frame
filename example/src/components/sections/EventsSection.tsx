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

interface TopicSubscription {
  topicId: string;
  subscriptionId: string;
}

export function EventsSection({ isInIframe }: EventsSectionProps) {
  const [availableTopics, setAvailableTopics] = useState<TopicDefinition[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState<string>('');

  const [selectedTopic, setSelectedTopic] = useState<string>('customers');
  const [subscriptions, setSubscriptions] = useState<Map<string, string>>(new Map());
  const eventIdCounter = useRef(0);
  const subscriptionCallbacksRef = useRef<Map<string, (event: TopicEvent) => void>>(new Map());

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

  // Restore subscriptions when component remounts (only once)
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current) return; // Only restore once
    hasRestoredRef.current = true;

    const storedSubscriptions = localStorage.getItem('command-frame-subscriptions');
    if (storedSubscriptions && isInIframe) {
      try {
        const parsed: TopicSubscription[] = JSON.parse(storedSubscriptions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const restoredSubs = new Map<string, string>();
          parsed.forEach(({ topicId, subscriptionId }) => {
            // Create and restore subscription
            const callback = createEventCallback();
            subscriptionCallbacksRef.current.set(topicId, callback);
            const subId = topics.subscribe(topicId, callback);
            restoredSubs.set(topicId, subId);
          });
          setSubscriptions(restoredSubs);
        }
      } catch (error) {
        console.error('Error restoring subscriptions:', error);
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

  const handleSubscribe = (topicId: string) => {
    if (!isInIframe) {
      alert('Error: Not running in iframe');
      return;
    }

    if (!topicId) {
      alert('Error: Please select a topic');
      return;
    }

    // Check if already subscribed to this topic
    if (subscriptions.has(topicId)) {
      return; // Already subscribed
    }

    // Create callback that persists across component unmounts
    const callback = createEventCallback();
    subscriptionCallbacksRef.current.set(topicId, callback);

    // Subscribe to topic
    const subId = topics.subscribe(topicId, callback);

    // Update subscriptions state
    const newSubscriptions = new Map(subscriptions);
    newSubscriptions.set(topicId, subId);
    setSubscriptions(newSubscriptions);

    // Save subscriptions to localStorage
    try {
      const subscriptionsArray: TopicSubscription[] = Array.from(newSubscriptions.entries()).map(([topicId, subscriptionId]) => ({
        topicId,
        subscriptionId
      }));
      localStorage.setItem('command-frame-subscriptions', JSON.stringify(subscriptionsArray));
    } catch (error) {
      console.error('Error saving subscriptions to localStorage:', error);
    }
  };

  const handleUnsubscribe = (topicId: string) => {
    const subscriptionId = subscriptions.get(topicId);
    if (subscriptionId) {
      topics.unsubscribe(topicId, subscriptionId);
      
      // Update subscriptions state
      const newSubscriptions = new Map(subscriptions);
      newSubscriptions.delete(topicId);
      setSubscriptions(newSubscriptions);
      
      // Remove callback reference
      subscriptionCallbacksRef.current.delete(topicId);

      // Save subscriptions to localStorage
      try {
        const subscriptionsArray: TopicSubscription[] = Array.from(newSubscriptions.entries()).map(([topicId, subscriptionId]) => ({
          topicId,
          subscriptionId
        }));
        if (subscriptionsArray.length > 0) {
          localStorage.setItem('command-frame-subscriptions', JSON.stringify(subscriptionsArray));
        } else {
          localStorage.removeItem('command-frame-subscriptions');
        }
      } catch (error) {
        console.error('Error saving subscriptions to localStorage:', error);
      }
    }
  };

  const handleUnsubscribeAll = () => {
    // Unsubscribe from all topics
    subscriptions.forEach((subscriptionId, topicId) => {
      topics.unsubscribe(topicId, subscriptionId);
    });
    
    setSubscriptions(new Map());
    subscriptionCallbacksRef.current.clear();
    localStorage.removeItem('command-frame-subscriptions');
  };

  const handleClearEvents = () => {
    setReceivedEvents([]);
  };

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

      <CommandSection title="Subscribe to Topics">
        {availableTopics.length > 0 ? (
          <div className="topics-subscription-list">
            {availableTopics.map(topic => {
              const isSubscribed = subscriptions.has(topic.id);
              return (
                <div key={topic.id} className="topic-subscription-item">
                  <div className="topic-subscription-header">
                    <div className="topic-info">
                      <strong>{topic.name}</strong>
                      <span className="topic-id">({topic.id})</span>
                      {topic.description && (
                        <span className="topic-description"> - {topic.description}</span>
                      )}
                    </div>
                    <div className="topic-actions">
                      {isSubscribed ? (
                        <button 
                          onClick={() => handleUnsubscribe(topic.id)} 
                          className="btn btn--small btn--danger"
                        >
                          Unsubscribe
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSubscribe(topic.id)} 
                          className="btn btn--small btn--primary"
                        >
                          Subscribe
                        </button>
                      )}
                    </div>
                  </div>
                  {isSubscribed && (
                    <div className="subscription-status">
                      <span className="status-indicator status-indicator--active"></span>
                      <span>Subscribed</span>
                    </div>
                  )}
                  <div className="event-types-list">
                    {topic.eventTypes.map(eventType => (
                      <div key={eventType.id} className="event-type-item">
                        <strong>{eventType.id}</strong>
                        {eventType.description && (
                          <span className="event-type-desc"> - {eventType.description}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="section-description">
            Click "Get Topics" to load available topics.
          </p>
        )}

        {subscriptions.size > 0 && (
          <div className="button-group" style={{ marginTop: '1rem' }}>
            <button 
              onClick={handleUnsubscribeAll} 
              className="btn btn--danger"
            >
              Unsubscribe All ({subscriptions.size})
            </button>
          </div>
        )}

        {subscriptions.size > 0 && (
          <div className="subscription-summary">
            <strong>Active Subscriptions ({subscriptions.size}):</strong>
            <div className="subscribed-topics-list">
              {Array.from(subscriptions.keys()).map(topicId => {
                const topic = availableTopics.find(t => t.id === topicId);
                return (
                  <span key={topicId} className="subscribed-topic-badge">
                    {topic?.name || topicId}
                  </span>
                );
              })}
            </div>
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
                  data={JSON.stringify(receivedEvent.event, null, 2)} 
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

