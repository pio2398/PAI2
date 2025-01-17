'use strict';

const express = require('express');
const router = express.Router();
const productDao = require("../dao/productDao");

const{onClientError, onServerError} = require("../handlers/errorHandler");
const{verifyAuthAdmin} = require("../services/authService");

router.use(express.json());

router.get("/", (req, res) => {
    const category_id = Number.parseInt(req.query.category_id);
    if(Number.isInteger(category_id)){
        
        const exlude_subcategories = req.query.exclude_subcategories=="true";
        productDao.allProductsByCategory(category_id, exlude_subcategories, req.query).then(op=>{
            if(op.success){
                res.status(200).json(op.products);
            }
            else{
                onClientError(res, op.status_code, op.message);
            }
        }).catch(err => onServerError(res, err));
    }

    else{
        productDao.allProducts().then(products=>{
            res.status(200).json(products);
    
        }).catch(err => onServerError(res, err));
    }
});

router.get('/:id(\\d+)', (req, res) => {
    const pk = Number.parseInt(req.params.id);
    productDao.getProduct(pk).then(op=>{
        if(op.success){
            res.status(200).json(op.product);
        }
        else{
            onClientError(res, op.status_code, op.message);
        }
    }).catch(err => onServerError(res, err));
});


router.post("/", verifyAuthAdmin, (req, res) => {
    productDao.postProduct(req.body).then(op=>{
        if(op.success){
            res.status(201).json(op.product);
        }
        else{
            onClientError(res, op.status_code, op.message);
        }
    }).catch(err => onServerError(res, err));
});

router.put('/:id(\\d+)', verifyAuthAdmin, (req, res) => {
    const pk = Number.parseInt(req.params.id);
    productDao.putProduct(pk, req.body).then(op=>{
        if(op.success){
            res.status(200).json(op.product);
        }
        else{
            onClientError(res, op.status_code, op.message);
        }
    }).catch(err => onServerError(res, err));
});

router.delete('/:id(\\d+)', verifyAuthAdmin, (req, res) => {
    const pk = Number.parseInt(req.params.id);
    productDao.deleteProduct(pk).then(op=>{
        if(op.success){
            res.sendStatus(204);
        }
        else{
            onClientError(res, op.status_code, op.message);
        }
    }).catch(err => onServerError(res, err));
});

module.exports = router;