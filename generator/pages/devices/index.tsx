import type { NextPage } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Container, Row} from "react-bootstrap";
import {Device} from "../../components/Device";
import {DeviceType} from "../../lib/types";
import {useState} from "react";
import {connect, save, selectAll} from "../../lib/Surreal";

const DEVICES = [
    {
        name: "Device 1",
        messagesPerMinute: 1,
        delta: 0.2,
        deviceCount: 50,
        parameters: [
            {
                name: "Parameter 1",
                type: "number",
            },
            {
                name: "Parameter 2",
                type: "number",
            },
            {
                name: "Parameter 3",
                type: "number",
            }
        ]
    },
    {
        name: "Device 2",
        messagesPerMinute: 1,
        delta: 0.2,
        deviceCount: 50,
        parameters: [
            {
                name: "Parameter 4",
                type: "number",
            },
            {
                name: "Parameter 5",
                type: "number",
            },
            {
                name: "Parameter 6",
                type: "number",
            },
            {
                name: "Parameter 7",
                type: "string",
            },
            {
                name: "Parameter 8",
                type: "enum",
                value: "a;b;c"
            }
        ]
    }
] as DeviceType[];

const DevicePage: NextPage<{devices: DeviceType[]}> = (props) => {
    const db = connect();
    const [devices, setDevices] = useState(props.devices);

    return (
        <>
            <header>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
                    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
                    crossOrigin="anonymous"
                />
            </header>
            <Container fluid>
                <Row>
                    <Col>
                        <h1>Devices to send against the API</h1>
                    </Col>
                    <Col className="col-buttons-device">
                        <Button variant="primary" onClick={() => devices.forEach(device => save(db, device))}>
                            Save
                        </Button>
                        <Button variant="outline-primary" onClick={() => {}}>
                            New Device
                        </Button>
                    </Col>
                </Row>
                {
                    devices?.map((device, index) =>
                        <Row key={device.name}>
                            <Device key={device.name} device={device}
                                    onCopy={(device: DeviceType) => setDevices([
                                        ...devices, {...device, id: undefined, name: device.name + "copy"}
                                    ])}
                                    deviceChange={(newDevice: DeviceType) => {
                                        devices[index] = newDevice;
                                        console.log(newDevice);
                                        setDevices(devices);
                                    }}
                            />
                        </Row>
                    )
                }
            </Container>
        </>
    );
}


export async function getServerSideProps() {
    const db = await connect();
    const devices = await selectAll(db) || DEVICES;
    console.log(devices, devices.length, devices.length ? devices : DEVICES);
    db.close();
    return {
        props: {devices: devices.length ? devices : DEVICES}, // will be passed to the page component as props
    }
}

export default DevicePage;

