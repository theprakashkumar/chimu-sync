import { format, formatDistanceToNowStrict, isPast } from "date-fns";
import { Laptop, type LucideIcon, Smartphone } from "lucide-react";
import type { IDevice } from "ua-parser-js";
import { UAParser } from "ua-parser-js";

interface SessionInfo {
  deviceType: IDevice["type"] | "Desktop"; // UAParser can return undefined, so add Desktop fallback
  browser: string;
  os: string;
  timeAgo: string;
  icon: LucideIcon;
}

export const parseSession = (
  userAgent: string,
  createdAt: string,
): SessionInfo => {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || "Desktop";
  const browser = `${result.browser.name}` || "Web";
  const os = `${result.os.name} ${result.os.version}`;

  // Choose an icon based on device type
  const icon = deviceType === "mobile" ? Smartphone : Laptop;

  // Format expiration information
  const formattedAt = isPast(new Date(createdAt))
    ? `${formatDistanceToNowStrict(new Date(createdAt))} ago`
    : format(new Date(createdAt), "d MMM, yyyy");

  return {
    deviceType,
    browser,
    os,
    timeAgo: formattedAt,
    icon,
  };
};
