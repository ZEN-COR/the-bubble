"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { fieldLimits } from "@/lib/validation/limits";

export function RequestDialog({
  recipientName,
  open,
  onOpenChange,
  onSend,
  defaultOpener = "",
}: {
  recipientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend?: (opener: string) => void;
  defaultOpener?: string;
}) {
  const [opener, setOpener] = useState(defaultOpener);

  function send() {
    onSend?.(opener.trim());
    setOpener("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with {recipientName}</DialogTitle>
          <DialogDescription>
            {onSend
              ? "This request stays in the prototype on this browser."
              : "Requests are not sent in this build. Nothing you type here is saved."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label htmlFor="connection-opener">Optional starter</Label>
          <textarea
            id="connection-opener"
            maxLength={fieldLimits.opener}
            disabled={!onSend}
            value={opener}
            onChange={(event) => setOpener(event.target.value)}
            placeholder="Say why you wanted to connect"
            className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!onSend} onClick={send}>
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
