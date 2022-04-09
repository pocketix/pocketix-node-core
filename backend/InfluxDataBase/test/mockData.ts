class MockPoint {
    public storage: any = [];

    private save(values: any): MockPoint {
        this.storage.push(values);
        this.storage.sort();
        return this;
    }

    public tag(...args: any[]): MockPoint {
        return this.save([...args]);
    }
    public timestamp(time: Date): MockPoint {
        return this.save(['tst', time]);
    }
    public floatField(...args: any[]): MockPoint {
        return this.save(['float', ...args]);
    }
    public booleanField(...args: any[]): MockPoint {
        return this.save(['boolean', ...args]);
    }
    public stringField(...args: any[]): MockPoint {
        return this.save(['string', ...args]);
    }
}

const promise = async () => {};

const writeApi = {
    default: jest.fn(),
    writePoints: jest.fn(),
    flush: promise
};

const queries: any[][] = [];

const queryApi = {
    default: jest.fn(),
    collectRows: jest.fn(async (...args) => queries.push(args))
};

export {writeApi, promise, MockPoint, queryApi, queries};
