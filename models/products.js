const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    product_name:{type:String,required:true},
    imgUrl:{type:String,required:true},
    price:{
        type:Number,
        default:0
    },
    created_at:{type:Date,default:Date.now()},
    updated_at:{type:Date,default:Date.now()},
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
})


module.exports = mongoose.model("Products",productSchema);