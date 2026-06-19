type TrialUser = {
  subscriptionPlan?: string;
  trialEndDate?: string;
  subscriptionEndDate?: string;
};

export const isTrialExpired = (user?: TrialUser | null): boolean => {
  if (!user || user.subscriptionPlan !== "trial") {
    return false;
  }

  const endDate = user.trialEndDate ?? user.subscriptionEndDate;
  if (!endDate) {
    return false;
  }

  const endTime = Date.parse(endDate);
  if (Number.isNaN(endTime)) {
    return false;
  }

  return Date.now() > endTime;
};

export const getTrialExpiryLabel = (endDate?: string): string => {
  if (!endDate) {
    return "";
  }

  const endTime = Date.parse(endDate);
  if (Number.isNaN(endTime)) {
    return "";
  }

  const date = new Date(endTime);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const daysRemaining = Math.ceil((endTime - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysRemaining < 0) {
    return `Expired on ${formattedDate}`;
  }

  if (daysRemaining === 0) {
    return `Expires today, ${formattedDate}`;
  }

  return `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left, ${formattedDate}`;
};
