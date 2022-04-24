/**
 * Comparer function for the keyvalue pipe that does not switch the order of the items around
 */
const originalOrder = (_: any, __: any): number => {
  return 0;
};

export {originalOrder};
