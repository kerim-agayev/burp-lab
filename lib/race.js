// Shared in-memory state for the race-condition lab (one gift card, one-time use).
export const giftState = {
  vuln: { redeemed: false, balance: 0 },
  secure: { redeemed: false, balance: 0 },
};

export function resetGift(which) {
  giftState[which] = { redeemed: false, balance: 0 };
}
