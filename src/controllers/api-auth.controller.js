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

async function registartion(req, res, next) {
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
        throw new ErrorResponse('User with this login already exists', 404);
    }
    if (checkEmail) {
        throw new ErrorResponse('User with this email already exists', 404);
    }

    await User.create(req.body);

    res.status(200).json({ message: 'OK' });
}

async function login(req, res, next) {
    const userByLogin = await User.findOne({
        where: {
            login: req.body.login,
            password: req.body.password,
        }
    });

    if (!userByLogin) {
        throw new ErrorResponse('Wrong login or password', 404);
    }

    if (await Token.findOne({ where:{id: userByLogin.id} })){
        throw new ErrorResponse("Token error", 404);
    }

    const token = await Token.create({
        userId: existingUser.id,
        value: nanoid(128)
    });

    res.status(200).json({ accessToken: token.value });
}

initRoutes();

module.exports = router;