const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

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
        const newMovie = {
          title: req.query.title,
          year: req.query.year,
          rating: rating
        }
        status = 200
        movies.push(newMovie)
        final = {
          status: status,
          data: movies
        }
      }
      res.send(final)
    }
  })

// Read All Movies Route
app.get("/movies/get", (req, res) => {
    res.send({
        status: 200, 
        data: movies 
    })
})

app.get("/movies/get/id/:id", (req, res) => {
    let status, final
    if(req.params.id >= 0 && req.params.id < movies.length) {
        status = 200;
        final = {
            status: status,
            data: movies[req.params.id]
        }
    } 
    else {
        status = 404;
        final = {
            status: status,
            error: true,
            message: `The movie ${req.params.id} doesn't exist`
        }
    }
    res.send(final);
})

// Ordering By Date 
app.get("/movies/get/by-date", (req, res) => {
    const sortedMoviesByDate = [...movies];
    sortedMoviesByDate.sort((b, a) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
    const final = {
        status: 200,
        data: sortedMoviesByDate
    }
    res.send(final);
})

// Ordering By Rating
app.get("/movies/get/by-rating", (req, res) => {
    const sortedMoviesByRating = [...movies];
    sortedMoviesByRating.sort((b, a) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0));
    const final = {
        status: 200,
        data: sortedMoviesByRating
    }
    res.send(final);
})

// Ordering By Title
app.get("/movies/get/by-title", (req, res) => {
    const sortedMoviesByTitle = [...movies];
    sortedMoviesByTitle.sort((b, a) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    const final = {
        status: 200,
        data: sortedMoviesByTitle
    }
    res.send(final);
})

// Update Route
app.put("/movies/edit/:id", verifyToken, (req, res) => {
    let id = parseInt(req.params.id);
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } 
        else {
            if(id < 0 || id >= movies.length || isNaN(id)){
                res.send({
                    status:404,
                    error: true,
                    message: "The movie id does not exist"
                })
            }
            else {
                if(req.query) {
                    let editedMovie = movies[id]
                    for (let property in req.query) {
                        if(editedMovie.hasOwnProperty(property)) {
                            if(property == "rating") {
                                editedMovie[property] = parseInt(req.query[property]);
                            }
                            else {
                                editedMovie[property] = req.query[property]
                            }
                        }
                    movies[id] = editedMovie;
                    res.send({
                        status: 200,
                        data: movies,
                        authData: authData
                    })
                    }
                }
            }
        }
    })
})

// Delete Route
app.delete("/movies/delete/:id", verifyToken, (req, res) => {
    let id = parseInt(req.params.id);
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } 
        else {
            if(id < 0 || id >= movies.length || isNaN(id)){
                res.send({
                    status: 404,
                    error: true,
                    message: "The movie id does not exist"
                })
            }
            else {
                movies.splice(req.params.id, 1)
                res.send({
                    status: 200,
                    data: movies,
                    authData: authData
                })
            }
        }
    })  
})

// Logging in the users so they can get the token
app.post("/users/login", (req, res) => {
    jwt.sign({users}, "secretkey", {expiresIn: "120s"}, (err, token) => {
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