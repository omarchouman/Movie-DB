const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();

const Movie = require("./db");

// DB CONNECTION
mongoose.connect("mongodb+srv://moviedb:PX4s0RlMJy3fXBXd@cluster0.0ccsw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Home Route
app.get("/", (req, res) => {
    res.send("ok");
})

// Test Route
app.get("/test", (req, res) => {
    res.send({
        status:200, 
        message:"ok"
    });
})

// Time Route
app.get("/time", (req, res) => {
    const time = new Date();
    const timeFormat = `${time.getHours()}:${time.getSeconds()}`;
    const final = {
        status : 200,
        message : timeFormat
    }
    res.send(final);
})

// Hello Route
app.get("/hello", (req, res) => {
    const message = "Hello, "
    const final = {
        status: 200,
        message: message
    }
    res.send(final)
})

// Hello ID Route
app.get("/hello/:id", (req, res) => {
    const message = `Hello, ${req.params.id}`
    const final = {
        status: 200,
        message: message
    }
    res.send(final)
})

// Search Route
app.get("/search", (req, res) => {
    let status, message, data, final, error
    if(req.query.s){
        status = 200;
        message = "ok";
        data = req.query.s;
        final = {
            status: status,
            message: message,
            data: data
        }
    } else {
        status = 500;
        message = "you have to provide a search";
        error = true;
        final = {
            status: status,
            message: message,
            error: error
        }
    }
    res.send(final);
})

// Movies Database
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

// Users Database
const users = [
    {  username: "omar", email: "omar@gmail.com" },
    {  username: "sami", email: "sami@gmail.com" }
]

// Create Route
app.post('/movies/add', (req, res) => {
    if(req.query){
      let final, status, yearBoolean = false, yearString, yearInt, data, message, error, rating = 4
      if(req.query.year) {
        yearString = req.query.year
        yearInt = parseInt(req.query.year)
        if(yearString.length <= 4 && !isNaN(yearInt)) {
          yearBoolean = true
        }
      }
      if(!req.query.title || !yearBoolean) {
        status = 403
        error = true
        message = 'You cannot create a movie without providing a title and a year'
        final = {
          status: status,
          error: error,
          message: message,
        }
      }
      else {
        if(req.query.rating) rating = req.query.rating
        
        const newMovie = new Movie({
            title: req.query.title,
            year: req.query.year,
            rating: rating
        })
        newMovie.save().then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
        status = 200
        movies.push(newMovie)
        final = {
          status: status,
          data: newMovie
        }
      }
      res.send(final)
    }
  })

// Read All Movies Route
app.get("/movies/get", (req, res) => {
    Movie.find({}).sort({title: 1}).exec(function(err, moviess) {
        res.send({
        status:200,
        message: moviess
        })
    })
})

// Read A Certain Movie By Id Route
app.get("/movies/get/id/:id", (req, res) => {

    Movie.findById({_id: req.params.id}).then(function(moviess){
        res.send({
            status:200,
            data:moviess
        })
    }).catch((err) => res.send({
        status:404,
        error:true,
        error2:err,
        message: "no movie with such ID"
    }));
})

app.get("/movies/get/:sort", (req, res) => {
    if(req.params.sort == "by-date"){
        Movie.find({}).sort({year: 'desc'}).exec(function(err, moviess) {
            res.send({
                status:200,
                data: moviess
            })
         })
        
    }else if(req.params.sort == "by-rating"){
        Movie.find({}).sort({rating: 'desc'}).exec(function(err, moviess) {
            res.send({
                status:200,
                data: moviess
            })
         })
    }else if(req.params.sort == "by-title"){
        Movie.find({}).sort({title: 1}).exec(function(err, moviess) {
            res.send({
                status:200,
                data: moviess
            })
         })
    }else {
        res.send({
            status:404,
            error:true,
            message:"Invalid sorting request"
        })
    }

})

// Update Route
app.put("/movies/edit", (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        res.send({
            status:404,
            error: err,
            message:"Cannot Update without a movie ID",
        })
    })
})


// Update Route
app.put("/movies/edit/:id", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } 
        else {
            let check = {};
            let querry = req.query;
        
            function check_data(data){
                if((data).hasOwnProperty('title') || (data).hasOwnProperty('year') || (data).hasOwnProperty('rating')){
                    if((data).hasOwnProperty('title') && data.title != ""){
                        check.title = true
                    }else if(data.title == ""){
                        check.title = false
                    }else {
                        delete check.title
                    }
                    if ((data).hasOwnProperty('year') && Number.isInteger(Number(data.year)) && (data.year).length == 4){
                        check.year = true
                    }else if((data).hasOwnProperty('year') && (data.year).length != 4){
                        check.year = false
                    }
                    if((data).hasOwnProperty('rating') && data.rating < 9.99 && data.rating > 0){
                        check.rating = true
                    }else if(data.rating > 9.99 || data.rating < 0){
                        check.rating = false
                    }
                }
            }
                check_data(querry);
        
                if (Object.values(check).indexOf(false) > -1) {
                    let error = Object.keys(check).find(key => check[key] === false)
                    res.send({
                        status:404,
                        error:true,
                        message:"invalid " + error + " Input",
                    })
                }else {
                   Movie.findOneAndUpdate({_id: req.params.id}, querry).then(function(){
                    Movie.find({}).then(function(allmovies){
                        res.send({
                            status:200,
                            movies_list : allmovies
                        })
                    });
                   }).catch((err) => {res.send({
                    status:404,
                    error:true,
                    message:'wrong id'
             })});
                
            }
        }
    })
})

// Delete Error
app.delete("/movies/delete", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        res.send({
            status:404,
            error: err,
            message:"Cannot Delete without a movie ID",
        })
    })
})

// Delete Route
app.delete("/movies/delete/:id", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        Movie.findByIdAndRemove({_id: req.params.id}).then(function(){
            Movie.find({}).then(function(allmovies){
                res.send({
                    status:200,
                    movies_list : allmovies
                })
            }).catch((err) => res.send({
                     status:404,
                     error:true,
                     message:err
                 }))
        }).catch((err) => res.send({
         status:404,
         error:true,
         error2: err,
         message:"the movie with id "+ req.params.id + " does not exist"
     }))
    })  
})

// Logging in the users so they can get the token
app.post("/users/login", (req, res) => {
    jwt.sign({users}, "secretkey", {expiresIn: "1200s"}, (err, token) => {
        res.json({
            token
        });
    });
});

// Get All Users Route
app.get("/users/get", (req, res) => {
    res.send({
        users: users,
        status: 200
    })
})

// Get A Certain User Route
app.get("/users/get/:id", (req, res) => {
    status = 200;
        final = {
            status: status,
            data: users[req.params.id]
        }
    res.send(final);
})

// Create A New User Route 
app.post("/users/add", (req, res) => {
    const user = [
        {
            username: req.query.username,
            email: req.query.email
        }
    ]

    status = 200;
    users.push(user);

    final = {
        status: status,
        data: users
    }

    res.send(final);
})


// Delete A Certain User Route
app.delete("/users/delete/:id", (req, res) => {
    users.splice(req.params.id, 1);
    final = {
        status: 200,
        data: users
    }

    res.send(final);
})

// Verify Token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  }

app.listen(3000);