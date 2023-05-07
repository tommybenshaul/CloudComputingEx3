const express = require('express');
const apiNinjaHandler = require("./../../../externalApi/apininja/apiNinjaHandler.js")
const database = require('../../../database/neDBhandler');
const _ = require('lodash');
const validateSchemas = require('../../middlewares/validateSchemas');
const schemas = require('./schemasValidation');



// const controller = require('./controller/index');
// const validateSchemas = require('../../middlewares/validateSchemas');
// const schemas = require('./utils/schemasValidation');

const router = express.Router();

// router.post(
//     '/api/v1/signup',
//     // validateSchemas.inputs(schemas.signUp, 'body'),
//     (req, res) => {
//         controller.signUp(res, req.body);
//     }
// );

router.post('',  validateSchemas.inputs(schemas.addMeal, 'body'),async (req, res) => {
    try {
        let doc = await database.insertMeal(req.body)
        const { name} = req.body;
        res.status(201).send(doc.ID.toString())
    }catch (err){
        if (err == "-6"){
            res.status(422).send("-6")
            return
        }
        res.status(422).send("-2")
    }


})

router.put('/:id([0-9]+)',  validateSchemas.inputs(schemas.addMeal, 'body'),async (req, res) => {
    try {
        let id = req.params.id
        let doc = await database.putMeal(req.body)
        res.status(200).send(doc.ID.toString())
    }catch (err){
        if (err == "-6"){
            res.status(422).send("-6")
            return
        }
        res.status(422).send("-2")
    }


})

router.get('/:name([a-zA-Z]+)',async (req, res) => {
    let doc = await database.getMealByName(req.params.name)
    if (doc == null){
        res.status(404).send("-5")
        return
    }
    res.json(doc)
})

router.get('/:id([0-9]+)',async (req, res) => {
    const id = parseInt(req.params.id);
    let doc = await database.getMealById(id)
    if (doc == null){
        res.status(404).send("-5")
        return
    }
    res.json(doc)
})

router.get('',async (req, res) => {
    let doc = await database.getAllMeals(req.params.name)
    const result = _.keyBy(doc, 'ID');
    res.json(result)
})
router.delete('/:name([a-zA-Z]+)',async (req, res) => {
    let doc = await database.deleteMealByName(req.params.name)
    if (doc == undefined || _.isEmpty(doc)) {
        res.status(404).send("-5")
        return
    }
    res.json(doc.ID)
})

router.delete('/:id([0-9]+)',async (req, res) => {
    const id = parseInt(req.params.id);
    let doc = await database.deleteMealById(id)
    if (doc == undefined || _.isEmpty(doc)) {
        res.status(404).send("-5")
        return
    }
    res.json(doc.ID)
})

router.delete('',async (req, res) => {
    res.status(405).send("-5")
})

module.exports = router;