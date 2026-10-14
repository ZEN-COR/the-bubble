export const fixturePeople = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    displayName: "Avery Chen",
    degree: "BSc",
    major: "Computer Science",
    sharedTags: ["COMP261", "Algorithms"],
    explanation: "Both take COMP261",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    displayName: "Jordan Blake",
    degree: "BSc",
    major: "Computer Science",
    sharedTags: ["COMP261", "Hiking"],
    explanation: "Both take COMP261",
  },
] as const;

export const fixtureEvents = [
  {
    id: "dddddddd-dddd-4ddd-8ddd-ddddddddddd1",
    title: "Algorithms catch-up",
    startsAtLabel: "Tue, 3 Nov 2026, 5:30 pm NZDT",
    locationLabel: "Kelburn campus, library foyer",
    relevance: "Shared interest: Algorithms",
    organizerVerified: false,
  },
] as const;

export const fixtureGroups = [
  {
    id: "cccccccc-cccc-4ccc-8ccc-ccccccccccc1",
    name: "COMP261 study circle",
    description: "A student-run group for working through algorithms problems together.",
    memberCount: 2,
  },
] as const;
