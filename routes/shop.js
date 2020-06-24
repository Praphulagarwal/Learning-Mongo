const express = require('express')
const mongoose = require('mongoose');
const app = express();
const router = express.Router();

//Models
const ListProducts = require('../models/product_for_sale');
const Customer = require('../models/customers_for_products');

router.post('/add-products-to-list',(req,res,next) => {
    ListProducts
        .create(req.body)
        .then(result => {
            res.status(201).json({
                message:"Your Product Added",
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

router.post('/add-customers-to-shop',(req,res,next) => {
    Customer
        .create(req.body)
        .then(result => {
            res.status(201).json({
                message:"Your Product Added",
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

router.get('/get-products-to-list',(req,res,next) => {
    ListProducts
        //.find({$nor:[{price:{$lte:100}},{price:{$gte:250}}]})//Logical Operators
        .find({price:{$ne:100}})
        .then(result => {
            res.status(201).json({
                message:"Your Listed Products",
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

router.get('/get-all-customers',(req,res,next) => {
    Customer
        .find()
        .then(result => {
            res.status(201).json({
                message:"Your Customers",
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

router.post('/add-product-to-cart',async (req,res,next) => {
    const customer = await Customer.findOne({_id:req.body.id}).exec();
    if(customer.cart_product.includes(req.body.product_id)){
        res.status(201).json({
           error_message:"Your Product has already added in cart",
        })
    }
    customer.cart_product.push(req.body.product_id);
    customer.save()
        .then(result => {
            res.status(201).json({
                message:"Your Product added in cart",
                data:result
            })
        })
        .catch(err => {
            res.status(403).json({
                message:"Error While adding product to cart",
                Error:err
            })
        })
})

router.get('/cart-products-get',async (req,res,next) => {
    const products = await Customer.findOne({_id:req.body._id}).select('cart_product username').populate('cart_product').exec();
    console.log(products)
    if(products){
        res.status(200).json({
            message:"Your Cart Products",
            data:products
        })
    }else{
        return res.status(404).json({
            error:"Products not found"
        })
    }
})

router.post('/price-update',async (req,res,next) => {
    const products = await ListProducts.findOne({_id:req.body.id}).exec();
    console.log(products)
    products.price = req.body.price;
    products
        .save()
        .then(result => {
            res.status(200).json({
                message:"Your Cart Products",
            })
        })
        .catch(err => {
            return res.status(404).json({
                error:err
            })
        })
})


router.post('/purchase-product',async (req,res,next) => {
    if(req.body.cart){
        const customer = await Customer.findOne({_id:req.body._id}).populate('cart_product').exec();
        const val = customer.cart_product.map(e => {return e._id}).indexOf(req.body.product_id);
        customer.purchased_product.push(customer.cart_product[val]);
        customer.cart_product.splice(val,1);
        customer.save();
        res.status(201).json({
            message:"Product Found"
        })
    }
})


module.exports = router;

//To use or operator

//collection.find({$or:[{rating.average:{$lt:3.5}},{rating.average:{$gte:9.2}}]})