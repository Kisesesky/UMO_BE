// src/modules/rewards/constants/reward-types.ts
export const REWARD_TYPE = {
  NONE: 'none',
  INVITE: 'INVITE',
  INVITED: 'INVITED',
} as const;

export type RewardType = typeof REWARD_TYPE[keyof typeof REWARD_TYPE];

export const REWARD_TYPE_VALUES = Object.values(REWARD_TYPE);
