const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const { asyncHandler, syncHandler } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.all('/', syncHandler(test));
}

function test(req, res, next) {
    res.status(200).json({ message: 'This is test )' });
}

initRoutes();

module.exports = router;