const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const multer = require("multer");
const session = require('express-session')
const mongoose = require("mongoose");
const path = require("path");
const app = express();
global.__basedir = __dirname;

global.__basedir = __dirname;



app.set('view engine', 'ejs'); // Set EJS as the default template engine
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.use(bodyParser.urlencoded({extended: true}));
app.use(
  session({
    secret: 'aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789!@#$%^&*()',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // Session will expire after 1 hour of inactivity
    },
  })
);
app.use(morgan(':method :url :status :user-agent - :response-time ms'));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/static', express.static('static'));
app.use('/public', express.static('public'));

app.get('*', (_, res) => res.status(200).json({ message: 'App running well..! :)' }));
app.use(cors({
    origin: ['http://localhost']
  }))

// Middleware to handle form data and file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
      },
    });
    
    const upload = multer({ storage: storage });
    
    app.use('/image', express.static(path.join(__dirname, 'uploads')));
    

// Connecting Mongoose\
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser : true,
    useUnifiedTopology: true
  })
  
  const db = mongoose.connection;
  db.on('error', (error) => console.log(error));
  db.once('open', ()=> console.log('Connected to the database!'));
  


app.listen(
    process.env.PORT, () => {
        console.log(`App is running on http://localhost:${process.env.PORT}`);
    }
);