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
        .find()
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
    const customer = await Customer.findOne({_id:req.body.id}).populate('cart_product').exec();
    if(customer){
        res.status(200).json({
            message:"Your Cart Products",
            data:customer
        })
    }else{
        return res.status(404).json({
            error:"customer not found"
        })
    }
})

router.get('/cart-products-get',async (req,res,next) => {
    const customer = await Customer.findOne({_id:req.body.id}).populate('cart_product').exec();
    if(customer){
        res.status(200).json({
            message:"Your Cart Products",
            data:customer
        })
    }else{
        return res.status(404).json({
            error:"customer not found"
        })
    }
})



module.exports = router;