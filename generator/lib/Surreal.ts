import Surreal from 'surrealdb.ts';

const connect = async () => {
    const db = new Surreal('http://127.0.0.1:8000/rpc')
    await db.signin({user: 'root', pass: 'root'});
    await db.use('devices', 'devices');

    return db;
}

export {connect};
