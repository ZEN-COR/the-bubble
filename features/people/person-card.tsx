import Link from "next/link";

import { PlaceholderArt, sceneFromText } from "@/components/brand/placeholder-art";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonCard({
  id,
  displayName,
  degree,
  major,
  year,
  sharedTags,
  explanation,
  portraitSrc,
  profileHref,
  actionLabel = "Connect",
  onAction,
  unavailableLabel = "Connection requests are not available in this build.",
}: {
  id: string;
  displayName: string;
  degree?: string | null;
  major?: string | null;
  year?: string | null;
  sharedTags: string[];
  explanation: string;
  portraitSrc?: string;
  profileHref?: string;
  actionLabel?: string;
  onAction?: () => void;
  unavailableLabel?: string;
}) {
  const studyLine = [degree, major, year].filter(Boolean).join(", ");
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Card>
      <PlaceholderArt scene={sceneFromText(sharedTags.join(" "))} />
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg" className="size-11">
            {portraitSrc ? <AvatarImage src={portraitSrc} alt="" /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>
              {profileHref ? (
                <Link href={profileHref} className="hover:underline">
                  {displayName}
                </Link>
              ) : (
                displayName
              )}
            </CardTitle>
            {studyLine ? <p className="text-sm text-muted-foreground">{studyLine}</p> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sharedTags.length > 0 ? (
          <ul aria-label="Shared tags" className="flex flex-wrap gap-2">
            {sharedTags.map((tag) => (
              <li key={tag}>
                <Badge variant="secondary">{tag}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
        <p>{explanation}</p>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          disabled={!onAction}
          onClick={onAction}
          aria-describedby={onAction ? undefined : `${id}-connect-unavailable`}
        >
          {actionLabel}
        </Button>
        {onAction ? null : (
          <p id={`${id}-connect-unavailable`} className="sr-only">
            {unavailableLabel}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
