const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const User = require('../dataBase/models/User.model');
const { asyncHandler, requireToken } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.get('/me', asyncHandler(requireToken), asyncHandler(getUser));
    router.patch('/me', asyncHandler(requireToken), asyncHandler(updateUser));
    router.post('/logout', asyncHandler(requireToken), asyncHandler(logout));
}

async function getUser(req, res, next) {
    const userInfo = await User.findByPk(req.userId);

    if (!userInfo) {
        throw new ErrorResponse('User not found', 404);
    }

    res.status(200).json(userInfo);
}

async function updateUser(req, res, next) {
    const userInfo = await User.findByPk(req.userId);

    if (!userInfo) {
        throw new ErrorResponse('User not found', 404);
    }
    
    if (!req.body) {
        throw new ErrorResponse('Enter data to update', 404);
    }
    
    await User.update(req.body, {
        where: {
            id: req.userId,
        }
    });
    res.status(200).json({ message: "OK" });
}

async function logout(req, res, next) {
    const deleteToken = await Token.destroy({
        where: {
            value: req.header('x-access-token')
        }
    });

    res.status(200).json({ message: "OK" });
}

initRoutes();

module.exports = router;