import type { TopicDefinition } from '../../types';

export const loyaltyTopic: TopicDefinition = {
  id: 'loyalty',
  name: 'Loyalty',
  description:
    'The loyalty side of this sale (Engage): who the member on it is, and the rewards on the cart. ' +
    'Re-read getLoyalty when it fires instead of polling.',
  eventTypes: [
    {
      id: 'member-changed',
      name: 'Member Changed',
      description:
        'The member on this sale changed: looked up, found, proved by a code, joined, their balance moved, or they left the sale',
    },
    {
      id: 'reward-applied',
      name: 'Reward Applied',
      description: 'A reward, an offer or a coupon code went on the cart, with its discount',
    },
    {
      id: 'reward-removed',
      name: 'Reward Removed',
      description: 'A reward or an offer came off the cart and its stamps or points went back',
    },
  ],
};

export * from './types';
