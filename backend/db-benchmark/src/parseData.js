import fs from "fs";

const data = JSON.parse(fs.readFileSync("data.txt"));

const transformed = data.flatMap(sensorSeries => sensorSeries.data.map(item => ({
    _id: {"$oid": item.time},
    date: {"$date": item.time},
    sensor: item.sensor,
    battery: item.battery,
    humidity: item.humidity,
    signal: item.signal,
    temperature: item.temperature
})));

fs.writeFile("dataAsJson2.json", JSON.stringify(transformed, null, 2), () => {});
