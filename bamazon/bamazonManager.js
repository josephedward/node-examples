var mysql = require("mysql");
var inquirer = require("inquirer");


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    menu();
  });


  function buyChoice(){

    inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "Would you like another transaction?",
        choices: ["yes", "no"]
      }
    ])
    .then(function(choice) {
      if (choice.choice === "yes") {
        menu();
      } else {
        connection.end();
      }
    });
}


  function menu() {
    inquirer
      .prompt({
        name: "options",
        type: "list",
        message: "Choose an option: ",
        choices: 
        ["View Products", "View Low Inventory",
        "Add to Inventory", "Add New Product",
        "EXIT"]
      })
      .then(function(choice) {
        switch(choice.options){
            case "View Products"://already have this
                viewProducts();
                break;
            case "View Low Inventory"://COUNT 
                viewLowInv();
                break;
            case "Add to Inventory": //update
                addInv();
                break;
            case "Add New Product": //regular insert?  
                addNew();
                break;
            default:
                connection.end();
                break;

        }



      });
  }
  

  function logListFormat(products,deptArray, priceArray, quantArray) {
    // console.log();
    console.log('\n');
    console.log("*".repeat(process.stdout.columns));
    // console.log();

    console.log(" ".repeat(Math.round(process.stdout.columns*.25))+
    "*" +
      "ID:" +
      " ".repeat(colSpacer("*" + "ID:")) +
      "*" +
      "Product:" +
      " ".repeat(colSpacer("*" + "Product:")) +
      "*" +
      "Department:" +
      " ".repeat(colSpacer("*" + "Department:")) +
      "*" +
      "Price:" +
      " ".repeat(colSpacer("*" + "Price:")) +
      "*" +
      "Quantity:" +
      " ".repeat(colSpacer( "Quantity:")) +
      "*"
  );
  console.log("*".repeat(process.stdout.columns));
    
  for (x in products) {
    console.log(
        " ".repeat(Math.round(process.stdout.columns*.25))
      +"*" +
        (parseInt(x) + 1) +
        " ".repeat(colSpacer("*" + (parseInt(x) + 1).toString())) +
        "*" +
        products[x] +
        " ".repeat(colSpacer("*" + products[x])) +
        "*" +
        deptArray[x] +
        " ".repeat(colSpacer("*" + deptArray[x])) +
        "*" +
        "$" +
        priceArray[x] +
        " ".repeat(colSpacer("*$" + parseFloat(priceArray[x]).toString())) +
        "*" +
        quantArray[x] +
        " ".repeat(colSpacer(quantArray[x].toString())) +
        "*"
    );
  }
  console.log("*".repeat(process.stdout.columns));
}

function colSpacer(word) {
  return parseInt(20 - word.length);
}

function viewProducts() {
  // query the database for all items being sold
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    var choiceArray = [];
    var deptArray = [];
    var priceArray = [];
    var quantArray = [];
    for (var i = 0; i < results.length; i++) {
      choiceArray.push(results[i].product_name);
      deptArray.push(results[i].department);
      priceArray.push(parseFloat(results[i].price));
      quantArray.push(results[i].stock_quantity);
    }
    logListFormat(choiceArray,deptArray, priceArray, quantArray);
    //ask if they want to buy a product
    buyChoice();
  });


}



function viewLowInv(){
        var query = "SELECT * FROM bamazon_DB.products where stock_quantity<5";
        connection.query(query, function(err, res) {
            if (err) throw err;
            var choiceArray = [];
            var deptArray = [];
            var priceArray = [];
            var quantArray = [];
            
            // console.log("Product: "+"  Price:  "+"  Quantity:  ");
            for (var i = 0; i < res.length; i++) {
            // console.log(res[i].product_name+res[i].price+res[i].stock_quantity);
            choiceArray.push(res[i].product_name);
            deptArray.push(res[i].department);
            priceArray.push(parseFloat(res[i].price));
            quantArray.push(res[i].stock_quantity);
        }
        logListFormat(choiceArray,deptArray,priceArray,quantArray);
            // res[i].product_name,res[i].price,res[i].stock_quantity);  
        buyChoice();
        });

}


function addInv(){

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
    
        inquirer
          .prompt([
            {
              name: "choice",
              type: "rawlist",
              choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                  choiceArray.push(results[i].product_name);
                }
                return choiceArray;
              },
              message: "What product would you add inventory for?"
            },
            {
              name: "quantity",
              type: "input",
              message: "How many units of the product would you like to add?"
            }
          ])
          .then(function(order) {
            var totalQ;
            for (var i = 0; i < results.length; i++) {
              if (results[i].product_name === order.choice) {
                totalQ = parseInt(results[i].stock_quantity);
                pID=results[i].id;
                pPrice=parseFloat(results[i].price);
              }
            }
            var newQuant=parseInt(totalQ)+parseInt(order.quantity);
            var totalCost=(parseFloat(order.quantity*pPrice)*.85);
            totalCost=totalCost.toFixed(2);
            console.log(`Your order's total cost (15% distributor discount): ${totalCost}`);
            updateProduct(pID, newQuant);
            buyChoice();
          });
});

}

function updateProduct(idNum,quant)
{
    connection.query(`UPDATE products SET stock_quantity=${quant} WHERE id=${idNum}`, 
    function(err, results) {
        if (err) throw err;
    });    
       
}

function addNew(){

 
    inquirer
    .prompt([
        {
            name: "name",
            type: "input",
            message: "Name of the product you would like to add?"
        },
        {
            name: "department",
            type: "input",
            message: "Department this product resides in?"
        },
        {
            name: "price",
            type: "number",
            message: "What will the price of the item be?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units of the product would you like to add?"
        }

        ])
        .then(function(order) {
        var name=order.name;
        var dept=order.department;
        var price=order.price;
        var quant=order.quantity;

        connection.query(`INSERT INTO products (product_name, department, price, stock_quantity)
        VALUES ("${name}","${dept}", ${price}, ${quant});`, 
        function(err, results) {
            if (err) throw err;
            console.log("Product added successfully.");
            viewProducts();
            // buyChoice();
        });    





        });
}
