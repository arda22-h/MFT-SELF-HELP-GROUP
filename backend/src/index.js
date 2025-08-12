
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');

const contactFormRoutes = require('./routes/contactForm');

const usersRoutes = require('./routes/users');

const bank_accountsRoutes = require('./routes/bank_accounts');

const contributionsRoutes = require('./routes/contributions');

const documentsRoutes = require('./routes/documents');

const expensesRoutes = require('./routes/expenses');

const finesRoutes = require('./routes/fines');

const lettersRoutes = require('./routes/letters');

const loansRoutes = require('./routes/loans');

const membersRoutes = require('./routes/members');

const projectsRoutes = require('./routes/projects');

const welfare_contributionsRoutes = require('./routes/welfare_contributions');

const getBaseUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const options = {
  definition: {
    openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "MFT SELF HELP GROUP",
        description: "MFT SELF HELP GROUP Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.",
      },
    servers: [
      {
        url: getBaseUrl(process.env.NEXT_PUBLIC_BACK_API) || config.swaggerUrl,
        description: "Development server",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid"
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', function (req, res, next) {
    swaggerUI.host = getBaseUrl(process.env.NEXT_PUBLIC_BACK_API) || req.get('host');
    next()
  }, swaggerUI.serve, swaggerUI.setup(specs))

app.use(cors({origin: true}));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.enable('trust proxy');

app.use('/api/users', passport.authenticate('jwt', {session: false}), usersRoutes);

app.use('/api/bank_accounts', passport.authenticate('jwt', {session: false}), bank_accountsRoutes);

app.use('/api/contributions', passport.authenticate('jwt', {session: false}), contributionsRoutes);

app.use('/api/documents', passport.authenticate('jwt', {session: false}), documentsRoutes);

app.use('/api/expenses', passport.authenticate('jwt', {session: false}), expensesRoutes);

app.use('/api/fines', passport.authenticate('jwt', {session: false}), finesRoutes);

app.use('/api/letters', passport.authenticate('jwt', {session: false}), lettersRoutes);

app.use('/api/loans', passport.authenticate('jwt', {session: false}), loansRoutes);

app.use('/api/members', passport.authenticate('jwt', {session: false}), membersRoutes);

app.use('/api/projects', passport.authenticate('jwt', {session: false}), projectsRoutes);

app.use('/api/welfare_contributions', passport.authenticate('jwt', {session: false}), welfare_contributionsRoutes);

app.use('/api/contact-form', contactFormRoutes);

app.use(
  '/api/search',
  passport.authenticate('jwt', { session: false }),
  searchRoutes);

const publicDir = path.join(
  __dirname,
  '../public',
);

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function(request, response) {
    response.sendFile(
      path.resolve(publicDir, 'index.html'),
    );
  });
}

const PORT = process.env.NODE_ENV === 'dev_stage' ? 3000 : 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
