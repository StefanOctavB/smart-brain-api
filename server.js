const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const register = require('./controlers/register');
const signin = require('./controlers/signin');
const profile = require('./controlers/profile');
const image = require('./controlers/image');

var db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'admin',
    database : 'facerecognition'
  }
});

//* Test to check if the knex package is working
/* db.select('*').from('users').then(data => {
    console.log(data);
}) */

const app = express();
//* Middleware
app.use(bodyParser.json());
app.use(cors());

//! Working without a DB 
/* const database = {
    users: [
        {
            id:'123',
            name: 'john',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }

    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
} */


//* Basic route 

app.get('/', (req,res) =>{
    res.send(db.users);
})

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })//* Dependencies injection

app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)}) 

app.get('/profile/:id', (req,res) => {profile.handleProfileGet(req,res,db)})

app.put('/image', (req,res) => {image.handleImage(req,res,db)} )
app.post('/imageurl',(req,res)=>{image.handleApiCall(req,res)})

//* Bcrypt workflow
/* bcrypt.hash("bacon",null,null, function(err,hash){
    //* Store hash in the password DB
});
//* Load hash from your password DB
bcrypt.compare("bacon",hash, function (err, res)  {
    //res == true
});
bcrypt.compare("veggies", hash, function (err, res) {
    //res == false
}); */



app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/* 
//* --> res = this is working 
//* /singin --> POST success/fail (signin use a POST request beacuse of the password send inside of a body over HTTPS, so is hidden from man-in-the-middle )
//* /register --> POST = user
//* /profile?:userID --> GET = user
//* /image --> PUT --> user 

*/