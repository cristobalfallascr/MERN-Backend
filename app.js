const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");

const app = express();



app.use('/api/places', placesRoutes); // initial path is specified as /api/places

//error handling middleware function, should be after the routes
//to trigger the error handling, need to call either
// throw error - for sync environments
//return next(error) - for async environments
app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An unknown error occurred!"});
});

app.listen(5000, () => {
  console.log("App listening on port 5000");
});
