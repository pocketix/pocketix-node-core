import {fluxExpression, fluxString} from '@influxdata/influxdb-client';
import {convertToAcceptableFormat} from './convertToAcceptableFormat';

const baseQueryFromTo = (imports: string, bucket: string, time: string, joinedSensors: string, aggregate: string) =>
    `${imports}from(bucket: ${fluxString(bucket)})
        |> range(${fluxExpression(time)})
        |> filter(fn: (r) => ${fluxExpression(joinedSensors)})
        ${aggregate}
`;

const queryFromTo = (imports: string, bucket: string, time: string, joinedSensors: string, aggregate: string) => `
    ${baseQueryFromTo(imports, bucket, time, joinedSensors, aggregate)}
    ${convertToAcceptableFormat}
`;

export {queryFromTo, baseQueryFromTo};
