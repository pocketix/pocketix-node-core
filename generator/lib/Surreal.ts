import Surreal from 'surrealdb.js';
import {DeviceType} from "./types";

const connect = async () => {
    const db = new Surreal('http://127.0.0.1:8000/rpc');
    await db.signin({user: 'root', pass: 'root'});
    await db.use('devices', 'devices');

    return db;
}

const save = async (db: Promise<Surreal>, item: DeviceType) => {
    const database = await db;
    const data = {...item, id: item.id ?? Math.random().toString(36).substring(2, 10)};
    return await item.id ? database.update(data.id.toString(), data) : database.create("device", data);
};

const selectAll = async (db: Surreal) => {
    return await db.select("device");
};

export {connect, save, selectAll};
