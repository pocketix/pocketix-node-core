// Init DI
import 'reflect-metadata';
// Mock InfluxService, which is directly tied to database and is just a simple wrapper and insert it to DI container
// This relies on src/services/__mocks__ and uses the service/__mocks__/InfluxService.ts instead of service/InfluxService.ts
import {Container} from 'typedi';
jest.mock('../services/InfluxService');
import {InfluxService} from '../services/InfluxService';
// Create the mocked service and set it to container
const service = new InfluxService();
Container.set(InfluxService, service);

// supertest dependencies
import app from '../app';
import request from 'supertest';


describe('Tests of the InfluxController', () => {
    it('Fail on missing parameters', async () => {
       const result = await request(app).post('/statistics');
       expect(result.statusCode).toEqual(422);
    });

    it('Pass, all data present', async () => {
       const result = await request(app)
           .post('/statistics?bucket=bucket&from=2022-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
           .send(['sensor']);
       expect(result.statusCode).toEqual(200);
    });

    it('Fail, to before from', async () => {
        const result = await request(app)
            .post('/statistics?bucket=bucket&from=2024-02-12T12%3A40%3A20.000Z&to=2022-02-22T12%3A40%3A20.000Z')
            .send(['sensor']);
        expect(result.statusCode).toEqual(422);
    });
});

