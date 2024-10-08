require('dotenv').config();
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const app = express();

const host = process.env.HOST_APP;
const port = process.env.PORT_APP || 3030;

// swagger
const { swaggerDocs: V1SwaggerDocs } = require('./v1/swagger');

// middelwares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors());
app.use(morgan('dev'));
// routes
app.use(require('./routes/index'));

app.listen(port, () => {
  
  console.log(`Server up http://${host}:${port}`);

  // swagger
  V1SwaggerDocs(app);
  
});
