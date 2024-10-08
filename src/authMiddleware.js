// authMiddleware.js
// const jwt = require('jsonwebtoken');
// const { secretKey } = require('../src/config');

// function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Acceso no autorizado' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Acceso no autorizado' });
//   }
// }

// module.exports = authMiddleware;


const jwt = require('jsonwebtoken');
const { secretKey } = require('../src/config'); // Asegúrate de que la ruta del archivo config sea correcta

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    
    // Almacenar el uid y rol del usuario en req.user para acceder en otras rutas
    req.user = {
      uid: decoded.uid,
      rol: decoded.rol
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
}

// Middleware para verificar los roles (autorización)
function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
}


module.exports = {
  authMiddleware,
  authorize
}; 
