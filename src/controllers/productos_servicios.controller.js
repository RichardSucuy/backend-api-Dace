const pool = require('../database/db');

// Endpoint para devolver todos los productos y servicios
const getProductosServicios = async(req, res) => {
    pool.query('SELECT id_producto_servicio, categoria_prod_serv, descripcion_prod_serv FROM productos_servicios', (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al buscar' });
        } else {
            res.json(result.rows);
        }
    });
};

// Endpoint para devolver los productos y servicios por un ID determinado
const getProductosServiciosByID = async(req, res) => {
    const { id } = req.params;

    const query = 'SELECT id_producto_servicio, categoria_prod_serv, descripcion_prod_serv FROM productos_servicios WHERE id_producto_servicio=$1';
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al buscar' });
        }
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registro no encontrado' });
        } else {
            res.json(result.rows);
        }
    });
};

// Endpoint para devolver los productos y servicios por categoría
const getProductosServiciosByCategoria = async(req, res) => {
    const busqueda = req.params.name;

    const query = `SELECT id_producto_servicio, categoria_prod_serv, descripcion_prod_serv 
                   FROM productos_servicios 
                   WHERE (categoria_prod_serv ILIKE '%${busqueda}%')`;

    pool.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al buscar' });
        }
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registro no encontrado' });
        } else {
            res.json(result.rows);
        }
    });
};

// Endpoint para crear un producto o servicio
const createProductosServicios = async(req, res) => {
    const { categoria_prod_serv, descripcion_prod_serv } = req.body;

    const query = 'INSERT INTO productos_servicios (categoria_prod_serv, descripcion_prod_serv) VALUES ($1, $2)';
    const values = [categoria_prod_serv, descripcion_prod_serv];

    pool.query(query, values, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al insertar' });
        } else {
            res.json({
                message: 'Producto o servicio agregado correctamente'
            });
        }
    });
};

// Endpoint para modificar un producto o servicio
const updateProductosServicios = async(req, res) => {
    const { id_producto_servicio, categoria_prod_serv, descripcion_prod_serv } = req.body;

    const query = 'UPDATE productos_servicios SET categoria_prod_serv = $2, descripcion_prod_serv = $3 WHERE id_producto_servicio = $1';
    const values = [id_producto_servicio, categoria_prod_serv, descripcion_prod_serv];

    pool.query(query, values, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al actualizar' });
        } else {
            res.json({
                message: 'Producto o servicio modificado correctamente'
            });
        }
    });
};

// Endpoint para eliminar un producto o servicio
const deleteProductosServicios = async(req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM productos_servicios WHERE id_producto_servicio = $1';
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar el producto o servicio' });
        } else if (result.rowCount === 0) {
            res.status(404).json({ error: 'Producto o servicio no encontrado' });
        } else {
            res.json({ message: 'Producto o servicio eliminado correctamente' });
        }
    });
};

const getCountProductosServicios = async (req, res) => {
    const query = 'SELECT COUNT(*) FROM productos_servicios';
    
    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows[0].count);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el conteo de productos o servicios' });
    }
};

module.exports = {
    getProductosServicios,
    getProductosServiciosByID,
    getProductosServiciosByCategoria,
    createProductosServicios,
    updateProductosServicios,
    deleteProductosServicios,
    getCountProductosServicios
};
