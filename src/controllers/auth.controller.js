const { response } = require("express");
const bcrypt = require('bcryptjs');
const pool = require("../database/db");
const { generarJWT } = require("../helpers/jwt");

const login = async(req, res = response) => {
  const {username, password } = req.body;
  try {
    
    const { rows } = await pool.query("SELECT * FROM usuarios;");
    const existeUsuario = rows.find( e => e.user === username );

    if (!existeUsuario ) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Verificar la contraseña
    const validPassword = bcrypt.compareSync( password, existeUsuario.password);
    if( !validPassword ){
      return res.status(400).json({
        success: false,
        message: 'Credenciales invalidadas'
      });
    }

    // Obtener el rol del usuario directamente desde la tabla usuarios
    const rolResult = await pool.query(`
      SELECT r.nombre_rol FROM roles r 
      WHERE r.id_rol = $1
    `, [existeUsuario.id_rol]);

    const rol = rolResult.rows[0]?.nombre_rol;

    if (!rol) {
      return res.status(400).json({
        success: false,
        message: 'El usuario no tiene un rol asignado'
      });
    }


    // GENERAMOS EL TOKEN - JWT
    const token = await generarJWT( existeUsuario.id_usuario, rol );

    res.json({
      success: true,
      token,
      user: {
        ...existeUsuario,
        rol // Añadir el rol en la respuesta
      }
    });

  } catch (err) {
    console.log( err );
    res.status(500).json({
      success: false,
      message: err.message
    });
    
  }
};

const renewToken = async(req, res = response) => {
  const { uid } = req.user;

  // Obtener el rol del usuario directamente desde la tabla usuarios
  const rolResult = await pool.query(`
    SELECT r.nombre_rol FROM roles r 
    WHERE r.id_rol = (SELECT id_rol FROM usuarios WHERE id_usuario = $1)
  `, [uid]);

  const rol = rolResult.rows[0]?.nombre_rol;

  // Generar el nuevo token con el rol incluido en el payload
  const token = await generarJWT(uid, rol);

  // Obtener el usuario por UID
  const { rows } = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [uid]);
  const user = rows[0];

  res.json({
    success: true,
    token,
    user: {
      ...user,
      rol // Añadir el rol en la respuesta
    }
  });
};

module.exports = {
  login,
  renewToken
};