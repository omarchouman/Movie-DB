const express = require("express");

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

// Create Route
app.get("/add", (req, res) => {

})

// Read Route
app.get("/get", (req, res) => {
    res.send({
        status: 200, 
        data: movies 
    })
})

// Ordering By Date 
app.get("/get/movies/by-date", (req, res) => {
    const sortedMoviesByDate = [...movies];
    sortedMoviesByDate.sort((b, a) => (a.year > b.year) ? 1 : ((b.year > a.year) ? -1 : 0));
    const final = {
        status: 200,
        data: sortedMoviesByDate
    }
    res.send(final);
})

// Ordering By Rating
app.get("/get/movies/by-rating", (req, res) => {
    const sortedMoviesByRating = [...movies];
    sortedMoviesByRating.sort((b, a) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0));
    const final = {
        status: 200,
        data: sortedMoviesByRating
    }
    res.send(final);
})

// Ordering By Title
app.get("/get/movies/by-title", (req, res) => {
    const sortedMoviesByTitle = [...movies];
    sortedMoviesByTitle.sort((b, a) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    const final = {
        status: 200,
        data: sortedMoviesByTitle
    }
    res.send(final);
})

// Update Route
app.get("/edit", (req, res) => {

})

// Delete Route
app.get("/delete", (req, res) => {

})

app.listen(3000);