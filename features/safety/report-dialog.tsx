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

const reasons = [
  "Harassment",
  "Impersonation",
  "Spam",
  "Inappropriate content",
  "Other",
] as const;

export function ReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  function submit() {
    if (!reason) return;
    onSubmit?.(reason);
    setReason("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report</DialogTitle>
          <DialogDescription>
            {onSubmit
              ? "This receipt stays in the prototype. The reported person does not see it."
              : "Reports are not submitted in this build. Moderators cannot see this form yet."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="report-reason">Reason</Label>
            <select
              id="report-reason"
              disabled={!onSubmit}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="h-11 rounded-lg border border-input bg-transparent px-3"
            >
              <option value="">Choose a reason</option>
              {reasons.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="report-details">Details</Label>
            <textarea
              id="report-details"
              maxLength={fieldLimits.reportDetails}
              disabled={!onSubmit}
              className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" disabled={!onSubmit || reason.length === 0} onClick={submit}>
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
