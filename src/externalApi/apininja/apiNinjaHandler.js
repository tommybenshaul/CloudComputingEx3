const axios = require('axios');
const config = require('./../../config');
const Joi = require("joi");
const _ = require('lodash');

async function getNinjaDishes(dishesName){
    const ninjaURL ="https://api.api-ninjas.com/v1/nutrition"
    try{
        const headers = {"X-Api-Key":config.NINJA_API_KEY}
        const res = await axios.get(ninjaURL,{ params: { query: dishesName },headers:headers})
        let validation = validateNinjaData(res.data)
        if ( validation != 0) return validation
        let parsetData = parseData (res.data["0"])
        return parsetData
    }catch (err){
        console.log(err)
    }
    return null
}
function  validateNinjaData(data){

    if (data == null) return -1
    if (!_.has(data,["0"])) return -1
    let dishObj = data["0"]
    if (!_.every(['name', 'calories','sugar_g','sodium_mg','serving_size_g'], key => _.has(dishObj, key))) {
        return -1
    }

    return 0
}
function parseData(data){
    let x = data["serving_size_g"]
    return  {cal:data.calories,sodium:data.sodium_mg,sugar:data.sugar_g,size:x}
}

module.exports = {
    getNinjaDishes2 :getNinjaDishes
}