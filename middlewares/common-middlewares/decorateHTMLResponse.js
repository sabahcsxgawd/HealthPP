function decorateHTMLResponse(pageTitle){
    return function(req, res, next){
        res.locals.html = true;
        res.locals.title = pageTitle;
        next();
    }
}

module.exports = decorateHTMLResponse;