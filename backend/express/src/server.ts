import 'reflect-metadata';
import 'dotenv/config';

import app from './app';
const port = parseInt(process.env.PORT, 10);

app.listen(port, () => {
    console.log(`App Started on ${port}`);
});
