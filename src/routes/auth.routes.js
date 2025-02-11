const { Router } = require('express');
const router = Router();

const { login, renewToken } = require('../controllers/auth.controller');

const {authMiddleware, authorize} = require('../authMiddleware');

/**
 * @swagger
 * /auth/login:
 *  post: 
 *    summary: Inicio de sesión
 *    description: Inicio de sesión
 *    tags:
 *      - login
 *    requestBody:
 *      description: Inicio de sesión
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: nombre de usuario que iniciará sesión
 *              password:
 *                type: string
 *                description: contraseña correspondiente al usuario
 *    responses:
 *      200:
 *        description: Operación exitosa
 *      400:
 *        description: Credenciales invalidadas
 *      404:
 *        description: Usuario no encontrado
 *      500:
 *         description: Error
 */
router.post('/auth/login', login);

/**
 * @swagger
 * /auth/renew:
 *  get:
 *    summary: Renovar token
 *    description: Renueva el token del usuario autenticado
 *    tags:
 *      - auth
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Operación exitosa
 *      401:
 *        description: Acceso no autorizado
 *      500:
 *        description: Error en el servidor
 */
router.get('/auth/renew', authMiddleware, renewToken);

module.exports = router;