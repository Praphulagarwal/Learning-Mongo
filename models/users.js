const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    username:{type:String},
    email:{type:String,unique:true,required:true},
    imgURL:{type:String},
    password:{type:String,required:true},
    role:{
        type:String,
        default:'basic',
        enum:{
            values: ['basic','supervisor','admin'],
             message: 'Role is not valid.'
        },
    },
    permissions:[
        {type:String,default:'read',enum:['read','add','update','delete']}
    ],
    created_at:{type:Date,default:Date.now()},
    updated_at:{type:Date,default:Date.now()},
    accessToken:{type:String}
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User",userSchema);