const request = require("supertest");
const { expect } = require("chai");
const app = require("./../src/server/app");




function createMeal(done,name,appetizer,main,dessert,expectId,expectedStatus = 201) {
    request(app)
        .post("/meals")
        .send({
            name: name,
            appetizer: appetizer,
            main: main,
            dessert: dessert
        })
        .expect(expectedStatus)
        .end((err, res) => {
            if (err) return done(err);
            let newDishId = res.text;
            expect(newDishId).to.equal(expectId);
            done();
        });
}

function putMeal(done,mealid,name,appetizer,main,dessert,expectId,expectedStatus = 200) {
    request(app)
        .put("/meals/" + mealid)
        .send({
            name: name,
            appetizer: appetizer,
            main: main,
            dessert: dessert
        })
        .expect(expectedStatus)
        .end((err, res) => {
            if (err) return done(err);
            let newDishId = res.text;
            expect(newDishId).to.equal(expectId);
            done();
        });
}
describe("Dishes API", () => {

    function createDish(done,dishName,expectId,expectedStatus = 201) {
        request(app)
            .post("/dishes")
            .timeout(5000)
            .send({name: dishName})
            .expect(expectedStatus)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(newDishId).to.equal(expectId);
                done();
            });
    }

    const firstAddDish = {
        ID:1,
        name:"Spaghetti"
    }

    const secoundAddDish = {
        ID:2,
        name:"pig"
    }

    function testGetAllDishes(done) {
        request(app)
            .get("/dishes")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(Object.keys(res.body)).to.have.lengthOf.at.least(1);
                Object.keys(res.body).forEach((key) => {
                    expect(Number.isInteger(Number(key))).to.be.true;
                    expect(res.body[key]).to.have.property("ID", Number(key));
                });
                done();
            });
    }

    function testGetAllMeals(done,expectedobj) {
        request(app)
            .get("/meals")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(Object.keys(res.body)).to.have.lengthOf.at.least(expectedobj);
                Object.keys(res.body).forEach((key) => {
                    expect(Number.isInteger(Number(key))).to.be.true;
                    expect(res.body[key]).to.have.property("ID", Number(key));
                });
                done();
            });
    }

    function deleteTest(done,dishNameOrId,expectedReturn,expectCode){
        request(app)
            .delete(`/dishes/${dishNameOrId}`)
            .expect(expectCode)
            .end((err, res) => {
                expect(res.text).to.equal(expectedReturn);
                if (err) return done(err);
                done();
            });
    }



    it("get non exsisting Dish by id ", (done) => {
        request(app)
            .get(`/dishes/2`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-5");
                done();
            });
    });

    it("get non exsisting Dish by name ", (done) => {
        request(app)
            .get(`/dishes/adasa`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-5");
                done();
            });
    });


    it("should add a new dish", (done) => {
        createDish(done, firstAddDish.name ,firstAddDish.ID.toString());
    });

    it("should add a secound dish", (done) => {
        createDish(done,secoundAddDish.name ,secoundAddDish.ID.toString());
    });

    it("should add a secound dish again", (done) => {
        createDish(done,secoundAddDish.name ,"-2",422);
    });

    it("should add a non exsisting dish dish again", (done) => {
        createDish(done,"sadasfasfas" ,"-3",422);
    });


    it("should add a 3 dish", (done) => {
        createDish(done,"Spaghetti Carbonara" ,"3");
    });

    it("should get all dishes", (done) => {
        testGetAllDishes(done)
    });

    it("should get a specific dish by ID", (done) => {
        request(app)
            .get(`/dishes/2`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.ID).to.equal(secoundAddDish.ID);
                expect(res.body.name).to.equal(secoundAddDish.name);
                done();
            });
    });


    it("delete non exsisting id", (done) => {
        deleteTest(done,"200","-5",404)
    });

    it("delete non exsisting name", (done) => {
        deleteTest(done,"blabla","-5",404)
    });

    it("delete second dish", (done) => {
        deleteTest(done,secoundAddDish.name,secoundAddDish.ID.toString(),200)
    });

    it("delete first dish", (done) => {
        deleteTest(done,firstAddDish.name,firstAddDish.ID.toString(),200)
    });


    it("should get all dishes", (done) => {
        testGetAllDishes(done)
    });

    it("create dish 1   ", (done) => {
        createDish(done, "salad","4");
    });
    it("create dish 2  ", (done) => {
        createDish(done, "pizza" ,"5");
    });
    it("create dish 2   ", (done) => {
        createDish(done, "apple" ,"6");
    });


    it("adding a meal with dishs", (done) => {
        createMeal(done,"special",4,5,6,"1",201);
    });

    it("adding a meal with the same name", (done) => {
        createMeal(done,"special",4,5,6,"-2",422);
    });

    it("adding a meal with a diffrent name", (done) => {
        createMeal(done,"specialOne",4,5,6,"2",201);
    });

    it("test total number of meals ", (done) => {
        testGetAllMeals(done,2)
    });


    it("get a meal by id 1  ", (done) => {
        request(app)
            .get(`/meals/1`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.ID).to.equal(1);
                expect(res.body.name).to.equal("special");
                done();
            });
    });

    it("get a meal by id 2  ", (done) => {
        request(app)
            .get(`/meals/2`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.ID).to.equal(2);
                expect(res.body.name).to.equal("specialOne");
                done();
            });
    });

    it("get a meal by name  1", (done) => {
        request(app)
            .get(`/meals/specialOne`)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.ID).to.equal(2);
                expect(res.body.name).to.equal("specialOne");
                done();
            });
    });

    // it("adding a meal with a diffrent name", (done) => {
    //     createMeal(done,"specialOne",4,5,6,"2",201);
    // });

    it("put a meal with a diffrent name", (done) => {
        putMeal(done,"2","specialOnePut",6,4,5,"2",200)
    });


    it("put a meal with a diffrent name", (done) => {
        request(app)
            .get("/meals/2")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(res.body.ID).to.equal(2);
                expect(res.body.appetizer).to.equal(6);
                expect(res.body.main).to.equal(4)
                expect(res.body.dessert).to.equal(5);
                expect(res.body.name).to.equal("specialOnePutd");

                done();
            });
    });




});

