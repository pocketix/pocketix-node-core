import {baseQueryFromTo} from './queryFromTo';
import {convertToAcceptableFormat} from './convertToAcceptableFormat';
import {ComparisonOperator} from '../influxTypes';
import {fluxString, toFluxValue} from '@influxdata/influxdb-client';

const operatorMapping = {
    eq: '==',
    lt: '<',
    gt: '>',
    leq: '<=',
    geq: '>='
};

const createFilter = (values: {[key: string]: any}, operator: ComparisonOperator) => Object.entries(values).map(([key, value]) => `
    (r["_field"] == ${fluxString(key)} and r["_value"] ${operatorMapping[operator]} ${toFluxValue(value)})
`).join(' or ');

const lastOccurrenceOfValue = (imports: string,
                               bucket: string,
                               time: string,
                               joinedSensors: string,
                               aggregate: string,
                               operator: ComparisonOperator,
                               value: {[key: string]: any}) => `
    ${baseQueryFromTo(imports, bucket, time, joinedSensors, aggregate)}
    |> filter(fn: (r) => ${createFilter(value, operator)})
    |> last()
    ${convertToAcceptableFormat}
`;

export {lastOccurrenceOfValue};
