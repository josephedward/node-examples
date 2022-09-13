var express = require("express");
var exphbs = require("express-handlebars");
var PORT = process.env.PORT || 8080;
var app = express();
var db = require("./models");
// var path=require('path');

// app.use(express.static(path.join(__dirname,"public")));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
// var routes = require("./controllers/burgersController.js");
// app.use(routes);
require("./routing/api-routes.js")(app);
require("./routing/html-routes.js")(app);


db.sequelize.sync({force:true}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on http://localhost:" + PORT);
  });
});