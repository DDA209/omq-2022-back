const express = require('express');
const router = express.Router();

const here = 'ingredient';
const Model = require(`../models/${here}.model`);

require('../middlewares/core/defaultMiddlewares')(router, here, Model);

/* specific controllers */

/* end specific controllers */

module.exports = router;
