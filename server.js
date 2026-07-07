import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import express from 'express';
import ejs from 'ejs';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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
