// const pool = require('../database/db');
// const bcrypt = require('bcryptjs');
// const { generarJWT } = require('../helpers/jwt');



// //endpoint para devolver todas los usuarios
// const getUsuarios = async(req, res) => {
//     pool.query('select id_usuario, cedula_usu, nombre_usu, email_usu, "user", "password" from usuarios', (err, result) => {
//         if (err) {
//             res.status(500).json({ error: 'Error al buscar' });
//         } else {
//             res.json(result.rows);
//         }
//     });
// };

// const queryUsuarioByID = async(id) => {
//     const query = `select * from usuarios where id_usuario = $1`;
//     const values = [id];

//     try {
//         const result = await pool.query(query, values)
//         return result.rows[0];
//     } catch (error) {
//         console.log( error );
//         throw new Error('Error al buscar usuariog por ID');
//     }
// }

// //endpoint para devolver los usuarios por un ID determinado
// const getUsuariosByID = async (req, res) => {
//     const { id } = req.params;
//     const query = `SELECT id_usuario, cedula_usu, nombre_usu, email_usu, "user", "password" FROM usuarios WHERE id_usuario=$1`;
//     const values = [id];

//     try {
//         const result = await pool.query(query, values);
//         if (result.rows.length === 0) {
//             res.status(404).json({ error: 'Registro no encontrado' });
//         } else {
//             res.json(result.rows[0]);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error al buscar' });
//     }
// };


// //endpoint para devolver los usuarios por cedula, nombre, user
// const getUsuariosByCed = async(req, res) => {
//     const busqueda = req.params.ced;

//     const query = `select id_usuario, cedula_usu, nombre_usu, email_usu, user, password from usuarios where (cedula_usu ilike '%${busqueda}%' OR nombre_usu ilike '%${busqueda}%' OR user ilike '%${busqueda}%')`;

//     pool.query(query, (err, result) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Error al buscar' });
//         }
//         if (result.rows.length === 0) {
//             res.status(404).json({ error: 'Registro no encontrado' });
//         } else {
//             res.json(result.rows);
//         }
//     });
// };

// //endpoint para crear un usuario
// const createUsuarios = async(req, res) => {
//     let { cedula_usu, nombre_usu, email_usu, user, password } = req.body;

//     const { rows } = await pool.query('select id_usuario, cedula_usu, nombre_usu, email_usu, user, password from usuarios');
//     const existeUserName = rows.find(element => element.user === user);

//     if( existeUserName){
//         return res.status(400).json({
//             success: false,
//             message: 'El nombre de usuario ya está registrado'
//         });
//     }

//     // ENCRIPTAR CONTRASEÑA
//     let salt = bcrypt.genSaltSync();
//     password = bcrypt.hashSync(password, salt);

//     const query = 'INSERT INTO usuarios (cedula_usu, nombre_usu, email_usu, "user", password) VALUES ($1, $2,$3,$4,$5) RETURNING *';
//     const values = [cedula_usu, nombre_usu, email_usu, user, password];

//     pool.query(query, values, async (err, result) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Error al insertar' });
//         } else {
//             // obtengo los datos del usuario creado
//             const usuario = result.rows[0];

//             // genero un token de acuerdo al id del usuario
//             const token = await generarJWT(usuario.id_usuario);
            
//             res.json({
//                 message: 'Usuario agregado correctamente',
//                 usuario,
//                 token
//             });
//         }
//     });
// };

// //endpoint para modificar un usuario
// const updateUsuarios = async(req, res) => {
 
//     //const {id_usuario, cedula_usu, nombre_usu, email_usu, user_usu, password_usu} = req.body;
//     const { id_usuario, cedula_usu, nombre_usu, email_usu, user, password } = req.body;

//     // Obtener la contraseña actual del usuario
//     const { rows } = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
//     const usuario = rows[0];
    
//     if (!usuario) {
//         return res.status(404).json({
//             success: false,
//             message: 'Usuario no encontrado'
//         });
//     }

//     // Verificar si la contraseña proporcionada es la misma que la almacenada
//     let passwordHashed = usuario.password; // Contraseña almacenada en la base de datos
//     if (password && !bcrypt.compareSync(password, passwordHashed)) {
//         // Si se proporciona una nueva contraseña y no coincide con la almacenada
//         let salt = bcrypt.genSaltSync();
//         passwordHashed = bcrypt.hashSync(password, salt);
//     } else {
//         passwordHashed = password
//     }

//     console.log( passwordHashed  );

//     const query = 'UPDATE usuarios SET cedula_usu = $2, nombre_usu = $3, email_usu = $4, "user" = $5, password = $6 WHERE id_usuario = $1';
//     const values = [id_usuario, cedula_usu, nombre_usu, email_usu, user, passwordHashed];

