import {fluxDateTime, fluxExpression, fluxString} from '@influxdata/influxdb-client';
import {convertToAcceptableFormat} from './convertToAcceptableFormat';


const createVariableDeclaration = (variableName: string, start: Date) => `
    ${fluxExpression(variableName)} = data
        |> getSubSectionAggregation(currentStart: ${fluxDateTime(start.toISOString())})
`;

const prepareStarts = (starts: Date[]) => starts.reduce(((previousValue, currentValue, index) => {
    const variableName = `var${index}`;
    previousValue.variableDeclarations.push(createVariableDeclaration(variableName, currentValue));
    previousValue.variableNames.push(variableName);

    return previousValue;
}), {variableDeclarations: [], variableNames: []} as {variableDeclarations: string[], variableNames: string[]});

const parameterAggregationWithMultipleStarts = (bucket: string,
                                                time: string,
                                                joinedSensors: string,
                                                aggregation: string,
                                                starts: Date[]) => {
    const variables = prepareStarts(starts);

    return `data = from(bucket: ${fluxString(bucket)})
        |> range(${fluxExpression(time)})
        |> filter(fn: (r) => ${fluxExpression(joinedSensors)})

    getSubSectionAggregation = (table=<-, currentStart) => table
        |> range(start: currentStart)
        |> ${fluxExpression(aggregation)}()
        |> map(fn: (r) => ({r with _time: r["_start"]}))
    ${variables.variableDeclarations.join('\n')}
    union(tables: [${variables.variableNames.join(', ')}])
    ${convertToAcceptableFormat}
    `;
};

export {parameterAggregationWithMultipleStarts};
