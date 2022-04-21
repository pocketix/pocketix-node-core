/* tslint:disable */
/* eslint-disable */

/**
 * Aggregation operations that can be used.
 * The '' type represents default aggregation (when used with aggregateMinutes) or no aggregation (when used without).
 */
export enum Operation {
  Mean = 'mean',
  Sum = 'sum',
  Last = 'last',
  _ = '',
  None = 'none',
  Count = 'count',
  Integral = 'integral',
  Median = 'median',
  Mode = 'mode',
  Quantile = 'quantile',
  Reduce = 'reduce',
  Skew = 'skew',
  Spread = 'spread',
  Stddev = 'stddev',
  TimeWeightedAvg = 'timeWeightedAvg'
}
