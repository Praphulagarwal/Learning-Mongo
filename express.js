const express = require('express')
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authController = require('./controllers/auth');
const productController = require('./controllers/product');
const User = require('./models/users');
const multer = require('multer');
const City =  require('./models/city');
const Citizens = require('./models/citizens');

mongoose.connect('mongodb://localhost:27017/learn-mongo',{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database')
        const server = app.listen(3000);
        //console.log(server)
    })
    .catch(() => {
        console.log('Connection Failed..!!')
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {
      next();
    }
}



app.use(ignoreFavicon);

app.use((req,res,next) => {

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    ); 
    res.setHeader("Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept"
    )
    res.setHeader("Access-Control-Allow-Methods",
        "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    )
    next();
});


app.use(async (req,res,next)=>{
    if(req.headers['x-access-token']){
        const {id,exp} =  await jwt.verify(req.headers['x-access-token'],process.env.JWT_SECRET)
        if (exp < Date.now().valueOf() / 1000) { 
            return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
        } 
        res.locals.loggedInUser = await users.findById(id);
        console.log(res.locals.loggedInUser)
    }
    next();
})

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg'
}

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        const error = new Error("Invalid mime type");
        if(isValid){
            error = null;
            
        }
        
        cb(error,'images');
    },
    filename:(req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'-'+ext);
    }
})

app.post('/learn-mongo/signup',authController.signup);
app.post('/learn-mongo/login',authController.login);
app.get('/learn-mongo/users',authController.checkLogin,authController.getUsers);
app.delete('/learn-mongo/delete-user',authController.checkLogin,authController.deleteUser);
app.put('/learn-mongo/update-user',authController.checkLogin,authController.updateUser);

app.post('/learn-mongo/add-new-product',authController.checkLogin,productController.addProduct);
app.get('/learn-mongo/get-products',authController.checkLogin,productController.getProduct);
app.put('/learn-mongo/update-product',authController.checkLogin,productController.updateProduct);
app.delete('/learn-mongo/delete-product',authController.checkLogin,productController.deleteProduct);

// app.post('/learn-mongo/upload-image', multer({storage: storage}).single('image'), (req,res,next) => {
//   console.log(req.body)
//   const url = req.protocol + '://' + req.get("host");
  
//   const user = new User({
//         email:req.body.email,
//         password:req.body.password,
//         role:req.body.role || 'basic',
//         imgUrl: url + "/images/" + req.file.filename
//   })
//   user.save();
//   res.status(201).json({
//       message: "User added successfully"
//   });
// });

app.post('/learn-mongo/add-city',(req,res,next) => {
    City.create(req.body)
        .then(result => {
            res.status(201).json({
                message:"Your City Added",
                data:result
            })
        })
        .catch(err => {
            res.status(422).json({
                message:"Error Ocurred",
                data:err
            })
        })
})

app.get('/learn-mongo/get-cities',(req,res,next) => {
    City.find()
        .then(result => {
            res.status(201).json({
                message:"Your Cities",
                data:result
            })
        })
        .catch(err => {
            res.status(422).json({
                message:"Error Ocurred",
                data:err
            })
        })
})

app.get('/learn-mongo/get-citizens',(req,res,next) => {
    Citizens
        .find()
        .populate('cityId')
        .then(result => {
            res.status(201).json({
                message:"Your Citizens",
                data:result
            })
        })
        .catch(err => {
            res.status(422).json({
                message:"Error Ocurred",
                data:err
            })
        })
})

app.post('/learn-mongo/add-citizen',(req,res,next) => {
    if(!req.body.cityId){
        return res.status(404).json({
            error:"Your city not found"
        })
    }else{
        Citizens.create(req.body)
            .then(result => {
                res.status(201).json({
                    message:"Citizen Added",
                    data:result
                })
            })
            .catch(err => {
                res.status(422).json({
                    message:"Error Ocurred",
                    data:err
                })
            })
    }
})

app.use((error,req,res,next)=>{
    res.status(500).json({
        message:"Some Error Occured",
        error:error
    })
})

module.exports = app;