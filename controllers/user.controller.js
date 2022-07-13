const express = require('express');
const router = express.Router();

const here = 'user';
const Model = require(`../models/${here}.model`);

require('../middlewares/core/defaultMiddlewares')(router, here, Model);
require('../middlewares/authentication/authentication')(router, here, Model);

/* specific controllers */

/* end specific controllers */

module.exports = router;
