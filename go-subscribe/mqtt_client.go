package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"time"

	"github.com/eclipse/paho.mqtt.golang"
)

func getEnvVar(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}

const defaultEndpointURL = "http://localhost:3000/statistics/data"
const defaultBroker = "ws://mqtt.test.hole:80"
const defaultTopicFilter = "IotLogimic/dev5/+/+/+/john/ntf"
const defaultUsername = "bot"
const defaultPassword = "8Zdp-2iX4oV9.oLM#4KHw[5rA7]OU7[CEw=Pwr)G"

type DevData struct {
	DevType string      `json:"devType"`
	DevUid  string      `json:"devUid"`
	DevPars interface{} `json:"-"`
}

func (d *DevData) MarshalJSON() ([]byte, error) {
	type Alias DevData
	return json.Marshal(&struct {
		*Alias
		DevPars map[string]interface{} `json:",inline"`
	}{
		Alias:   (*Alias)(d),
		DevPars: d.DevPars.(map[string]interface{}),
	})
}

func onMessageReceived(client mqtt.Client, message mqtt.Message) {
	topic := message.Topic()
	payload := message.Payload()

	topicParts := strings.Split(topic, "/")
	deviceID := topicParts[5]

	fmt.Printf("Received message from device %s: %s\n", deviceID, payload)

	var payloadAsJson map[string]interface{}
	err := json.Unmarshal(payload, &payloadAsJson)
	if err != nil {
		log.Printf("Error unmarshaling JSON payload: %s\n", err)
		return
	}

	if data, ok := payloadAsJson["data"].(map[string]interface{}); ok {
		if devs, ok := data["devs"].([]interface{}); ok {
			sendArrayToDevice(getEnvVar("ENDPOINT_URL", defaultEndpointURL), deviceID, devs)
		} else {
			log.Println("Error: 'devs' key is not an array in the payload")
		}
	} else {
		log.Println("Error: 'data' key is not present or not an object in the payload")
	}
}

func sendArrayToDevice(endpointURL, deviceID string, arrayData []interface{}) {
	for _, item := range arrayData {
		if devMap, ok := item.(map[string]interface{}); ok {
			dev := DevData{
				DevType: devMap["devType"].(string),
				DevUid:  devMap["devUid"].(string),
				DevPars: devMap["devPars"],
			}

			sendDataToDevice(endpointURL, deviceID, dev)
		}
	}
}

func sendDataToDevice(endpointURL, deviceID string, data DevData) {
	client := &http.Client{}

	// Flatten the structure by including DevPars directly
	flattenedData := map[string]interface{}{
		"deviceUid": data.DevUid,
		"devType":   data.DevType,
	}

	// Add dynamic key-value pairs from DevPars
	if devPars, ok := data.DevPars.(map[string]interface{}); ok {
		for key, value := range devPars {
			flattenedData[key] = value
		}
	}

	// Wrap the structure in the specified JSON format
	wrappedData := map[string]interface{}{
		"bucket": "bucket",
		"data":   flattenedData,
	}

	// Send the wrapped data to the specified endpoint
	jsonData, err := json.Marshal(wrappedData)
	if err != nil {
		log.Printf("Error marshaling JSON: %s\n", err)
		return
	}

	log.Printf("%s", jsonData)

	req, err := http.NewRequest("POST", endpointURL, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Error creating HTTP request: %s\n", err)
		return
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Error sending data to endpoint: %s\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		log.Printf("Unexpected response status: %s \n", resp.Status)
		errorBody, _ := io.ReadAll(resp.Body)
		log.Printf("Error response body: %s\n", string(errorBody))
		return
	}

	fmt.Println("Data sent to the endpoint successfully")
}

func main() {
	broker := getEnvVar("MQTT_BROKER", defaultBroker)
	topicFilter := getEnvVar("MQTT_TOPIC_FILTER", defaultTopicFilter)
	username := getEnvVar("MQTT_USERNAME", defaultUsername)
	password := getEnvVar("MQTT_PASSWORD", defaultPassword)

	opts := mqtt.NewClientOptions()
	opts.AddBroker(broker)
	opts.SetClientID("mqtt-client-" + fmt.Sprint(time.Now().Unix()))
	opts.SetAutoReconnect(true)
	opts.SetUsername(username)
	opts.SetPassword(password)

	log.Printf("Username password: %s %s\n", username, password)

	mqttClient := mqtt.NewClient(opts)
	if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}

	if token := mqttClient.Subscribe(topicFilter, 0, onMessageReceived); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		<-c
		fmt.Println("\nDisconnecting from broker...")
		mqttClient.Disconnect(250)
		wg.Done()
	}()

	wg.Wait()
}
