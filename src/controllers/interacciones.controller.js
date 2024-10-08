const pool = require('../database/db');
const { queryUsuarioByID } = require('./usuarios.controller');
const { queryAgenciaByID } = require('./agencias.controller');
const { queryCanalByID } = require('./canal.controller');
const { queryTemaByID } = require('./temas.controller');
const { queryClienteByID } = require('./clientes.controller');

// Función de mapeo para enriquecer las filas de interacción
async function mapRow(row) {
    // Solicitar y esperar por todos los detalles relacionados de manera asincrónica
    const usuario = await queryUsuarioByID(row.id_usuario);
    const agencia = await queryAgenciaByID(row.id_agencia);
    const canal = await queryCanalByID(row.id_canal);
    const tema = await queryTemaByID(row.id_tema);
    const cliente = await queryClienteByID(row.id_cliente);

    // Añadir los resultados directamente al objeto 'row' como subobjetos
    row.usuario = usuario;
    row.agencia = agencia;
    row.canal = canal;
    row.tema = tema;
    row.cliente = cliente;

    return row;
}



// Función de mapeo para enriquecer las filas de interacción
async function mapRowUltInte(row) {
    // Solicitar y esperar por todos los detalles relacionados de manera asincrónica
    
    const cliente = await queryClienteByID(row.id_cliente);
    const tema = await queryTemaByID(row.id_tema);

    // Añadir los resultados directamente al objeto 'row' como subobjetos
    row.tema = tema;
    row.cliente = cliente;

    return row;
}

const getInteracciones = async (req, res) => {
    const query = `
        SELECT i.*, u.nombre_usu, a.nombre_age, c.nombre_can, t.nombre_tema, cl.nombre_cli, cl.apellido_cli
        FROM interacciones i
        JOIN usuarios u ON i.id_usuario = u.id_usuario
        JOIN agencias a ON i.id_agencia = a.id_agencia
        JOIN canal c ON i.id_canal = c.id_canal
        JOIN temas t ON i.id_tema = t.id_tema
        JOIN clientes cl ON i.id_cliente = cl.id_cliente`;

    pool.query(query, async (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: 'Error al buscar interacciones' });
        }
        
        const interacciones = result.rows;
        res.status(200).json(interacciones);
    });
};



// Endpoint para obtener todas las interacciones
const getInteraccione = async (req, res) => {
    pool.query('SELECT * FROM interacciones', async (err, result) => {
        if (err) {
            console.error(err.stack);
            res.status(500).json({ error: 'Error al buscar interacciones' });
        } else {
            const interacciones = await Promise.all(result.rows.map(mapRow));
            res.status(200).json(interacciones);
        }
    });
};

const getInteraccionesByIDD = async(req, res) => {
    const { id } = req.params;
    
    const query = 'SELECT * FROM interacciones WHERE id_interaccion = $1';
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

const getInteraccionesByI = async(req, res) => {
    const { id } = req.params;
    
    const query = `
        SELECT i.*, u.nombre_usu, a.nombre_age, c.nombre_can, t.nombre_tema, cl.nombre_cli, cl.apellido_cli
        FROM interacciones i
        JOIN usuarios u ON i.id_usuario = u.id_usuario
        JOIN agencias a ON i.id_agencia = a.id_agencia
        JOIN canal c ON i.id_canal = c.id_canal
        JOIN temas t ON i.id_tema = t.id_tema
        JOIN clientes cl ON i.id_cliente = cl.id_cliente
        WHERE i.id_interaccion = $1`;
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error(err.stack);
            return res.status(500).json({ error: 'Error al buscar' });
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }
        
        res.status(200).json(result.rows[0]);
    });
};

const getInteraccionesByID = async(req, res) => {
    const { id } = req.params;
    
    const queryInteraccion = `
        SELECT i.*, u.nombre_usu, a.nombre_age, c.nombre_can, t.nombre_tema, cl.nombre_cli, cl.apellido_cli
        FROM interacciones i
        JOIN usuarios u ON i.id_usuario = u.id_usuario
        JOIN agencias a ON i.id_agencia = a.id_agencia
        JOIN canal c ON i.id_canal = c.id_canal
        JOIN temas t ON i.id_tema = t.id_tema
        JOIN clientes cl ON i.id_cliente = cl.id_cliente
        WHERE i.id_interaccion = $1`;
    const values = [id];

    try {
        const resultInteraccion = await pool.query(queryInteraccion, values);
        if (resultInteraccion.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        const interaccion = resultInteraccion.rows[0];

        const queryProductosServicios = `
            SELECT id_producto_servicio, detalles
            FROM det_interaccion_prod_serv
            WHERE id_interaccion = $1`;
        
        const resultProductosServicios = await pool.query(queryProductosServicios, values);
        const productosServicios = resultProductosServicios.rows;

        res.status(200).json({ ...interaccion, productos_servicios: productosServicios });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Error al buscar' });
    }
};




//endpoint para devolver las interacciones por nombre de usuario o por cedula de usuario
const getInteraccionesByUser = async (req, res) => {
    try {
      const busqueda = req.params.user;
  
      const query = `
        SELECT id_interaccion, fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, nombre_usu, nombre_age, nombre_can, nombre_tema 
        FROM interacciones, usuarios, agencias, canal, temas 
        WHERE (cedula_usu ilike '%${busqueda}%' OR nombre_usu ilike '%${busqueda}%') 
        AND interacciones.id_usuario = usuarios.id_usuario`;
  
        const result = await pool.query(query);
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Registro no encontrado' 
            });
        }
        else {
          return res.status(200).json(result.rows);
            
        }
      
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar' });
    }
  };




