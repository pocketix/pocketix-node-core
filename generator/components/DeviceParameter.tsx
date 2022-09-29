import type { NextPage } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Container, FloatingLabel, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import {DeviceParameter as DeviceParameterType, DeviceParameterType as ParameterTypeType} from "../lib/types";
import {useState} from "react";



const DeviceParameter: NextPage<{deviceParameter: DeviceParameterType, parameterChange: Function}> = (props) => {
    const [parameter, updateParameter] = useState(props.deviceParameter);
    const parameterChange: Function = props.parameterChange;

    const assignValue = (field: string, value: any) => {
        updateParameter({...parameter, [field]: value});
        parameterChange(parameter);
    };

    return (
        <Row className="align-items-center">
            <Col>
                <FloatingLabel label="Parameter Name" controlId="parameterName" className="mb-3">
                    <Form.Control type="text" placeholder=" " value={parameter.name}
                                  onChange={($event) => assignValue("name", $event.target.value)}></Form.Control>
                </FloatingLabel>
            </Col>
            <Col>
                <FloatingLabel label="Parameter Value Type" controlId="Value Type" className="mb-3">
                    <Form.Select aria-label="Select Value Type" value={parameter.type}
                                 onChange={($event) => assignValue("type", $event.target.value as ParameterTypeType)}>
                        <option>number</option>
                        <option>string</option>
                        <option>enum</option>
                    </Form.Select>
                </FloatingLabel>
            </Col>
            <Col>
                <FloatingLabel label="Values" controlId="parameterValue" className="mb-3">
                    <Form.Control type="text" placeholder=" " value={parameter.value}
                                  onChange={($event) => assignValue("value", parameter.type === "number" ? parseFloat($event.target.value) : $event.target.value)}></Form.Control>
                </FloatingLabel>
            </Col>
        </Row>
    );
}

export default DeviceParameter;
