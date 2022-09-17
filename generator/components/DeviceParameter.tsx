import type { NextPage } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Container, FloatingLabel, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';



const DeviceParameter: NextPage = () => {
    return (
        <Row className="align-items-center">
            <Col>
                <FloatingLabel label="Parameter Name" controlId="parameterName" className="mb-3">
                    <Form.Control type="text" placeholder=" "></Form.Control>
                </FloatingLabel>
            </Col>
            <Col>
                <FloatingLabel label="Parameter Value Type" controlId="Value Type" className="mb-3">
                    <Form.Select aria-label="Select Value Type">
                        <option>number</option>
                        <option>string</option>
                        <option>enum</option>
                    </Form.Select>
                </FloatingLabel>
            </Col>
        </Row>
    );
}

export default DeviceParameter;