//endpoint para devolver las interacciones por nombre de agencia
const getInteraccionesByAgencia = async(req, res) => {
    try {
    const busqueda = req.params.agen;

    const query = `select id_interaccion, fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, nombre_usu, nombre_age, nombre_can, nombre_tema from interacciones, usuarios, agencias, canal, temas where (nombre_age ilike '%${busqueda}%') and interacciones.id_agencia = agencias.id_agencia`;

  
        const result = await pool.query(query);
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Registro no encontrado' 
            });
        }
        else {
          return res.status(200).json(result.rows);
            
        }
      
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar' });
    }
};

//endpoint para devolver las interacciones por nombre de canal
const getInteraccionesByCanal = async(req, res) => {
    try {
    const busqueda = req.params.can;
    
    const query = `select id_interaccion, fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, nombre_usu, nombre_age, nombre_can, nombre_tema from interacciones, usuarios, agencias, canal, temas where (nombre_can ilike '%${busqueda}%') and interacciones.id_canal = canal.id_canal`;

    const result = await pool.query(query);
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Registro no encontrado' 
            });
        }
        else {
          return res.status(200).json(result.rows);
            
        }
      
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar' });
    }
};

//endpoint para devolver las interacciones por nombre de tema
const getInteraccionesByTema = async(req, res) => {
    try {
    const busqueda = req.params.tem;

    const query = `select id_interaccion, fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, nombre_usu, nombre_age, nombre_can, nombre_tema from interacciones, usuarios, agencias, canal, temas where (nombre_tema ilike '%${busqueda}%') and interacciones.id_tema = temas.id_tema`;
    const result = await pool.query(query);
    if (result.rows.length === 0) {
        return res.status(404).json({ 
            error: 'Registro no encontrado' 
        });
    }
    else {
      return res.status(200).json(result.rows);
        
    }
  
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar' });
}
};




//endpoint para crear una interaccion
const createInteraccione = async(req, res) => {
    const {...campos} = req.body;
    
    const query = `INSERT INTO interacciones (fecha, cant_mensaje, nombre_graba, observacion, 
                    duracion_llamada, id_usuario, id_agencia, id_canal, id_tema, id_cliente) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_interaccion`;
    const values = [
        campos.fecha, 
        campos.cant_mensaje, 
        campos.nombre_graba, 
        campos.observacion, 
        campos.duracion_llamada,
        campos.id_usuario, 
        campos.id_agencia, 
        campos.id_canal, 
        campos.id_tema, 
        campos.id_cliente
    ];

    pool.query(query, values, (err, result) => {

        if(err) {
            res.status(500).json({ error: 'Error al insertar' });
        } else {
            campos.id_interaccion = result.rows[0].id_interaccion; // Obtengo el ID del registro creado
            res.json({
                message: 'Interaccion registrada correctamente',
                cliente: campos
            })
        }
    }); 


};


