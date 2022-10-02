/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Aggregation operations that can be used.
 * The '' type represents default aggregation (when used with aggregateMinutes) or no aggregation (when used without).
 */
export enum Operation {
    MEAN = 'mean',
    SUM = 'sum',
    LAST = 'last',
    NONE = 'none',
    COUNT = 'count',
    INTEGRAL = 'integral',
    MEDIAN = 'median',
    MODE = 'mode',
    QUANTILE = 'quantile',
    REDUCE = 'reduce',
    SKEW = 'skew',
    SPREAD = 'spread',
    STDDEV = 'stddev',
    TIME_WEIGHTED_AVG = 'timeWeightedAvg',
}
