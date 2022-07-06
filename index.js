require('dotenv').config();
const configInfo = require('./config/config.json');

const express = require('express');
const { connectDb, connectBack } = require('./utils/connect');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet({ referrerPolicy: { policy: 'no-referrer' } }));

/** call routes */
require('./routes')(app, configInfo);

/** connect server and DB */
console.log('Connect DB');
connectDb();
console.log('Connect App');
connectBack(app);
