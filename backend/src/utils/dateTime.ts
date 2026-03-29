const thirtyDaysFromNow = (): Date => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

const fortyFiveMinutesFromNow = (): Date => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 45);
  return now;
}

export { thirtyDaysFromNow, fortyFiveMinutesFromNow }