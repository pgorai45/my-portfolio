import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

export type PortfolioIcon = LucideIcon | ComponentType<{ className?: string }>;

export interface ExploreCardItem {
  id: string;
  title: string;
  description: string;
  icon: PortfolioIcon;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
  glowColor: string;
  actionText?: string;
  targetId?: string;
}

export interface SocialLinkItem {
  name: string;
  href: string;
  icon: PortfolioIcon;
  label: string;
}

export interface TechBadgeItem {
  name: string;
  label: string;
  iconType: "react" | "javascript" | "python" | "database";
  glowColor: string;
  badgeColor: string;
  positionClass: string;
  angle: number;
}
