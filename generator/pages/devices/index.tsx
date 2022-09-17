import type { NextPage } from 'next'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Col, Container, FloatingLabel, Row} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import DeviceParameter from "../../components/DeviceParameter";



const Device: NextPage = () => {
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
                        <FloatingLabel label="Device Name" controlId="deviceName" className="mb-3">
                            <Form.Control type="text" placeholder=" "></Form.Control>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel label="Messages per minute" controlId="messagesPerMinute" className="mb-3">
                            <Form.Control type="number" placeholder=" "></Form.Control>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel label="Minutes delta in 3sigma" controlId="delta" className="mb-3">
                            <Form.Control type="number" placeholder=" "></Form.Control>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel label="Similar device count" controlId="delta" className="mb-3">
                            <Form.Control type="number" placeholder=" "></Form.Control>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <Button variant="primary">
                            Add parameter
                        </Button>
                        <Button variant="secondary">
                            Copy Device
                        </Button>
                    </Col>
                </Row>
                <DeviceParameter/>
            </Container>
        </>
    );
}

export default Device;
