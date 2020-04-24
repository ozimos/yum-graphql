import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserGetPayload, PromiseReturnType } from '@prisma/client';

const prisma = new PrismaClient();

export function tokenGenerator({ isCaterer, id: userId, firstName }) {
    return jwt.sign({ isCaterer, userId, firstName }, process.env.TOKEN_PASSWORD, {
        expiresIn: process.env.TOKEN_EXPIRY || '6h',
    });
}

function sendResponseWithToken(res, data, { statusCode = 200, message }) {
    const token = tokenGenerator(data);
    if (token) {
        return res.status(statusCode).json({ data, message, token });
    }
}

export async function login(req, res, next) {
    try {
        const result = await prisma.user.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (!result) {
            return res.status(404).json({
                message: {
                    login: 'Incorrect email or password',
                },
            });
        }
        const { createdAt, updatedAt, password, ...user } = result;
        const isCorrectPassword = bcrypt.compareSync(req.body.password, password);

        if (isCorrectPassword) {
            const options = { message: 'Login Successful' };
            return sendResponseWithToken(res, user, options);
        }
        return res.status(400).json({
            message: {
                login: 'Incorrect email or password',
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function signUp(req, res, next) {
    const { email, password, ...rest } = req.body;
    try {
        const existingUser = await prisma.user.findOne({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).json({
                email: 'Email is not available',
            });
        }
        const { createdAt, updatedAt, password: dbPassword, ...newUser } = await prisma.user.create(
            {
                data: {
                    email,
                    password: bcrypt.hash(password, 10),
                    ...rest,
                },
            },
        );

        const options = {
            message: 'Signup Successful',
            statusCode: 201,
        };
        return sendResponseWithToken(res, newUser, options);
    } catch (error) {
        next(error);
    }
}
