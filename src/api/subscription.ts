export type SubscriptionStatus = {
  status: 'free' | 'premium';
  renewalDate?: string;
};

export async function fetchSubscription(): Promise<SubscriptionStatus> {
  await new Promise((r) => setTimeout(r, 300));
  return { status: 'free' };
}

export async function upgrade(): Promise<SubscriptionStatus> {
  await new Promise((r) => setTimeout(r, 300));
  return { status: 'premium', renewalDate: new Date().toISOString() };
}
