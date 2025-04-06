# **Pocketix Node Core**
Monorepo for the core modules and services powering the Pocketix ecosystem — managing IoT automation, data storage, and smart device integration.

## **Overview**
The **Pocketix Node Core** monorepo encompasses various backend and frontend components, built to work together seamlessly. It includes backend services for data storage, database management, serverless functions, as well as an Angular frontend for visualizing and interacting with the system.

This structure is optimized for IoT sensor data handling, time-series storage, and device management. It is designed to scale and integrate with various cloud and on-premise systems.

## **Project Structure**
The monorepo is divided into the following major parts:

### **Backend**
Contains all backend resources and services:
- 🔧 **`db-benchmark`**: Benchmarking tool for selecting the optimal database for time-series data (e.g., InfluxDB).
- 💾 **`influx-database`**: Wrapper for the Influx.js client, acting as a bridge to environment-dependent controllers or AWS Lambda handlers.
- 🌐 **`express`**: Express.js application for accessing data from both InfluxDB and PostgreSQL. Does **not** handle MQTT messages (use solutions like [The Things Network](https://www.thethingsnetwork.org/)).
- ☁️ **`influx-lambda`**: Serverless AWS Lambda integration for working with InfluxDataBase (for testing and cloud-based use).
- 📡 **`go-subscribe`**: A tool converting MQTT messages into `express` API calls

### **Frontend**
Contains the Angular-based frontend for the Pocketix ecosystem:
- 🖥️ **`src/app/components`**: App-dependent UI components used in the frontend.
- 🎨 **`src/app/library`**: GUI library created during development (thesis project).
- 📦 **`src/app/generated`**: Generated artifacts from the `express` application, compatible with the `influx-lambda`.

### **Important Notes**
Each key part of this monorepo has its own README.md with further details on usage, setup, and results.

## **Running the Application**

The monorepo provides **Docker** support using `docker-compose` and `docker`. Follow these steps to get the application up and running:

1) **Build the Docker containers**:  
   `docker-compose build`

2) **Start the services**:  
   `docker-compose up`

Be patient — some dependencies are quite large, so it may take a few minutes to start everything.

### **Hosted Containers**
Once running, the following services are available:

#### **Databases**
- 📊 **InfluxDB**: Stores time-series data from IoT devices (port: 8086)
- 🗃️ **PostgreSQL**: Manages device metadata (units, last values, thresholds, etc.) (port: 5432)

#### **Backend Servers**
- ☁️ **Serverless (influx-lambda)**: AWS Lambda-based service for testing (port: 4000)
- 🌐 **Express**: Main Express.js application serving the backend (port: 3000)

#### **Frontend Applications**
- 🌍 **App using the serverless backend**: Accesses the serverless backend (port: 4300)
- 🖥️ **App using the Express backend**: Accesses the main Express server (port: 4200)

## **License**
This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for more information.
