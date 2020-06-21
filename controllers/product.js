const Products = require('./../models/products');

exports.getProduct = async (req,res,next) => {
    return res.status(200).json({
        message:"All Products",
        responseData: await Products.find().select({product_name:1,price:1,imgUrl:1,created_at:1}).exec()
    })
}

exports.addProduct = (req,res,next) => {
    if(res.locals.loggedInUser.role != 'basic'){
        const arr = req.body;
        for(var i=0;i<req.body.length;i++){
            arr[i].userId = res.locals.loggedInUser._id
        }
        Products.create(req.body)
        .then(result => {
            res.status(201).json({
                message:"Products Added"
            })
        })
        .catch(err=>{
            res.status(422).json({
                error:err
            })
        })
    }else{
        return res.status(403).json({
            error:"Sorry..You don't have permission to add products"
        })
    }
    
    
}

exports.updateProduct = (req,res,next) => {
    if(res.locals.loggedInUser.role != 'basic'){
        Products.findByIdAndUpdate(req.body.id,{price:req.body.price,product_name:req.body.product_name},{ new: true, useFindAndModify: false })
          .then(result=>{
              return res.status(200).json({
                  message:"Product Updated",
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

exports.deleteProduct = (req,res,next) => {
    if(res.locals.loggedInUser.role == 'admin'){
        Products.findByIdAndDelete(req.body.id)
          .then(result=>{
              return res.status(200).json({
                  message:"Product Deleted",
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