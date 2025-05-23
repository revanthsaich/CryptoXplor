const MAX_CALLS = 10;
const TIME_WINDOW = 60 * 1000; // 1 minute

let calls = [];

export const canMakeCall = () => {
  const now = Date.now();
  
  // Remove calls older than the time window
  calls = calls.filter(call => now - call < TIME_WINDOW);
  
  return calls.length < MAX_CALLS;
};

export const recordCall = () => {
  calls.push(Date.now());
};

export const resetRateLimit = () => {
  calls.length = 0;
};
