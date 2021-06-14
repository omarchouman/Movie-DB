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

app.listen(3000);