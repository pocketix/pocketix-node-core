FROM golang:1.16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the local code to the container
COPY . .

RUN go mod download
# Build the Go application
RUN go build -o mqtt-client .

# Command to run the executable
CMD ["./mqtt-client"]
