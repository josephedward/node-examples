// var path = require('path');
var model = require('../models');


module.exports = function(app) {

    app.get('/', function(request, response) {

    	model.burger.findAll({})
    	.then(function(burgers){
    		response.render('index', {burgers});
    	})
    });
}
