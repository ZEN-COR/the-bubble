"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { fieldLimits } from "@/lib/validation/limits";

export function ConversationPanel({
  messages,
  onSend,
  suggestions = [],
}: {
  messages: {
    id: string;
    senderName: string;
    body: string;
    sentAtLabel: string;
    sentAt: string;
  }[];
  onSend?: (body: string) => void;
  suggestions?: { label: string; body: string }[];
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!onSend) return;
    const body = String(new FormData(event.currentTarget).get("body") ?? "").trim();
    if (!body) return;
    onSend(body);
    event.currentTarget.reset();
  }

  return (
    <section aria-label="Conversation" className="flex flex-col gap-4">
      <ol aria-label="Messages" className="flex flex-col gap-3">
        {messages.map((message) => (
          <li key={message.id}>
            <article className="rounded-2xl bg-secondary px-3 py-3">
              <p className="text-sm font-medium">{message.senderName}</p>
              <p>{message.body}</p>
              <time dateTime={message.sentAt} className="text-xs text-muted-foreground">
                {message.sentAtLabel}
              </time>
            </article>
          </li>
        ))}
      </ol>
      <form aria-label="Message composer" className="flex flex-col gap-2" onSubmit={submit}>
        <label htmlFor="message-body" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message-body"
          name="body"
          maxLength={fieldLimits.message}
          disabled={!onSend}
          className="min-h-24 w-full rounded-2xl border-0 bg-secondary px-3 py-2 text-base"
        />
        <Button type="submit" disabled={!onSend} aria-describedby="message-unavailable">
          Send
        </Button>
        {onSend
          ? suggestions.map((suggestion) => (
              <Button
                key={suggestion.label}
                type="button"
                variant="secondary"
                onClick={() => onSend(suggestion.body)}
              >
                {suggestion.label}
              </Button>
            ))
          : null}
        <p id="message-unavailable" className="text-sm text-muted-foreground">
          {onSend
            ? "Sent messages stay in this browser."
            : "Messaging is not available in this build."}
        </p>
      </form>
    </section>
  );
}
