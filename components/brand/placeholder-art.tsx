import { cn } from "@/lib/utils";

export type Scene =
  | "study"
  | "hike"
  | "evening"
  | "career"
  | "games"
  | "group"
  | "discover"
  | "connect"
  | "meet";

export function sceneFromText(text: string): Scene {
  const value = text.toLowerCase();
  if (value.includes("hik")) return "hike";
  if (value.includes("career") || value.includes("employer")) return "career";
  if (value.includes("game") || value.includes("weekend")) return "games";
  if (value.includes("evening") || value.includes("commuter")) return "evening";
  if (value.includes("group") || value.includes("circle")) return "group";
  return "study";
}

export function PlaceholderArt({
  scene,
  bleed = true,
  className,
}: {
  scene: Scene;
  bleed?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-[4.5rem] overflow-hidden bg-[#d7f0e3]",
        bleed ? "-mx-(--card-spacing) -mt-(--card-spacing) mb-1" : "rounded-[20px]",
        className,
      )}
    >
      <svg viewBox="0 0 320 72" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <SceneGraphic scene={scene} />
      </svg>
    </div>
  );
}

function SceneGraphic({ scene }: { scene: Scene }) {
  if (scene === "hike") {
    return (
      <>
        <circle cx="250" cy="22" r="10" fill="#f4d35e" />
        <path d="M0 56c40-18 70-18 110 0s70 18 110 0 70-18 100 0v16H0Z" fill="#187a4c" />
        <path d="M40 58c24-12 40-12 64 0v14H40Z" fill="#125c3a" />
        <rect x="168" y="34" width="6" height="18" rx="3" fill="#125c3a" />
        <circle cx="171" cy="30" r="8" fill="#3eae78" />
      </>
    );
  }

  if (scene === "evening") {
    return (
      <>
        <rect width="320" height="72" fill="#125c3a" />
        <circle cx="248" cy="24" r="10" fill="#f4d35e" />
        <circle cx="254" cy="22" r="8" fill="#125c3a" />
        <rect x="36" y="22" width="52" height="36" rx="8" fill="#d7f0e3" />
        <path d="M48 40h8M68 40h8M48 50h28" stroke="#187a4c" strokeWidth="3" strokeLinecap="round" />
      </>
    );
  }

  if (scene === "career") {
    return (
      <>
        <circle cx="118" cy="30" r="12" fill="#187a4c" />
        <circle cx="176" cy="30" r="12" fill="#3eae78" />
        <rect x="96" y="46" width="44" height="18" rx="9" fill="#187a4c" />
        <rect x="154" y="46" width="44" height="18" rx="9" fill="#3eae78" />
        <rect x="200" y="16" width="46" height="22" rx="8" fill="#ffffff" />
      </>
    );
  }

  if (scene === "games") {
    return (
      <>
        <rect x="90" y="34" width="140" height="22" rx="8" fill="#187a4c" />
        <circle cx="128" cy="30" r="10" fill="#f4d35e" />
        <circle cx="160" cy="26" r="10" fill="#3eae78" />
        <circle cx="192" cy="30" r="10" fill="#125c3a" />
      </>
    );
  }

  if (scene === "group") {
    return (
      <>
        <circle cx="128" cy="28" r="12" fill="#3eae78" />
        <circle cx="160" cy="24" r="14" fill="#187a4c" />
        <circle cx="192" cy="28" r="12" fill="#125c3a" />
        <rect x="108" y="44" width="40" height="16" rx="8" fill="#3eae78" />
        <rect x="140" y="42" width="40" height="18" rx="9" fill="#187a4c" />
        <rect x="172" y="44" width="40" height="16" rx="8" fill="#125c3a" />
      </>
    );
  }

  if (scene === "discover") {
    return (
      <>
        <circle cx="150" cy="32" r="16" fill="none" stroke="#187a4c" strokeWidth="6" />
        <path d="M162 44l16 16" stroke="#125c3a" strokeWidth="6" strokeLinecap="round" />
        <circle cx="220" cy="24" r="8" fill="#3eae78" />
      </>
    );
  }

  if (scene === "connect") {
    return (
      <>
        <circle cx="132" cy="36" r="18" fill="#3eae78" />
        <circle cx="168" cy="36" r="18" fill="#187a4c" />
        <circle cx="150" cy="36" r="6" fill="#ffffff" />
      </>
    );
  }

  if (scene === "meet") {
    return (
      <>
        <path d="M160 14c-12 0-20 8-20 18 0 16 20 28 20 28s20-12 20-28c0-10-8-18-20-18Z" fill="#187a4c" />
        <circle cx="160" cy="32" r="6" fill="#ffffff" />
        <path d="M0 58c50-10 80-10 130 0s80 10 190 0v14H0Z" fill="#d7f0e3" />
      </>
    );
  }

  return (
    <>
      <rect x="40" y="18" width="64" height="40" rx="6" fill="#ffffff" />
      <path d="M52 32h40M52 42h24" stroke="#187a4c" strokeWidth="3" strokeLinecap="round" />
      <circle cx="168" cy="26" r="12" fill="#187a4c" />
      <rect x="148" y="42" width="40" height="16" rx="8" fill="#3eae78" />
      <rect x="214" y="30" width="56" height="8" rx="4" fill="#125c3a" />
      <rect x="214" y="42" width="40" height="8" rx="4" fill="#187a4c" />
    </>
  );
}
