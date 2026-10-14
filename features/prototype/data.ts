export const viewer = {
  displayName: "Alex Reed",
  degree: "BSc",
  major: "Computer Science",
  year: "2nd year",
  courses: ["COMP261"],
  interests: ["Algorithms"],
  campusDays: ["Monday", "Tuesday"],
  portrait: "alex.jpg",
};

export const prototypePeople = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    displayName: "Avery Chen",
    portrait: "avery.jpg",
    degree: "BSc",
    major: "Computer Science",
    year: "2nd year",
    bio: "Looking for a calm study partner for algorithms.",
    tags: ["COMP261", "Algorithms", "Tuesday"],
    explanation: "You share a course, an interest, and a campus day.",
    starter: "Want to work through the algorithms sheet at the library foyer?",
    filters: ["COMP261", "Algorithms", "Tuesday"],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    displayName: "Jordan Blake",
    portrait: "jordan.jpg",
    degree: "BSc",
    major: "Computer Science",
    year: "2nd year",
    bio: "Happy to meet in a public campus space.",
    tags: ["COMP261", "Hiking"],
    explanation: "You share COMP261.",
    starter: "Keen to compare notes before the catch-up?",
    filters: ["COMP261"],
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    displayName: "Casey Morgan",
    portrait: "casey.jpg",
    degree: "BCom",
    major: "Information Systems",
    year: "3rd year",
    bio: "On campus for evening tutorials, then heading home.",
    tags: ["Evening study", "Tuesday"],
    explanation: "You are both on campus Tuesday evening.",
    starter: "I am around after the Tuesday tutorial if you want a short study table.",
    filters: ["Evening", "Tuesday"],
  },
] as const;

export const prototypeEvents = [
  {
    id: "dddddddd-dddd-4ddd-8ddd-ddddddddddd1",
    title: "Algorithms catch-up",
    startsAtLabel: "Tue, 3 Nov 2026, 5:30 pm NZDT",
    startsAt: "2026-11-03T04:30:00.000Z",
    endsAtLabel: "7:00 pm",
    locationLabel: "Kelburn campus, library foyer",
    relevance: "Shared interest: Algorithms",
    organizerVerified: false,
    organizer: "Avery Chen",
    summary: "A student-created session for COMP261 problems. The organizer is not a verified club.",
    filters: ["Evening"],
    visibleAttendees: ["11111111-1111-4111-8111-111111111111"],
  },
  {
    id: "dddddddd-dddd-4ddd-8ddd-ddddddddddd2",
    title: "Employer conversations",
    startsAtLabel: "Thu, 5 Nov 2026, 6:00 pm NZDT",
    startsAt: "2026-11-05T05:00:00.000Z",
    endsAtLabel: "7:30 pm",
    locationLabel: "Kelburn campus, student union lounge",
    relevance: "Career, evening",
    organizerVerified: false,
    organizer: "Jordan Blake",
    summary:
      "A student-organised evening to practise talking with employers. This is not a university careers service.",
    filters: ["Evening", "Career"],
    visibleAttendees: ["22222222-2222-4222-8222-222222222222"],
  },
  {
    id: "dddddddd-dddd-4ddd-8ddd-ddddddddddd3",
    title: "Tuesday tutorial hangout",
    startsAtLabel: "Tue, 3 Nov 2026, 7:15 pm NZDT",
    startsAt: "2026-11-03T06:15:00.000Z",
    endsAtLabel: "8:00 pm",
    locationLabel: "Kelburn campus, library foyer",
    relevance: "Evening, low commitment",
    organizerVerified: false,
    organizer: "Casey Morgan",
    summary: "A short hangout after the evening tutorial. Stay for as long as you like.",
    filters: ["Evening"],
    visibleAttendees: ["66666666-6666-4666-8666-666666666666"],
  },
  {
    id: "dddddddd-dddd-4ddd-8ddd-ddddddddddd4",
    title: "Weekend board games",
    startsAtLabel: "Sat, 7 Nov 2026, 2:00 pm NZDT",
    startsAt: "2026-11-07T01:00:00.000Z",
    endsAtLabel: "4:00 pm",
    locationLabel: "Kelburn campus, student union lounge",
    relevance: "Shared interest: Board games",
    organizerVerified: false,
    organizer: "Jordan Blake",
    summary: "A one-off student meetup. Attendance stays private unless someone opts in.",
    filters: ["Weekend"],
    visibleAttendees: ["22222222-2222-4222-8222-222222222222"],
  },
] as const;

export const prototypeGroups = [
  {
    id: "cccccccc-cccc-4ccc-8ccc-ccccccccccc1",
    name: "COMP261 study circle",
    description: "A student-run group for working through algorithms problems together.",
    memberCount: 2,
    privacy: "public",
    members: ["Avery Chen", "Jordan Blake"],
    eventId: prototypeEvents[0].id,
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-ccccccccccc3",
    name: "Kelburn hikers",
    description: "Weekend walks that start and end on campus.",
    memberCount: 4,
    privacy: "public",
    members: ["Jordan Blake"],
    eventId: null,
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-ccccccccccc2",
    name: "Evening commuters",
    description: "A private group for students who are on campus later in the day.",
    memberCount: 3,
    privacy: "invite",
    members: ["Casey Morgan"],
    eventId: prototypeEvents[2].id,
  },
] as const;

export const peopleFilters = ["All", "COMP261", "Algorithms", "Tuesday", "Evening"] as const;
export const eventFilters = ["All", "Evening", "Weekend", "Career"] as const;

export const meetupSuggestion =
  "Would Tuesday at 5:00 pm in the library foyer work?";

export function personById(id: string) {
  return prototypePeople.find((person) => person.id === id);
}

export function eventById(id: string) {
  return prototypeEvents.find((event) => event.id === id);
}

export function groupById(id: string) {
  return prototypeGroups.find((group) => group.id === id);
}