const createInteracciones = async(req, res) => {
    const { fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, id_agencia, id_canal, id_tema, id_cliente, productos_servicios } = req.body;
    const { uid: id_usuario } = req.user;

    try {
        const query = `INSERT INTO interacciones (fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, id_usuario, id_agencia, id_canal, id_tema, id_cliente) 
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_interaccion`;
        const values = [fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, id_usuario, id_agencia, id_canal, id_tema, id_cliente];

        const result = await pool.query(query, values);
        const id_interaccion = result.rows[0].id_interaccion;

        // Guardar productos y servicios
        if (productos_servicios && productos_servicios.length > 0) {
            const prodServQueries = productos_servicios.map(prod_serv => {
                const queryProdServ = 'INSERT INTO det_interaccion_prod_serv (id_interaccion, id_producto_servicio, detalles) VALUES($1, $2, $3)';
                const valuesProdServ = [id_interaccion, prod_serv.id_producto_servicio, prod_serv.detalles];
                return pool.query(queryProdServ, valuesProdServ);
            });
            await Promise.all(prodServQueries);
        }

        res.status(200).json({
            id_interaccion,
            message: 'Interacción registrada correctamente'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al insertar' });
    }
};


const updateInteraccione = async(req, res) => {
    const { ...campos } = req.body;

    const query = `UPDATE interacciones SET fecha = $1, cant_mensaje = $2, nombre_graba = $3, 
        observacion = $4, duracion_llamada = $5, id_usuario = $6, id_agencia = $7, 
        id_canal = $8, id_tema = $9, id_cliente = $10 WHERE id_interaccion = $11`;
    const values = [
        campos.fecha, 
        campos.cant_mensaje, 
        campos.nombre_graba, 
        campos.observacion, 
        campos.duracion_llamada,
        campos.id_usuario, 
        campos.id_agencia, 
        campos.id_canal, 
        campos.id_tema, 
        campos.id_cliente,
        campos.id_interaccion
    ];

    pool.query(query, values, (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar' });
        } else {
            res.status(200).json({
                message: 'Interacción actualizada correctamente'
            });
        }
    });
};


const updateInteracciones = async(req, res) => {
    const { id_interaccion, fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, id_agencia, id_canal, id_tema, id_cliente, productos_servicios } = req.body;
    const { uid: id_usuario } = req.user;

    try {
        const query = `UPDATE interacciones SET fecha = $2, cant_mensaje = $3, nombre_graba = $4, observacion = $5, duracion_llamada = $6, 
                       id_usuario = $7, id_agencia = $8, id_canal = $9, id_tema = $10, id_cliente = $11 
                       WHERE id_interaccion = $1 RETURNING id_interaccion`;
        const values = [id_interaccion, fecha, cant_mensaje, nombre_graba, observacion, duracion_llamada, id_usuario, id_agencia, id_canal, id_tema, id_cliente];
        const result = await pool.query(query, values);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Interacción no encontrada' });
        }

        await pool.query('DELETE FROM det_interaccion_prod_serv WHERE id_interaccion = $1', [id_interaccion]);

        if (productos_servicios && productos_servicios.length > 0) {
            const prodServQueries = productos_servicios.map(prod_serv => {
                const queryProdServ = 'INSERT INTO det_interaccion_prod_serv (id_interaccion, id_producto_servicio, detalles) VALUES($1, $2, $3)';
                const valuesProdServ = [id_interaccion, prod_serv.id_producto_servicio, prod_serv.detalles];
                return pool.query(queryProdServ, valuesProdServ);
            });
            await Promise.all(prodServQueries);
        }

        res.status(200).json({ message: 'Interacción actualizada correctamente' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar' });
    }
};




const deleteInteraccione = async(req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM interacciones WHERE id_interaccion = $1';
    const values = [id];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: 'Error al eliminar la interacción' });
        } else if (result.rowCount === 0) {
            res.status(404).json({ error: 'Interacción no encontrada' });
        } else {
            res.status(200).json({ message: 'Interacción eliminada correctamente' });
        }
    });
};


const deleteInteracciones = async(req, res) => {
    const { id } = req.params;

    try {
        // Primero elimina los registros en la tabla intermedia
        await pool.query('DELETE FROM det_interaccion_prod_serv WHERE id_interaccion = $1', [id]);

        // Luego elimina el registro en la tabla principal
        const query = 'DELETE FROM interacciones WHERE id_interaccion = $1';
        const values = [id];

        const result = await pool.query(query, values);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Interacción no encontrada' });
        }

        res.status(200).json({ message: 'Interacción eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la interacción' });
    }
};


// Agrega esto al final de tu archivo interacciones.controller.js
const getCountInteracciones = async (req, res) => {
    const query = 'SELECT COUNT(*) AS count FROM interacciones';
    
    try {
        const result = await pool.query(query);
        res.status(200).json(result.rows[0].count);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el conteo de interacciones' });
    }
};

// Endpoint para obtener todas las interacciones
const getUltimasInteracciones = async (req, res) => {
    pool.query('SELECT * FROM interacciones ORDER BY fecha DESC LIMIT 10', async (err, result) => {
        if (err) {
            console.error(err.stack);
            res.status(500).json({ error: 'Error al buscar interacciones' });
        } else {
            const interacciones = await Promise.all(result.rows.map(mapRowUltInte));
            res.status(200).json(interacciones);
        }
    });
};

const getActividadReciente = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM actividad_reciente ORDER BY fecha DESC LIMIT 5');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener la actividad reciente' });
    }
};



module.exports = { 
    getInteracciones,
    getInteraccionesByID,
    getInteraccionesByUser,
    getInteraccionesByAgencia,
    getInteraccionesByCanal,
    getInteraccionesByTema,
    createInteracciones,
    updateInteracciones,
    deleteInteracciones,
    getCountInteracciones,
    getUltimasInteracciones,
    getActividadReciente
}; 