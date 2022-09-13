var path = require('path');
var model = require('../models');


module.exports = function(app) {

    // app.get('/', function(req, res) {

    // 	model.burger.findAll({})
    // 	.then(function(burgers){
    // 		res.render('index', {burgers});
    // 	})
    // });



    app.post('/add', function(req, res) {

        if (req.body.burger_name) {
            model.burger.create({ burger_name: req.body.burger_name })
                .then(function() {
                    res.redirect('/');
                });
        }
    });

    app.put('/eat/:id', function(req, res) {
        model.burger.update(

            {
                devoured: req.body.devoured
            },

            {
                where: {
                    id: req.params.id
                }
            }
        ).then(function() {
            res.redirect('/');
        })
    });

    app.delete('/rid/:id', function(req, res) {
        model.burger.delete(


            {
                where: {
                    id: req.params.id
                }
            }
        ).then(function() {
            res.redirect('/');
        })
    });

};
