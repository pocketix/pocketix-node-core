# Database Test
This project was made to test these following databases and their versions

 - MongoDB (5.0.3)
 - InfluxDB (2.0.6)
 - DynamoDB (2021-04-27)

All databases were locally hosted in docker on 7300 HQ laptop with 16 GB DDR4 one by one to limit the number of other processes currently running on the native system. Space on the disc was checked manually.

## Usage
Run the `docker-compose build` and `docker-compose up` to run the tests. The dataset used can be changed by changing the environment variable `file` in `docker-compose.yml`.

## Used ports
 - 8888 - MongoDB
 - 8086 - InfluxDB
 - 8000 - DynamoDB
 - 5432 - PostgreSQL

## What is tested
 - Both DynamoDB and MongoDB are tested for storing the document with as little changes as possible
 - InfluxDB and MongoDB are tested for their series support
 - Main comparison metrics are time required to run queries / aggregations and space on disk
