# InfluxDataBase
Layer between `InfluxDB` and Services. 
Handles most tasks needed to use the InfluxDB database without the need to write `Flux` queries in both (`Express` and `AWS`) applications.

## Usage
It may be beneficial to wrap this into an injectable service before usage (see the implementation of the `InfluxService` in `express`) 