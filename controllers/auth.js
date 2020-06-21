const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const users = require('../models/users');
const multer = require('multer');
require('dotenv').config()



exports.signup = async (req,res,next) => {
    const psw = await bcrypt.hash(req.body.password,10)
    req.body.password = psw;
    const user = new User({
        email:req.body.email,
        password:psw,
        role:req.body.role || 'basic'
    })
    if(req.body.role == 'basic'){
        user.permissions.push('read')
    }else if(req.body.role == 'supervisor'){
        user.permissions.push('read');
        user.permissions.push('add');
        user.permissions.push('update');
    }else if(req.body.role == 'admin'){
        user.permissions.push('read');
        user.permissions.push('add');
        user.permissions.push('update');
        user.permissions.push('delete');
    }
    user.save()
      .then(result => {
          res.status(200).json({
            message:"user created",
            data:result
        })
      })
      .catch(err => {
          if(err.errors['role']){
             res.status(422).json({
                 Error:err.errors['role'].properties.message
             })
          }else if(err.errors['email']){
              res.status(422).json({
                  Error:"Email already used"
              })
          }
      })
    
}

exports.login = async (req,res,next) => {
    const user = await User.findOne({email:req.body.email});
    if(user){
       const isValidPsw = await bcrypt.compare(req.body.password,user.password);
       if(!isValidPsw){
           return res.status(422).json({
               error:"Password is not correct..Please enter a valid password"
           })
       }else{
           const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
               expiresIn:"1d"
           })
           const updatedUser = await User.findById(user._id);
           updatedUser.accessToken = token;
           updatedUser.save()
           .then(result=>{
               // console.log('result',result)
                // res.locals.loggedInUser = result;
                // console.log(res.locals.loggedInUser)
                return res.status(200).json({
                    message:"User is now logged in",
                    data:result
                })
           })
           .catch(err=>{
                return res.status(200).json({
                    message:"Some Error Occured",
                    error:err._message
                })
           });
       }
    }else{
        return res.status(422).json({
            error:"User not found"
        })
    }
}

exports.checkLogin = async (req,res,next) => {
    if(!res.locals.loggedInUser){
        return res.status(401).json({
            error:"You are not logged in"
        })
    }
    next();
}

exports.getUsers = async (req,res,next) => {
    //console.log('Get',res.locals.loggedInUser)
    const user = res.locals.loggedInUser;
    if(user.role == 'admin'){
        res.status(200).json({
            message:"All users",
            data: await User.find().select({email:1,role:1,permissions:1})
        })
    }else{
        res.status(403).json({
            error:"Sorry..Permission Denied"
        })
    }
    
}

exports.deleteUser = async (req,res,next) => {
    if(res.locals.loggedInUser.role == 'admin'){
        User.findByIdAndDelete(req.body.id)
          .then(result=>{
              return res.status(200).json({
                  message:"User Deleted",
                  data:result
              })
          })
          .catch(err => {
            next(new Error(err));
          })
    }else{
        res.status(403).json({
            message:"Sorry..You don't have permission to delete this user..",
        })
    }
}

exports.updateUser = (req,res,next) => {
    if(res.locals.loggedInUser.role != 'basic'){
        User.findByIdAndUpdate(req.body.id,req.body,{ new: true, useFindAndModify: false })
          .then(result=>{
              return res.status(200).json({
                  message:"User Updated",
                  data:result
              })
          })
          .catch(err => {
            next(new Error(err));
          })
    }else{
        res.status(403).json({
            message:"Sorry..You don't have permission to update the product..",
        })
    }
}