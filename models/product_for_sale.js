const mongoose = require('mongoose');

const productsForSaleSchema = mongoose.Schema({
    title:{type:String,required:true},
    p_brand:{type:String,uppercase:true},
    p_type:{type:String,required:true},
    price:{type:Number,required:true}
})

productsForSaleSchema.pre('save', function (next) {
    // capitalize
    this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
    next();
});

module.exports = mongoose.model('ProductsForSale',productsForSaleSchema);