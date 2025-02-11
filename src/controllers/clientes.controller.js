const pool = require('../database/db');
const { queryCiudadByID } = require('./ciudades.controller');

const mapRow = async(row) => {
    const ciudad = await queryCiudadByID(row.id_ciudad);
    row.ciudad = ciudad;
    return row;
}

const getClientes = async(req, res) => {
    pool.query('SELECT * FROM clientes', async (err, result) => {
        if(err){
            console.error(err.stack);
        } else {

            const clientes = await Promise.all(
                result.rows.map((row) => mapRow(row))
            );

            // console.log( clientes );

            res.status(200).json(clientes);
        }
    });
};

const queryClienteByID = async(id) => {
    const query = `select * from clientes where id_cliente = $1`;
    const values = [id];

    try {
        const result = await pool.query(query, values)
        return result.rows[0];
    } catch (error) {
        console.log( error );
        throw new Error('Error al buscar cliente por ID');
    }
}


const getClientesByID = async(req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM clientes WHERE id_cliente = $1';
    const values = [ id ];

    pool.query(query, values, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Error al buscar'});
        } if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registro no encontrado' });   
        } else {
            res.json(result.rows[0])
        }
    });
};

const getClientesByCedula  = async(req, res) => {
    const { cedula } = req.params;
    
    const query = 'SELECT * FROM clientes WHERE cedula_cli = $1';
    const values = [ cedula ];

    pool.query(query, values, (err, result) => {
        if (err) {
            res.status(500).json({error: 'Error al buscar'});
        } if (result.rows.length === 0) {
            res.status(404).json({ error: 'Registro no encontrado' });   
        } else {
            res.json(result.rows)
        }
    });
};

const createClientes = async(req, res) => {
    
    const {...campos} = req.body;
    
    const query = `INSERT INTO clientes (cedula_cli, nombre_cli, apellido_cli, 
                    telefono_cli, socio_cli, nacimiento_cli, id_ciudad, nick_redes) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_cliente`;
    const values = [
        campos.cedula_cli, 
        campos.nombre_cli,
        campos.apellido_cli,
        campos.telefono_cli,
        campos.socio_cli,
        campos.nacimiento_cli,
        campos.id_ciudad,
        campos.nick_redes
    ];

    pool.query(query, values, (err, result) => {

        if(err) {
            res.status(500).json({ error: 'Error al insertar' });
        } else {
            campos.id_cliente = result.rows[0].id_cliente; // Obtengo el ID del registro creado
            res.json({
                message: 'Cliente registrado correctamente',
                cliente: campos
            })
        }
    });  
};

const updateClientes = async(req, res) => {
    const { ...campos } = req.body;

    const query = `UPDATE clientes SET cedula_cli = $1, nombre_cli = $2, apellido_cli = $3, 
        telefono_cli = $4, socio_cli = $5, nacimiento_cli = $6, id_ciudad = $7, nick_redes = $8 WHERE id_cliente = $9`;
    const values = [
        campos.cedula_cli, 
        campos.nombre_cli,
        campos.apellido_cli,
        campos.telefono_cli,
        campos.socio_cli,
        campos.nacimiento_cli,
        campos.id_ciudad,
        campos.nick_redes,
        campos.id_cliente
    ];

    pool.query(query, values, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar' });
        } else {
            res.status(200).json({
                message: 'Cliente actualizado correctamente'
            });
        }
    });
};

const deleteClientes = async(req, res) => {
    const { id } = req.params;

    console.log(req.params);

    const query = 'DELETE FROM clientes WHERE id_cliente = $1';
    const values = [ id ];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.log( err );
            res.status(500).json({ error: 'Error al eliminar el cliente' });
        } else if (result.rowCount === 0) {
            res.status(404).json({ error: 'Cliente no encontrado' });
        } else {
            res.status(200).json({ message: 'Cliente eliminado correctamente' });
        }
    });
};

const getCountClientes = async (req, res) => {
    const query = 'SELECT COUNT(*) FROM clientes';
    
    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows[0].count);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el conteo de clientes' });
    }
};

module.exports = {
    getClientes,
    getClientesByID,
    getClientesByCedula,
    createClientes,
    updateClientes,
    deleteClientes,
    queryClienteByID,
    getCountClientes
};