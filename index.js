const express = require("express");

const app = express();

// Create The Home Route
app.get("/", (req, res) => {
    res.status(200).send("ok");
})


app.listen(3000);