import { Subscription } from './SubscriptionDTO';

describe('Subscription', () => {
  it('should create a Subscription instance with the provided values', () => {
    const id = 1;
    const teamId = 2;
    const userId = 3;

    const subscription = new Subscription(id, teamId, userId);

    expect(subscription.id).toBe(id);
    expect(subscription.team_id).toBe(teamId);
    expect(subscription.user_id).toBe(userId);
  });
});
