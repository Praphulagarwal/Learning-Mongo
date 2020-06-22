const mongoose = require('mongoose');

const customerForProductsSchema = mongoose.Schema({
    username:{type:String,required:true},
    age:{type:Number,required:true},
    purchased_product:[{
        title:{type:Number},
        p_id:{type:Number},
        p_type:{type:String}
    }],
    cart_product:[
        { 
          type: mongoose.Schema.Types.ObjectId,
          ref:'ProductsForSale'
        }
    ]
})

module.exports = mongoose.model('Customer',customerForProductsSchema);