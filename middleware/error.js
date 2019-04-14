module.exports = function(err, req, res, next){
    res.status(500).send('Something Failed. Please try again later.');
}