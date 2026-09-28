import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/common/SocialIcons";
import type { SocialLinkItem } from "../types/portfolio";

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    name: "GitHub",
    href: "https://github.com/pgorai45",
    icon: GithubIcon,
    label: "Visit Prasanta Gorai's GitHub profile",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/prasanta-gorai-8a77813a6/",
    icon: LinkedinIcon,
    label: "Connect with Prasanta Gorai on LinkedIn",
  },
  {
    name: "Email",
    href: "mailto:aboy71157@gmail.com",
    icon: Mail,
    label: "Send an email to Prasanta Gorai",
  },
];
