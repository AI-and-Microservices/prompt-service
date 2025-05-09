require('dotenv').config();
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const traceMiddleware = require('./middlewares/traceMiddleware');
const paramsMiddleware = require('./middlewares/paramsMiddleware');
const responseMiddleware = require('./middlewares/responseMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const crossServiceMiddleware = require('./middlewares/crossServiceMiddleware');
const authorizeMiddleware = require('./middlewares/authorizeMiddleware');
const authRoutes = require('./routes/authRoutes');
const crossServiceRoutes = require('./routes/crossServiceRoutes');
const errorHandler = require('./middlewares/errorHandler');
const adminRoutes = require('./routes/adminRoutes');
const filePath = `./keys/${process.env.CROSS_SERVICE_KEY_VERSION}_private.pem`;
if (!fs.existsSync(filePath)) {
  console.log('Have no key pairs for cross service request');
  console.log(`Let run: sh ./bin/genkey.sh -v=${process.env.CROSS_SERVICE_KEY_VERSION}`);
  process.exit(1);
}

const app = express();
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(traceMiddleware);
app.use(paramsMiddleware);
app.use(responseMiddleware);

const apiPrefix = `/${process.env.SERVICE_NAME}`;
app.use(apiPrefix, authMiddleware, authRoutes);
app.use(`${apiPrefix}/admin`, authorizeMiddleware('admin'), adminRoutes);
app.use('/internal', crossServiceMiddleware, crossServiceRoutes);

// error handling
app.use(errorHandler);
module.exports = app;
