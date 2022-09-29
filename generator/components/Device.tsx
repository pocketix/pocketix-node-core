import {NextPage} from "next";
import {Button, Card, Col, FloatingLabel, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import DeviceParameter from "./DeviceParameter";
import {DeviceParameterType as DeviceParameterTypeType, DeviceType, DeviceParameter as DeviceParameterType} from "../lib/types";
import {useState} from "react";

const Device: NextPage<{device: DeviceType, onCopy: Function, deviceChange?: Function}> = (props) => {
    const [device, setDevice] = useState(props.device);
    const [parameters, setParameters] = useState(props.device.parameters);
    const deviceChange: Function = props.deviceChange || ((a: any) => a);

    const assignValue = (field: string, value: any) => {
        setDevice({...device, [field]: value});
        deviceChange(device);
    };

    return (
        <div className="mr-3 padding-top-1-5-rem">
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <FloatingLabel label="Device Name" className="mb-3">
                                <Form.Control type="text" value={device.name}
                                              onChange={($event) => assignValue("name", $event.target.value)}></Form.Control>
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel label="Messages per minute" controlId="messagesPerMinute" className="mb-3">
                                <Form.Control type="number"  value={device.messagesPerMinute}
                                              onChange={($event) => assignValue("messagesPerMinute", $event.target.value)}></Form.Control>
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel label="Minutes delta in 3sigma" controlId="delta" className="mb-3">
                                <Form.Control type="number" placeholder=" " value={device.delta}
                                              onChange={($event) => assignValue("delta", $event.target.value)}></Form.Control>
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <FloatingLabel label="Similar device count" controlId="delta" className="mb-3">
                                <Form.Control type="number" placeholder=" " value={device.deviceCount}
                                              onChange={($event) => assignValue("deviceCount", $event.target.value)}></Form.Control>
                            </FloatingLabel>
                        </Col>
                        <Col>
                            <Button className="mb-3" variant="primary" onClick={() => {
                                setParameters([
                                    ...parameters, {
                                        name: "",
                                        type: "number" as DeviceParameterTypeType
                                    } as DeviceParameterType]);
                                assignValue("parameters", parameters);
                            }}>
                                Add parameter
                            </Button>
                            <Button className="mb-3" variant="primary">
                                Save
                            </Button>
                            <Button className="mb-3" variant="outline-primary">
                                Copy Device
                            </Button>
                        </Col>
                    </Row>
                    {
                        parameters.map(
                            (parameter: DeviceParameterType) => <DeviceParameter key={parameter.name} deviceParameter={parameter} parameterChange={(parameter: DeviceParameterType) => {
                                setParameters([
                                    ...parameters.filter(item => item !== parameter), {
                                        name: "",
                                        type: "number" as DeviceParameterTypeType
                                    } as DeviceParameterType]);
                                assignValue("parameters", parameters);
                            }}/>
                        )
                    }
                </Card.Body>
            </Card>
        </div>
    );
}

export {Device};
