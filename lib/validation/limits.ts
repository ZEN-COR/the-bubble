export const fieldLimits = {
  displayName: { min: 1, max: 40 },
  bio: 280,
  degree: 80,
  major: 80,
  lifeStage: 40,
  meetingPreferences: 200,
  opener: 280,
  message: 2000,
  reportDetails: 2000,
  eventTitle: 120,
  eventDescription: 4000,
} as const;
