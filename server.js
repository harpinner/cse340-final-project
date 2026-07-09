import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { caCert } from './src/models/db.js';
import { startSessionCleanup } from './src/utils/session-cleanup.js';
import express from 'express';
import ejs from 'ejs';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);
const DBurl  = process.env.DB_URL;
// Configure session middleware
console.log(caCert)

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


app.get('/', (req, res) => {
 // res.send('Hello World');
 res.render('placeholder', { title: 'Home' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
