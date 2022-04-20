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

The main application has docker support using `docker-compose` and `docker`. Run `docker-compose build` and `docker-compose up` and be patient. Some dependencies are quite large and it can take a while 
