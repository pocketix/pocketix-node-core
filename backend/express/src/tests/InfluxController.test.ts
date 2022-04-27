// Init DI
import 'reflect-metadata';
// Mock InfluxService, which is directly tied to database and is just a simple wrapper and insert it to DI container
// This relies on src/services/__mocks__ and uses the service/__mocks__/InfluxService.ts instead of service/InfluxService.ts
import {Container} from 'typedi';
jest.mock('../services/InfluxService');
jest.mock('../services/DeviceService');
jest.mock("../utility/createDatasource");
import {InfluxService} from '../services/InfluxService';
import {DeviceService} from "../services/__mocks__/DeviceService";
// Create the mocked service and set it to container
const influxService = new InfluxService();
const deviceService = new DeviceService();
Container.set(InfluxService, influxService);
Container.set(DeviceService, deviceService);

// supertest dependencies
import app from '../app';
import request from 'supertest';
import {ReadRequestBody} from "../types/ReadRequestBody";


describe('Tests of the statistics path of the InfluxController', () => {
    it('Fail on missing parameters', async () => {
       const result = await request(app).post('/statistics');
       expect(result.statusCode).toEqual(422);
    });

    it('Pass, no time segment required', async () => {
        const result = await request(app)
            .post('/statistics')
            .send({
                sensors: ['sensor'],
                bucket: "test"
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(200);
    });

    it('Pass, all simple sensor data present', async () => {
       const result = await request(app)
           .post('/statistics?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
           .send({
               sensors: ['sensor'],
               bucket: "test"
           } as ReadRequestBody);
       expect(result.statusCode).toEqual(200);
    });

    it('Pass, all data present', async () => {
        const result = await request(app)
            .post('/statistics?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                sensors: {sensor: ['field']},
                bucket: "test"
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(200);
    });

    it('Fail, no sensor', async () => {
        const result = await request(app)
            .post('/statistics?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                bucket: "test"
            });
        expect(result.statusCode).toEqual(422);
    });

    it('Fail, no bucket', async () => {
        const result = await request(app)
            .post('/statistics?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({sensors: {sensor: 'field'}});
        expect(result.statusCode).toEqual(422);
    });

    it('Fail, to before from', async () => {
        const result = await request(app)
            .post('/statistics?from=2024-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                sensors: ['sensor'],
                bucket: 'test'
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(422);
    });
});

describe('Tests of the aggregate path of the InfluxController', () => {
    it('Fail on missing parameters', async () => {
        const result = await request(app).post('/statistics/aggregate');
        expect(result.statusCode).toEqual(404);
    });

    it('Pass, no time segment required', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/sum')
            .send({
                sensors: ['sensor'],
                bucket: "test"
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(200);
    });

    it('Pass, all simple sensor data present', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/sum?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                sensors: ['sensor'],
                bucket: "test"
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(200);
    });

    it('Pass, all data present', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/sum?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                sensors: {sensor: ['field']},
                bucket: "test"
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(200);
    });

    it('Pass, all data present with aggregateMinutes', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/sum?aggregateMinutes=10&from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                sensors: {sensor: ['field']},
                bucket: "test"
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(200);
    });

    it('Fail, no sensor', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/sum?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                bucket: "test"
            });
        expect(result.statusCode).toEqual(422);
    });

    it('Fail, no bucket', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/sum?from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({sensors: {sensor: 'field'}});
        expect(result.statusCode).toEqual(422);
    });

    it('Fail, to before from', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/sum?from=2024-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send({
                sensors: ['sensor'],
                bucket: 'test'
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(422);
    });

    it('Fail, operation does not exist', async () => {
        const result = await request(app)
            .post('/statistics/aggregate/operationThatShouldNotExistWithLongEnoughNameThatSomeoneDoesntAddItLater')
            .send({
                sensors: ['sensor'],
                bucket: 'test'
            } as ReadRequestBody);
        expect(result.statusCode).toEqual(422);
    });
});

