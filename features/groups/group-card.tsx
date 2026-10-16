import Link from "next/link";

import { PlaceholderArt, sceneFromText } from "@/components/brand/placeholder-art";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function GroupCard({
  id,
  name,
  description,
  memberCount,
  href,
  joined = false,
  onJoin,
  joinLabel,
}: {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  href?: string;
  joined?: boolean;
  onJoin?: () => void;
  joinLabel?: string;
}) {
  const memberLabel = `${memberCount} ${memberCount === 1 ? "member" : "members"}`;

  return (
    <Card>
      <PlaceholderArt scene={sceneFromText(`${name} ${description}`)} />
      <CardHeader>
        <CardTitle>
          {href ? (
            <Link href={href} className="hover:underline">
              {name}
            </Link>
          ) : (
            name
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{memberLabel}</p>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
      <CardFooter className="gap-2">
        {href ? <Button asChild variant="outline"><Link href={href}>Group details</Link></Button> : null}
        <Button
          type="button"
          disabled={!onJoin}
          variant={joined ? "secondary" : "default"}
          onClick={onJoin}
          aria-describedby={onJoin ? undefined : `${id}-join-unavailable`}
        >
          {joinLabel ?? (joined ? "Leave" : "Join")}
        </Button>
        {onJoin ? null : (
          <p id={`${id}-join-unavailable`} className="sr-only">
            Joining groups is not available in this build.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
