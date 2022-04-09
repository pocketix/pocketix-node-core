const convertToAcceptableFormat = `
|> drop(columns: ["_start", "_stop", "host"])
        |> pivot(columnKey: ["_field"], rowKey: ["_measurement", "_time"], valueColumn: "_value")
        |> rename(columns: {_time: "time", _measurement: "sensor"})
        |> group(columns: ["measurement"], mode: "by")
`;

export {convertToAcceptableFormat};
