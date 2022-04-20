# AWS Lambda Influx Service
AWS Lambda dependent equivalent of the `InfluxController`  
The functions can be either deployed to AWS using `serverless deploy` or run manually using `serverless invoke local --function <operation> --path .\data\<operation>.json` where `operation` is the `InfluxController` operation you wish to run.  
If you want to use this Lambda on AWS make sure to edit the `serverless.yml` file with correct (IAM) settings.
