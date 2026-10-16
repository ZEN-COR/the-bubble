import Link from "next/link";

import { PlaceholderArt, sceneFromText } from "@/components/brand/placeholder-art";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function EventCard({
  id,
  title,
  startsAtLabel,
  locationLabel,
  relevance,
  organizerVerified,
  href,
  going = false,
  onGoing,
}: {
  id: string;
  title: string;
  startsAtLabel: string;
  locationLabel: string;
  relevance: string;
  organizerVerified: boolean;
  href?: string;
  going?: boolean;
  onGoing?: () => void;
}) {
  return (
    <Card>
      <PlaceholderArt scene={sceneFromText(`${title} ${relevance}`)} />
      <CardHeader>
        <CardTitle>
          {href ? (
            <Link href={href} className="hover:underline">
              {title}
            </Link>
          ) : (
            title
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{startsAtLabel}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p>{locationLabel}</p>
        <p>{relevance}</p>
        {organizerVerified ? (
          <Badge>Verified organizer</Badge>
        ) : (
          <Badge variant="outline">Student-created</Badge>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        {href ? <Button asChild variant="outline"><Link href={href}>View details</Link></Button> : null}
        <Button
          type="button"
          disabled={!onGoing}
          variant={going ? "secondary" : "default"}
          onClick={onGoing}
          aria-pressed={onGoing ? going : undefined}
          aria-describedby={onGoing ? undefined : `${id}-rsvp-unavailable`}
        >
          {going ? "Going" : "RSVP going"}
        </Button>
        {onGoing ? null : (
          <p id={`${id}-rsvp-unavailable`} className="sr-only">
            RSVP is not available in this build.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