describe("sending wrong params", () => {
    it("should return 415 for non-JSON content types on POST requests", (done) => {
        request(app)
            .post("/dishes")
            .set("Content-Type", "text/plain")
            .send("this is not JSON")
            .expect(415)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("0");
                done();
            });
    });

    it("should return -1 and 422 status code for invalid dish", (done) => {
        request(app)
            .post("/dishes")
            .send({name: ""})
            .set("Content-Type", "application/json")
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-1");
                done();
            });
    });


    it("delete main route", (done) => {
        request(app)
            .delete(`/dishes`)
            .expect(405)
            .end((err, res) => {
                expect(res.text).to.equal("-5");
                if (err) return done(err);
                done();
            });
    });

    it("delete no val", (done) => {
        request(app)
            .delete(`/dishes/`)
            .expect(405)
            .end((err, res) => {
                expect(res.text).to.equal("-5");
                if (err) return done(err);
                done();
            });
    });


    // tests for error handling and validation
});

describe("sending wrong params meals", () => {


    it("should return 415 for non-JSON content types on POST requests meal", (done) => {
        request(app)
            .post("/meals")
            .set("Content-Type", "text/plain")
            .send("this is not JSON")
            .expect(415)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("0");
                done();
            });
    });

    it("should return -1 and 422 status code for invalid meal", (done) => {
        request(app)
            .post("/meals")
            .send({name: ""})
            .set("Content-Type", "application/json")
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-1");
                done();
            });
    });

    it("meal missing params", (done) => {
        request(app)
            .post("/meals")
            .send({name: "bla"})
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(res.text).to.equal("-1");
                done();
            });
    });

    it("meal missing params", (done) => {
        request(app)
            .post("/meals")
            .send({
                appetizer: 3,
                main: 16,
                dessert: 15
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(res.text).to.equal("-1");
                done();
            });
    });

    it("meal missing params", (done) => {
        request(app)
            .post("/meals")
            .send({
                name: "chicken special",
                main: 16,
                dessert: 15
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(res.text).to.equal("-1");
                done();
            });
    });

    it("meal missing params", (done) => {
        request(app)
            .post("/meals")
            .send({
                name: "chicken special",
                appetizer: 3,
                dessert: 15
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(res.text).to.equal("-1");
                done();
            });
    });

    it("meal missing params", (done) => {
        request(app)
            .post("/meals")
            .send({
                name: "chicken special",
                appetizer: 3,
                main: 16
            })
            .expect(422)
            .end((err, res) => {
                if (err) return done(err);
                let newDishId = res.text;
                expect(res.text).to.equal("-1");
                done();
            });
    });


    // tests for error handling and validation
});

describe("Meals API", () => {

    function testGetAllDishes(done) {
        request(app)
            .get("/dishes")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("object");
                expect(Object.keys(res.body)).to.have.lengthOf.at.least(1);
                Object.keys(res.body).forEach((key) => {
                    expect(Number.isInteger(Number(key))).to.be.true;
                    expect(res.body[key]).to.have.property("ID", Number(key));
                });
                done();
            });
    }




    it("adding a meal witout a dish", (done) => {
        createMeal(done,"chicken special",1,2,3,"-6",422);
    });

    it("adding a meal witout a dish", (done) => {
        createMeal(done,"chicken special",1,2,3,"-6",422);
    });

    it("get non exsisting meal by id ", (done) => {
        request(app)
            .get(`/meals/100`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-5");
                done();
            });
    });

    it("get non exsisting meal by name ", (done) => {
        request(app)
            .get(`/meals/adasa`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-5");
                done();
            });
    });

    it("delete non exsisting meal by name ", (done) => {
        request(app)
            .delete(`/meals/adasahgfh`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-5");
                done();
            });
    });

    it("delete non exsisting meal by id ", (done) => {
        request(app)
            .delete(`/meals/1000`)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("-5");
                done();
            });
    });


});
