const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const User = require('../dataBase/models/User.model');
const Token = require('../dataBase/models/Token.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/me', asyncHandler(requireToken), asyncHandler(getUser));
    router.patch('/me', asyncHandler(requireToken), asyncHandler(updateUser));
    router.post('/logout', asyncHandler(requireToken), asyncHandler(logout));
}

async function getUser(req, res, next) {
    const userInfo = await User.findByPk(req.userId);

    res.status(200).json(userInfo);
}

async function updateUser(req, res, next) {
    const userInfo = await User.findByPk(req.userId);
    const updated = await userInfo.update(req.body);
    
    res.status(200).json(updated);
}

async function logout(req, res, next) {
    await Token.destroy({
        where: {
            value: req.header('x-access-token')
        }
    });

    res.status(200).json({ message: "OK" });
}

initRoutes();

module.exports = router;