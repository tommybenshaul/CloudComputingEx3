const Datastore = require('nedb');
const path = require('path');
const fs = require('fs');



DISHES_DB_FILE_NAME = path.join(__dirname, 'data/dishes.db');
MEALS_DB_FILE_NAME = path.join(__dirname, 'data/meals.db');
console.log("here1")
if (fs.existsSync(DISHES_DB_FILE_NAME)) {
    console.log("here2")
    fs.unlinkSync(DISHES_DB_FILE_NAME);
}
console.log("here3")
if (fs.existsSync(MEALS_DB_FILE_NAME)) {
    console.log("here4")
    fs.unlinkSync(MEALS_DB_FILE_NAME);
}
console.log("here5")
fs.writeFileSync(DISHES_DB_FILE_NAME, '');
console.log("here6")
fs.writeFileSync(MEALS_DB_FILE_NAME, '');

const dishesDB = new Datastore({ filename: DISHES_DB_FILE_NAME, autoload: true });
const mealsDB = new Datastore({ filename:MEALS_DB_FILE_NAME , autoload: true });
dishesDB.ensureIndex({ fieldName: 'ID', unique: true }, err => {
    if (err) {
        console.error(`Error setting up dishes index: ${err}`);
    }
});

dishesDB.ensureIndex({ fieldName: 'name', unique: true }, err => {
    if (err) {
        console.error(`Error setting up dishes index: ${err}`);
    }
});
mealsDB.ensureIndex({ fieldName: 'ID', unique: true }, err => {
    if (err) {
        console.error(`Error setting up meals index: ${err}`);
    }
});

mealsDB.ensureIndex({ fieldName: 'name', unique: true }, err => {
    if (err) {
        console.error(`Error setting up meals index: ${err}`);
    }
});

const database = {

    test() {
        return true
    },

    // Insert a new user
    async insertDish(dish) {

        return new Promise((resolve, reject) => {
            dishesDB.find({},{ _id: 0 }).sort({"ID":-1}).limit(1).exec((err, results)=>{
                const lastId = results.length > 0 ? results[0].ID +1 : 1;
                dish.ID = lastId
                dishesDB.insert(dish, (err, doc) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(doc);
                    }
                });

            })
        });
    },


    async getDishById(id) {
        return new Promise((resolve, reject) => {
            dishesDB.findOne({ ID: id }, { _id: 0 },(err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    },

    async getDishByName(name) {
        return new Promise((resolve, reject) => {
            dishesDB.findOne({ name: name },{ _id: 0 }, (err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    } ,

    async getAllDishes() {
        return new Promise((resolve, reject) => {
            dishesDB.find({},{ _id: 0 }).sort({"ID":1}).exec((err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(doc);

            });
        });
    },

    async deleteById(id) {
        return new Promise(async (resolve, reject) => {
            let deletedDoc
            dishesDB.findOne({ ID:id }, (err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                deletedDoc = doc
                dishesDB.remove({ ID:id }, { multi: false ,_id:0}, async (err, num) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (num != 0)
                        await this.updateMealsAfterDeletedDish(deletedDoc.ID)

                    resolve(deletedDoc);

                });

            });
        });
    },

    async deleteByName(name) {
        return new Promise(async (resolve, reject) => {
            let deletedDoc
            dishesDB.findOne({ name }, (err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                deletedDoc = doc
                dishesDB.remove({ name }, { multi: false ,_id:0}, async (err, num) => {
                    if (err) {
                        reject(err);
                        return
                    }
                    if (num != 0)
                        await this.updateMealsAfterDeletedDish(deletedDoc.ID)

                    resolve(deletedDoc);


                });

            });
        });
    },

    async insertMeal(meal) {
        return new Promise(async (resolve, reject) => {
            try {
                const appetizer = await this.getDishById(meal.appetizer);
                const main = await this.getDishById(meal.main);
                const dessert = await this.getDishById(meal.dessert);

                if (!appetizer || !main || !dessert) {
                    reject("-6");
                    return
                }

                meal.cal = appetizer.cal + main.cal + dessert.cal;
                meal.sodium = appetizer.sodium + main.sodium + dessert.sodium;
                meal.sugar = appetizer.sugar + main.sugar + dessert.sugar;

                mealsDB.find({},{ _id: 0 }).sort({"ID":-1}).limit(1).exec((err, results)=>{
                    const lastId = results.length > 0 ? results[0].ID +1 : 1;
                    meal.ID = lastId
                    mealsDB.insert(meal,(err, doc) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(doc);
                        }
                    });

                })

            }catch (err){
                reject(err);
            }

        });
    },


    async putMeal(meal) {
        return new Promise(async (resolve, reject) => {
            try {
                const appetizer = await this.getDishById(meal.appetizer);
                const main = await this.getDishById(meal.main);
                const dessert = await this.getDishById(meal.dessert);

                if (!appetizer || !main || !dessert) {
                    reject("-6");
                    return
                }

                meal.cal = appetizer.cal + main.cal + dessert.cal;
                meal.sodium = appetizer.sodium + main.sodium + dessert.sodium;
                meal.sugar = appetizer.sugar + main.sugar + dessert.sugar;

                mealsDB.update({ ID: meal.ID }, meal, {}, (err, numReplaced) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(meal);
                    }
                });

            }catch (err){
                reject(err);
            }

        });
    },

    async getMealById(id) {
        return new Promise((resolve, reject) => {
            mealsDB.findOne({ ID: id }, { _id: 0 },(err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    },

    async getMealByName(name) {
        return new Promise((resolve, reject) => {
            mealsDB.findOne({ name: name }, { _id: 0 },(err, doc) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(doc);
                }
            });
        });
    },

    async getAllMeals() {
        return new Promise((resolve, reject) => {
            mealsDB.find({},{ _id: 0 }).sort({"ID":1}).exec((err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                resolve(doc);

            });
        });
    },

    async deleteMealById(id) {
        return new Promise((resolve, reject) => {
            let deletedDoc
            mealsDB.findOne({ ID:id }, (err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                deletedDoc = doc
                mealsDB.remove({ ID:id }, { multi: false ,_id:0}, (err, num) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(deletedDoc);
                    }
                });

            });
        });
    },

    async deleteMealByName(name) {
        return new Promise((resolve, reject) => {
            let deletedDoc
            mealsDB.findOne({ name }, (err, doc) => {
                if (err) {
                    reject(err);
                    return
                }
                deletedDoc = doc
                mealsDB.remove({ name }, { multi: false ,_id:0}, (err, num) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(deletedDoc);
                    }
                });

            });
        });
    },

    async updateMealsAfterDeletedDish(dishId) {
        await this.updateMealsAfterDeletedDishSpecificField(dishId, 'appetizer');
        await this.updateMealsAfterDeletedDishSpecificField(dishId, 'main');
        await this.updateMealsAfterDeletedDishSpecificField(dishId, 'dessert');
    },

    async updateMealsAfterDeletedDishSpecificField(dishId,filed){
        return new Promise((resolve, reject) => {
            mealsDB.update(
                { [filed] : dishId },
                { $set: { [filed]: null ,sodium: null, sugar: null, cal: null } },
                { multi: true },
                (err, num) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(num);
                    }
                }
            );
        });
    }




};

module.exports = database;