//     pool.query(query, values, (err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Error al actualizar' });
//         } else {
//             res.json({
//                 message: 'Usuario modificado correctamente'
//             });
//         }
//     });
// };

// //endpoint para eliminar un usuario
// const deleteUsuarios = async(req, res) => {
//     const { id } = req.params;

//     // Realizar la lógica de eliminación del usuario según el ID proporcionado
//     const query = 'DELETE FROM usuarios WHERE id_usuario = $1';
//     const values = [id];

//     pool.query(query, values, (err, result) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Error al eliminar el usuario' });
//         } else if (result.rowCount === 0) {
//             res.status(404).json({ error: 'Usuario no encontrado' });
//         } else {
//             res.json({ message: 'Usuario eliminado correctamente' });
//         }
//     });
// };

// const getCountUsuarios = async (req, res) => {
//     const query = 'SELECT COUNT(*) FROM usuarios';
    
//     try {
//         const result = await pool.query(query);
//         res.status(200).json(result.rows[0].count);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error al obtener el conteo de usuarios' });
//     }
// };

// module.exports = {
//     getUsuarios,
//     getUsuariosByID,
//     getUsuariosByCed,
//     createUsuarios,
//     updateUsuarios,
//     deleteUsuarios,
//     queryUsuarioByID,
//     getCountUsuarios
// };

const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

// Obtener todos los usuarios con sus roles
const getUsuarios = async(req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id_usuario, u.cedula_usu, u.nombre_usu, u.email_usu, u.user, r.nombre_rol
            FROM usuarios u
            INNER JOIN roles r ON u.id_rol = r.id_rol
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar los usuarios' });
    }
};

// Obtener usuario por ID
const getUsuariosByID = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT u.id_usuario, u.cedula_usu, u.nombre_usu, u.email_usu, u.user, r.nombre_rol
            FROM usuarios u
            INNER JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.id_usuario = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }
};

// Buscar usuarios por cédula, nombre o usuario
const getUsuariosByCed = async (req, res) => {
    const busqueda = req.params.ced;

    try {
        const result = await pool.query(`
            SELECT id_usuario, cedula_usu, nombre_usu, email_usu, user 
            FROM usuarios 
            WHERE (cedula_usu ILIKE $1 OR nombre_usu ILIKE $1 OR user ILIKE $1)
        `, [`%${busqueda}%`]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Registro no encontrado' });
        }

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }
};

// Crear un nuevo usuario
const createUsuarios = async(req, res) => {
    const { cedula_usu, nombre_usu, email_usu, user, password, id_rol } = req.body;

    try {
        // Verificar si el nombre de usuario ya existe
        const { rows } = await pool.query('SELECT user FROM usuarios WHERE user = $1', [user]);
        if (rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario ya está registrado'
            });
        }

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        const passwordHashed = bcrypt.hashSync(password, salt);

        // Insertar el usuario en la base de datos
        const result = await pool.query(`
            INSERT INTO usuarios (cedula_usu, nombre_usu, email_usu, "user", password, id_rol)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [cedula_usu, nombre_usu, email_usu, user, passwordHashed, id_rol]);

        // Generar el token JWT
        const token = await generarJWT(result.rows[0].id_usuario);

        res.json({
            message: 'Usuario agregado correctamente',
            usuario: result.rows[0],
            token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

// Actualizar un usuario existente
const updateUsuarios = async(req, res) => {
    const { id_usuario, cedula_usu, nombre_usu, email_usu, user, password, id_rol } = req.body;

    try {
        // Verificar si el usuario existe
        const { rows } = await pool.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
        const usuario = rows[0];

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Encriptar la nueva contraseña si es proporcionada
        let passwordHashed = usuario.password;
        if (password && password !== usuario.password) {
            const salt = bcrypt.genSaltSync();
            passwordHashed = bcrypt.hashSync(password, salt);
        }

        // Actualizar el usuario en la base de datos
        await pool.query(`
            UPDATE usuarios 
            SET cedula_usu = $2, nombre_usu = $3, email_usu = $4, "user" = $5, password = $6, id_rol = $7
            WHERE id_usuario = $1
        `, [id_usuario, cedula_usu, nombre_usu, email_usu, user, passwordHashed, id_rol]);

        res.json({ message: 'Usuario modificado correctamente' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario
const deleteUsuarios = async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};

// Obtener el conteo de usuarios
const getCountUsuarios = async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM usuarios');
        res.status(200).json({ count: result.rows[0].count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el conteo de usuarios' });
    }
};

module.exports = {
    getUsuarios,
    getUsuariosByID,
    getUsuariosByCed,
    createUsuarios,
    updateUsuarios,
    deleteUsuarios,
    getCountUsuarios
};
