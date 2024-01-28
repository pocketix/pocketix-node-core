FROM golang:1.16-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy the local code to the container
COPY . .

RUN go mod download
# Build the Go application
RUN go build -o mqtt-client .

FROM alpine as prod

WORKDIR /app
COPY --from=build /app/mqtt-client /app/mqtt-client

# Command to run the executable
CMD ["./mqtt-client"]
