const { Router } = require('express');
const router = Router();

const {authMiddleware, authorize} = require('../authMiddleware');

const {getProductosServicios,getProductosServiciosByID,createProductosServicios,updateProductosServicios,deleteProductosServicios} = require('../controllers/productos_servicios.controller');

/**
 * @swagger
 * components:
 *  schemas:
 *    :
 *      type: object
 *      properties:
 *        id_productoservicio:
 *          type: integer
 *          description: id del productoservicio
 *        categoria_moti:
 *          type: string
 *          description: categoria del productoservicio
 *        descripcion_moti:
 *          type: string
 *          description: descripcion del productoservicio
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

//rutas de endpoint para productosservicios
/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      summary: Encontrar todas las 
 *      description: Devuelve todas las 
 *      tags: 
 *        - 
 *      security:
 *        - BearerAuth: []
 *      responses:
 *        200:
 *          description: Operación exitosa
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/'
 *        500:
 *          description: Error
 */
router.get('/productos_servicios', [authMiddleware, authorize(['administrador', 'acceso limitado'])], getProductosServicios);

/**
 * @swagger
 *  //{id}:
 *    get: 
 *      summary: Encontrar productoservicio por Id
 *      description: Devuelve un solo productoservicio
 *      tags:
 *        - 
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            format: int64
 *          required: true
 *          description: id de productoservicio a devolver
 *      responses:
 *        200:
 *          description: Operación exitosa
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/'
 *        404:
 *          description: Registro no encontrado
 *        500:
 *          description: Error
 *          
 */
router.get('/productos_servicios/:id', [authMiddleware, authorize(['administrador', 'acceso limitado'])], getProductosServiciosByID);

/**
 * @swagger
 *  /:
 *    post: 
 *      summary: Agregar un nuevo productoservicio
 *      description: Añade un nuevo productoservicio
 *      tags:
 *        - 
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        description: Crear un nuevo productoservicio
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  categoria_moti:
 *                      type: string
 *                      description: categoria del productoservicio
 *                  descripcion_moti:
 *                      type: string
 *                      description: descripcion del productoservicio
 *      responses:
 *        200:
 *          description: Operación exitosa
 *        405:
 *          description: Entrada no válida
 *        500:
 *          description: Error
 *          
 */
router.post('/productos_servicios', [authMiddleware, authorize(['administrador', 'acceso limitado'])], createProductosServicios);

/**
 * @swagger
 *  /:
 *    put: 
 *      summary: Actualizar un productoservicio existente
 *      description: Actualizar un productoservicio existente por ID
 *      tags:
 *        - 
 *      security:
 *        - BearerAuth: []
 *      requestBody:
 *        description: Actualizar un productoservicio existente
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/'
 *      responses:
 *        200:
 *          description: Operación exitosa
 *        400:
 *          description: ID proporcionado no válido
 *        404:
 *          description: productoservicio no encontrada
 *        405:
 *          description: Excepción de validación
 *        500:
 *          description: Error
 *          
 */
router.put('/productos_servicios', [authMiddleware, authorize(['administrador'])], updateProductosServicios);

/**
 * @swagger
 *  /:
 *    delete: 
 *      summary: Eliminar un productoservicio existente
 *      description: Eliminar un productoservicio existente por ID
 *      tags:
 *        - 
 *      security:
 *        - BearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: integer
 *            format: int64
 *          required: true
 *          description: id de productoservicio a eliminar
 *      responses:
 *        200:
 *          description: Operación exitosa
 *        400:
 *          description: ID proporcionado no válido
 *        404:
 *          description: productoservicio no encontrada
 *        405:
 *          description: Excepción de validación
 *        500:
 *          description: Error
 *          
 */
router.delete('/productos_servicios/:id', [authMiddleware, authorize(['administrador'])], deleteProductosServicios);

module.exports = router;