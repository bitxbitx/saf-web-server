const { Express } = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { version } = require("../package.json");
const log = require("./logger");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SAF API",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    // path.resolve(__dirname, "../routes/user.routes.js"),
     "./controllers/**/*.js",
     "./routes/**/*.js",
     "./models/**/*.js",
  ], // Use path.resolve() to get the absolute path
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  log.info(`Docs available at http://localhost:${port}/docs`);
}

module.exports = swaggerDocs;
