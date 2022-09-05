const express = require("express");
const { mongoose } = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const postModel = require("./modules/postModel");
const postRoute = require("./routes/postRoute");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || '3100';



app.use(express.json());
app.use('/posts', postRoute);


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Stack Overflow API',
            description: 'For post management',
            contact: {
                name: 'Olajide'
            },
            servers: ['http://localhost:3100']
        }
    },
    apis: ["./route/*.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));



app.listen(PORT, () =>
    console.log(`listening on port ${PORT}`)
);