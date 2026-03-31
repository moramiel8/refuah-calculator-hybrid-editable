import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserBadges } from "@/shared/ui";
import { getProminentRole } from "@/shared/lib/profileRoles";
import { useRoleColors } from "@/shared/lib/useRoleColors";

interface MentionRendererProps {
  content: string;
}

type MentionSegment =
  | { type: "text"; value: string }
  | { type: "mention"; value: string };

const PLAIN_MENTION_REGEX = /@([\w\u0590-\u05FF.-]+)/g;

interface MentionProfile {
  primaryRole?: string;
  role: string;
  badges?: string[];
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  username: string | null;
}

/** Batch-fetch profiles for all mentioned usernames */
function useMentionedProfiles(usernames: string[]) {
  return useQuery({
    queryKey: ["mention-profiles", usernames],
    queryFn: async () => {
      if (!usernames.length) return {};
      const { data } = await supabase
        .from("profiles")
        .select("username, role, primary_role, badges, is_admin, first_name, last_name, avatar_url")
        .in("username", usernames);
      if (!data) return {};
      const map: Record<string, MentionProfile> = {};
      for (const p of data) {
        if (p.username) {
          map[p.username.toLowerCase()] = {
            primaryRole: p.primary_role,
            role: p.role || "user",
            badges: p.badges ?? (p.role === "supporter" ? ["supporter"] : []),
            firstName: p.first_name || "",
            lastName: p.last_name || "",
            avatarUrl: p.avatar_url,
            username: p.username,
          };
        }
      }
      return map;
    },
    enabled: usernames.length > 0,
    staleTime: 60_000,
  });
}

const MentionChip: React.FC<{ username: string; profile: MentionProfile | undefined }> = ({ username, profile }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { getNameStyle } = useRoleColors();

  const prominentRole = getProminentRole({
    primaryRole: profile?.primaryRole,
    role: profile?.role,
    badges: profile?.badges,
  });

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : username;
  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.trim() || "?"
    : username[0]?.toUpperCase() || "?";
  const profilePath = `/profile/u/${username}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={(e) => {
            e.stopPropagation();
            navigate(profilePath);
          }}
          className="cursor-pointer font-bold hover:underline"
          style={prominentRole !== "user" ? getNameStyle(prominentRole) : undefined}
        >
          @{username}
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        className="w-56 p-3"
        sideOffset={8}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-2 text-center" dir="rtl">
          <Avatar className="h-12 w-12">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={displayName} />}
            <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground whitespace-nowrap">{displayName}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">@{username}</p>
          </div>
          {profile && (
            <UserBadges primaryRole={profile.primaryRole} role={profile.role} badges={profile.badges} size="sm" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              navigate(profilePath);
            }}
            className="mt-1 w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            צפייה בפרופיל
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

function extractMentionSegments(content: string): MentionSegment[] {
  if (!content) return [{ type: "text", value: "" }];

  const parseTextWithMentions = (value: string): MentionSegment[] => {
    if (!value) return [];
    const segments: MentionSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const regex = new RegExp(PLAIN_MENTION_REGEX.source, "g");

    while ((match = regex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: "text", value: value.slice(lastIndex, match.index) });
      }
      segments.push({ type: "mention", value: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < value.length) {
      segments.push({ type: "text", value: value.slice(lastIndex) });
    }

    return segments.length ? segments : [{ type: "text", value }];
  };

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return parseTextWithMentions(content);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const segments: MentionSegment[] = [];

  const pushText = (value: string) => {
    if (!value) return;
    const last = segments[segments.length - 1];
    if (last?.type === "text") {
      last.value += value;
      return;
    }
    segments.push({ type: "text", value });
  };

  const pushMention = (value: string) => {
    const cleaned = value.replace(/^@/, "").trim();
    if (!cleaned) return;
    segments.push({ type: "mention", value: cleaned });
  };

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const segment of parseTextWithMentions(node.textContent ?? "")) {
        if (segment.type === "mention") {
          pushMention(segment.value);
        } else {
          pushText(segment.value);
        }
      }
      return;
    }

    if (!(node instanceof HTMLElement)) return;

    if (node.dataset.type === "mention") {
      pushMention(node.dataset.label || node.textContent || "");
      return;
    }

    if (node.tagName === "BR") {
      pushText("\n");
      return;
    }

    const isBlock = ["P", "DIV", "LI"].includes(node.tagName);
    for (const child of Array.from(node.childNodes)) {
      walk(child);
    }
    if (isBlock) {
      pushText("\n");
    }
  };

  for (const child of Array.from(doc.body.childNodes)) {
    walk(child);
  }

  return segments.length ? segments : [{ type: "text", value: doc.body.textContent ?? "" }];
}

const MentionRenderer: React.FC<MentionRendererProps> = ({ content }) => {
  const parts = useMemo(() => extractMentionSegments(content), [content]);

  const usernames = parts
    .filter((part): part is Extract<MentionSegment, { type: "mention" }> => part.type === "mention")
    .map((part) => part.value);

  const { data: profileMap = {} } = useMentionedProfiles(usernames);

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "text") {
          return <span key={i} className="whitespace-pre-wrap">{part.value}</span>;
        }

        const username = part.value;
        const profile = profileMap[username.toLowerCase()];

        return <MentionChip key={i} username={username} profile={profile} />;
      })}
    </>
  );
};

export default MentionRenderer;
