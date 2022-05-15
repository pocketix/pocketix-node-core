# Master's thesis monorepo
Monorepo for my master thesis at [BUT](https://www.vut.cz/en)

## Structure
The project has the following structure:
 - `backend` - all backend resources
   - `db-benchmark` - the database benchmark that was used to select the database for storing time series sensor data
   - `InfluxDataBase` - wrapper around the Influx js client. This also acts as a layer between environment dependent controllers / AWS Lambda function handlers
   - `express` - Express.js app used to access data from both Influx and relation database. Does not handle MQTT messages (this decoding should be done by different application or using solutions such as [TTN](https://www.thethingsnetwork.org/))
   - `influx-lambda` - Serverless AWS lambda for the use with InfluxDataBase
 - `frontend` - Angular frontend implementation
   - `src/app/components` - App dependent components
   - `src/app/library` - GUI library created during the thesis
   - `src/app/generated` - Artefacts generated from the `express` application but compatible with `influx-lambda`
 - `doc/thesis` - Thesis LaTeX files (in Czech)

Each important part of the monorepo has its own `README.md` describing the usage or results gained from this part  

## Running the application
The main application has docker support using `docker-compose` and `docker`. Run `docker-compose build` and `docker-compose up` and be patient. Some dependencies are quite large and it can take a while.
The following are containers are hosted
 - databases
   - InfluxDB - stores the time-series data from IoT devices (port: 8086)
   - PostgreSQL - handles device metadata, for example units, last value, thresholds, etc (port: 5432)
 - backend servers
   - serverless - the `influx-lambda` AWS lambda (for testing purposes only) (port: 4000)
   - express - main express application (port: 3000)
 - frontend
   - app using the serverless server (port: 4300)
   - app using the express backend (port: 4200)

## Quick links and data
The database contains data starting at `2022-04-20` and ending at `2022-05-07`
 - [Statistic view of boiler at 2022-05-05](http://localhost:4200/details/Boiler%20Devices?deviceUid=boiler&to=2022-05-05T09:28:42.201Z)
 - [Availability view of boiler at 2022-05-05](http://localhost:4200/availability/Boiler%20Devices?deviceUid=boiler&to=2022-05-05T09:28:42.201Z)
 - [Categorical view of boiler at 2022-05-05](http://localhost:4200/categorical/Boiler%20Devices?deviceUid=boiler&to=2022-05-05T09:28:42.201Z)
 - [Statistic view of two devices at 2022-05-05](http://localhost:4200/details/Arduinos?deviceUid=Arduino&to=2022-05-05T09:28:42.201Z&additionalDevices=NodeMCU)
 - [Availability view of two devices at 2022-05-05](http://localhost:4200/availability/Arduinos?deviceUid=Arduino&to=2022-05-05T09:28:42.201Z&additionalDevices=NodeMCU)
