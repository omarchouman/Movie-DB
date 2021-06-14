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

app.listen(3000);