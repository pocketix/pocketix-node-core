import {fluxExpression, fluxString} from '@influxdata/influxdb-client';
import {convertToAcceptableFormat} from './convertToAcceptableFormat';

const differenceBetweenFirstAndLast = (imports: string, bucket: string, time: string, joinedSensors: string, aggregate: string) =>
    `${imports}
    data = from(bucket: ${fluxString(bucket)})
        |> range(${fluxExpression(time)})
        |> filter(fn: (r) => ${fluxExpression(joinedSensors)})
        ${aggregate}

    first = data
        |> first()

    last = data
        |> last()

    union(tables: [first, last])
        |> sort(columns: ["_time"])
        |> difference()
        ${convertToAcceptableFormat}
`;

export {differenceBetweenFirstAndLast};
