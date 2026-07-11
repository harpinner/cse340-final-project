import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { caCert, dbConnectionString } from './src/models/db.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';
import express from 'express';
import ejs from 'ejs';
import flash from 'express-flash-message';
import routes from './src/controllers/routes.js';
import { addLocalVariables } from './src/middleware/globals.js';
import setupDatabase from './src/models/setup.js';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);
const DBurl = dbConnectionString;
// Configure session middleware
//console.log(caCert)

app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: DBurl,
            // Configure SSL for session store connection (required by BYU-I databases)
            ssl: {
                ca: caCert,
                rejectUnauthorized: true,
                checkServerIdentity: () => { return undefined; }
            }
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV?.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

startSessionCleanup(); // Start automatic session cleanup// Start automatic session cleanup

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(flash({ sessionKeyName: 'flashMessage' }));
app.use(addLocalVariables);
app.use(routes);

const startServer = async () => {
  await setupDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to initialize the database:', error.message);
  process.exit(1);
});
