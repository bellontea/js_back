const { Router } = require('express');
const ErrorResponse = require('../classes/error-response');
const Token = require('../dataBase/models/Token.model');
const User = require('../dataBase/models/User.model');
const { nanoid } = require('nanoid');
const { asyncHandler } = require('../middlewares/middlewares');

const router = Router();

function initRoutes() {
    router.post('/registration', asyncHandler(registration));
    router.post('/login', asyncHandler(login));
}

async function registration(req, res, next) {
    const checkLogin = await User.findOne({
        where: {
            login: req.body.login,
        }
    });
    const checkEmail = await User.findOne({
        where: {
            email: req.body.email,
        }
    });

    if (checkLogin) {
        throw new ErrorResponse('This login already in use', 400);
    }
    if (checkEmail) {
        throw new ErrorResponse('This email already in use', 400);
    }

    await User.create(req.body);

    res.status(200).json({ message: 'OK' });
}

async function login(req, res, next) {
    const user = await User.findOne({
        where: {
            login: req.body.login,
            password: req.body.password,
        }
    });

    if (!user) {
        throw new ErrorResponse('Wrong login or password', 400);
    }

    const token = await Token.create({
        userId: user.id,
        value: nanoid(128)
    });

    res.status(200).json({ accessToken: token.value });
}

initRoutes();

module.exports = router;