const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    city_name:{type:String,required:true},
    state:{type:String,required:true},
    coordinates:{
        lat:{type:Number},
        lon:{type:Number}
    }
})

module.exports = mongoose.model('City',citySchema);