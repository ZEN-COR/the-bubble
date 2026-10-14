"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { prototypePeople } from "@/features/prototype/data";

export type ChatMessage = {
  id: string;
  from: "you" | "them";
  body: string;
  time: string;
};

export type PrototypeReport = {
  id: string;
  subject: string;
  reason: string;
  status: "open" | "triaged" | "resolved";
};

type PrototypeState = {
  displayName: string;
  discoverable: boolean;
  shareCampusDays: boolean;
  lifeStageOptIn: boolean;
  alerts: { events: boolean; connections: boolean; messages: boolean };
  sent: Record<string, string>;
  incoming: Record<string, { opener: string; status: "pending" | "accepted" | "declined" }>;
  connected: string[];
  rsvps: Record<string, "going" | "not_going">;
  groups: string[];
  threads: Record<string, ChatMessage[]>;
  reports: PrototypeReport[];
  blocked: string[];
};

const jordanId = "22222222-2222-4222-8222-222222222222";
const caseyId = "66666666-6666-4666-8666-666666666666";
const algorithmsId = "dddddddd-dddd-4ddd-8ddd-ddddddddddd1";

const initialState: PrototypeState = {
  displayName: "Alex Reed",
  discoverable: true,
  shareCampusDays: true,
  lifeStageOptIn: false,
  alerts: { events: true, connections: true, messages: true },
  sent: {},
  incoming: {
    [caseyId]: {
      opener: "I am on campus Tuesday evenings if you want a study table.",
      status: "pending",
    },
  },
  connected: [jordanId],
  rsvps: { [algorithmsId]: "going" },
  groups: [],
  threads: {
    [jordanId]: [
      {
        id: "seed-jordan",
        from: "them",
        body: "Want to meet at the library foyer before the algorithms catch-up?",
        time: "5:12 pm",
      },
    ],
  },
  reports: [],
  blocked: [],
};

type PrototypeContextValue = {
  state: PrototypeState;
  people: ReadonlyArray<(typeof prototypePeople)[number]>;
  pendingCount: number;
  reset: () => void;
  setDisplayName: (name: string) => void;
  setDiscoverable: (value: boolean) => void;
  setShareCampusDays: (value: boolean) => void;
  setLifeStageOptIn: (value: boolean) => void;
  setAlert: (key: keyof PrototypeState["alerts"], value: boolean) => void;
  sendRequest: (personId: string, opener: string) => void;
  accept: (personId: string) => void;
  previewAccept: (personId: string) => void;
  decline: (personId: string) => void;
  rsvp: (eventId: string, status: "going" | "not_going") => void;
  toggleGroup: (groupId: string) => void;
  sendMessage: (personId: string, body: string) => void;
  report: (subject: string, reason: string) => void;
  setReportStatus: (id: string, status: PrototypeReport["status"]) => void;
  block: (personId: string) => void;
  relation: (personId: string) => "connected" | "sent" | "incoming" | "none";
};

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PrototypeState>(initialState);

  const value = useMemo<PrototypeContextValue>(() => {
    const pendingCount = Object.values(state.incoming).filter(
      (request) => request.status === "pending",
    ).length;

    return {
      state,
      people: prototypePeople.filter((person) => !state.blocked.includes(person.id)),
      pendingCount,
      reset: () => setState(initialState),
      setDisplayName: (name) => setState((current) => ({ ...current, displayName: name })),
      setDiscoverable: (discoverable) => setState((current) => ({ ...current, discoverable })),
      setShareCampusDays: (shareCampusDays) =>
        setState((current) => ({ ...current, shareCampusDays })),
      setLifeStageOptIn: (lifeStageOptIn) =>
        setState((current) => ({ ...current, lifeStageOptIn })),
      setAlert: (key, alertValue) =>
        setState((current) => ({
          ...current,
          alerts: { ...current.alerts, [key]: alertValue },
        })),
      sendRequest: (personId, opener) =>
        setState((current) => {
          if (current.connected.includes(personId) || personId in current.sent) return current;
          return { ...current, sent: { ...current.sent, [personId]: opener } };
        }),
      accept: (personId) =>
        setState((current) => {
          const request = current.incoming[personId];
          if (!request || request.status !== "pending") return current;
          return {
            ...current,
            incoming: {
              ...current.incoming,
              [personId]: { ...request, status: "accepted" },
            },
            connected: current.connected.includes(personId)
              ? current.connected
              : [...current.connected, personId],
            threads: current.threads[personId]
              ? current.threads
              : {
                  ...current.threads,
                  [personId]: [
                    {
                      id: `open-${personId}`,
                      from: "them",
                      body: request.opener,
                      time: "Just now",
                    },
                  ],
                },
          };
        }),
      previewAccept: (personId) =>
        setState((current) => {
          if (!(personId in current.sent) || current.connected.includes(personId)) return current;
          const opener = current.sent[personId];
          const sent = { ...current.sent };
          delete sent[personId];
          return {
            ...current,
            sent,
            connected: [...current.connected, personId],
            threads: {
              ...current.threads,
              [personId]: [
                ...(current.threads[personId] ?? []),
                {
                  id: `accept-${personId}`,
                  from: "them",
                  body: opener
                    ? `Sounds good. ${opener}`
                    : "Happy to meet. Tuesday at the library foyer works for me.",
                  time: "Just now",
                },
              ],
            },
          };
        }),
      decline: (personId) =>
        setState((current) => {
          const request = current.incoming[personId];
          if (!request) return current;
          return {
            ...current,
            incoming: {
              ...current.incoming,
              [personId]: { ...request, status: "declined" },
            },
          };
        }),
      rsvp: (eventId, status) =>
        setState((current) => ({
          ...current,
          rsvps: { ...current.rsvps, [eventId]: status },
        })),
      toggleGroup: (groupId) =>
        setState((current) => ({
          ...current,
          groups: current.groups.includes(groupId)
            ? current.groups.filter((id) => id !== groupId)
            : [...current.groups, groupId],
        })),
      sendMessage: (personId, body) =>
        setState((current) => ({
          ...current,
          threads: {
            ...current.threads,
            [personId]: [
              ...(current.threads[personId] ?? []),
              { id: `you-${Date.now()}`, from: "you", body, time: "Just now" },
            ],
          },
        })),
      report: (subject, reason) =>
        setState((current) => ({
          ...current,
          reports: [
            {
              id: `report-${Date.now()}`,
              subject,
              reason,
              status: "open",
            },
            ...current.reports,
          ],
        })),
      setReportStatus: (id, status) =>
        setState((current) => ({
          ...current,
          reports: current.reports.map((report) =>
            report.id === id ? { ...report, status } : report,
          ),
        })),
      block: (personId) =>
        setState((current) => ({
          ...current,
          blocked: current.blocked.includes(personId)
            ? current.blocked
            : [...current.blocked, personId],
        })),
      relation: (personId) => {
        if (state.connected.includes(personId)) return "connected";
        if (personId in state.sent) return "sent";
        if (state.incoming[personId]?.status === "pending") return "incoming";
        return "none";
      },
    };
  }, [state]);

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype() {
  const value = useContext(PrototypeContext);
  if (!value) {
    throw new Error("usePrototype must be used inside PrototypeProvider");
  }
  return value;
}
