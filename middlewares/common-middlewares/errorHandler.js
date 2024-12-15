/*
Importing Dependencies
*/
const createError = require('http-errors');


/*
404 Not Found Handler
*/
function notFoundHandler(req, res, next){
    next(createError(404,'Your Requested Content was Not Found'));
}



/*
Default Error Handler
*/
function errorHandler(err, req, res, next){
    res.locals.error = {message:err.message};   //Sending error message as object
    res.status(err.status || 500);  //if res.status contains any value then it will be set,otherwise,default error value is set to '500'

    /*
    res.locals.html = true/false decides if we want to send http response or json response.
    We should initialize this variable in every route with the help of a middleware with a boolean value.
    */
    if(!res.locals.html){
        //Send html response
        res.render('error',{
            title:'Error Page',
            error:err
        });
    }
    else{
        //JSON response
        res.json(res.locals.error);
    }
}



/*
Exporting
*/
module.exports = {
    notFoundHandler,
    errorHandler
}