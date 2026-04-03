import { add } from "date-fns";

const thirtyDaysFromNow = (): Date => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

const threeMinutesAgo = (): Date => new Date(Date.now() - 3 * 60 * 1000);

const fortyFiveMinutesFromNow = (): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 45);
  return now;
}

const calculateExpirationDate = (expiresIn: string = "15m"): Date => {
  const match = expiresIn.match(/^(\d+)([mhd])$/);
  if (!match) throw new Error("Invalid format, use like '15m', '1h' or '3d'");

  const [_, value, unit] = match;
  const expirationDate = new Date();

  // Check unit and apply accordingly.
  switch (unit) {
    case "m":
      return add(expirationDate, { minutes: parseInt(value) });
    case "h":
      return add(expirationDate, { hours: parseInt(value) });
    case "d":
      return add(expirationDate, { days: parseInt(value) });
    default:
      throw new Error("Invalid value!")
  }
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export { thirtyDaysFromNow, threeMinutesAgo, fortyFiveMinutesFromNow, calculateExpirationDate, ONE_DAY_MS }