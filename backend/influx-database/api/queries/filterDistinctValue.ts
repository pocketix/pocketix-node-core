import {toFluxValue} from '@influxdata/influxdb-client';
import {baseQueryFromTo} from './queryFromTo';
import {convertToAcceptableFormat} from './convertToAcceptableFormat';
import {SingleValue} from '../influxTypes';

const valueThen = (value: any, mapTo: number) => `${toFluxValue(value)} then ${toFluxValue(mapTo)}`;

const mapSingleValue = (value: SingleValue, index: number) => {
    if (Array.isArray(value) && (value as any[]).length >= 2) {
        return valueThen(value[0], value[1]);
    }

    return valueThen(value, index);
};

const mapValues = (values: SingleValue[]) => values
    .map((value, index) => mapSingleValue(value, index));

const mapStrings = (values: SingleValue[]) => `|> map(
          fn: (r) => ({r with level_value:
              ${mapValues(values).map(value => `if r._value == ${value}`).join('\n else ')}
              else -1,
          }),
        )`;

const mapFloats = (values: SingleValue[]) => {
    if (values.length) {
        return `|> map(
                    fn: (r) => ({r with level_value:
                        ${mapValues(values).map(value => `if r._value == ${value}`).join('\n else ')}
                        else -1,
                    }),)`;
    }
    else {
        return `|> duplicate(column: "_value", as: "level_value")`;
    }
};

const endFilter = () => `endFilter = (table=<-) => table
                              |> duplicate(column: "level_value", as: "diff")
                              |> difference(columns: ["diff"])
                              |> filter(fn: (r) => r.diff != 0)
                              |> drop(columns: ["diff", "level_value"])
`;

const distinctValues = (isString: boolean, values: SingleValue[]) => `
distincts = (table=<-) =>
    table
        ${isString ? mapStrings(values) : mapFloats(values)}
        |> endFilter()
`;

const filterDistinctValue = (bucket: string,
                             time: string,
                             joinedSensors: string,
                             isString: boolean,
                             shouldCount: boolean,
                             values: SingleValue[],
                             resultTime: Date = new Date()) => `
    import "strings"
    ${endFilter()}
    ${distinctValues(isString, values)}
    ${baseQueryFromTo('', bucket, time, joinedSensors, '')}
    |> distincts()
    ${shouldCount ? `|> count() |> set(key: "_time", value: "${resultTime.toISOString()}")` : ''}
    ${convertToAcceptableFormat}
`;

export {filterDistinctValue};
