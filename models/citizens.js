const mongoose = require('mongoose');

const citizenSchema = mongoose.Schema({
    citizen_name:{type:String,required:true},
    cityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'City'
    },
})

module.exports = mongoose.model('Citizen',citizenSchema);