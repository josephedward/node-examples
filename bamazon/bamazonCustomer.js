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
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "options",
      type: "list",
      message: "Choose an option: ",
      choices: ["View Products", "Buy Product", "EXIT"]
    })
    .then(function(choice) {
      if (choice.options === "View Products") {
        viewProducts();
      } else if (choice.options === "Buy Product") {
        buyProduct();
      } else {
        connection.end();
      }
    });
}

function logListFormat(products, priceArray, quantArray) {
    console.log("*".repeat(42));
    console.log(
    "*" +
      "ID:" +
      " ".repeat(colSpacer("*" + "ID:")) +
      "*" +
      "Product:" +
      " ".repeat(colSpacer("*" + "Product:")) +
      "*" +
      "Price:" +
      " ".repeat(colSpacer("*" + "Price:")) +
      "*" +
      "Quantity:" +
      " ".repeat(colSpacer( "Quantity:")) +
      "*"
  );
  for (x in products) {
    console.log(
      "*" +
        (parseInt(x) + 1) +
        " ".repeat(colSpacer("*" + (parseInt(x) + 1).toString())) +
        "*" +
        products[x] +
        " ".repeat(colSpacer("*" + products[x])) +
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
  console.log("*".repeat(42));
}

function colSpacer(word) {
  return parseInt(10 - word.length);
}

function viewProducts() {
  // query the database for all items being sold
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    var choiceArray = [];
    var priceArray = [];
    var quantArray = [];
    for (var i = 0; i < results.length; i++) {
      choiceArray.push(results[i].product_name);
      priceArray.push(parseFloat(results[i].price));
      quantArray.push(results[i].stock_quantity);
    }
    logListFormat(choiceArray, priceArray, quantArray);
    //ask if they want to buy a product
    buyChoice();
   
  });
}

function buyChoice(){

    inquirer
    .prompt([
      {
        name: "choice",
        type: "list",
        message: "Would you like to buy an item?",
        choices: ["yes", "no"]
      }
    ])
    .then(function(choice) {
      if (choice.choice === "yes") {
        buyProduct();
      } else {
        connection.end();
      }
    });
}



function buyProduct() {
  // query the database for all items being sold
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
          message: "What product would you like to buy?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many units of the product would you like to buy?"
        }
      ])
      .then(function(order) {
        // console.log(order.choice);
      
        //need to check quantity first
        var totalQ;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === order.choice) {
            totalQ = results[i].stock_quantity;
            pID=results[i].id;
            pPrice=parseFloat(results[i].price);
          }
        }
        // console.log(order.quantity);
        // console.log(totalQ);

        if (totalQ < order.quantity) {
          console.log(
            "There is insufficient quantity in stock. Please place another order."
          );
        start();
        }
        else{
            var newQuant=totalQ-order.quantity;
            var totalCost=parseFloat(order.quantity*pPrice);
            totalCost=totalCost.toFixed(2);
            console.log(`Your order's total cost: ${totalCost}`);
            updateProduct(pID, newQuant);
        }
      });
  });
}

function updateProduct(idNum,quant)
{
    connection.query(`UPDATE products SET stock_quantity=${quant} WHERE id=${idNum}`, 
    function(err, results) {
        if (err) throw err;
    });    
    
start();
    
}



//*********************************************************************** */






    // var query = connection.query(
    //     "UPDATE products SET ? WHERE ?",
    //     [
    //       {
    //         quantity: 100
    //       },
    //       {
    //         flavor: "Rocky Road"
    //       }
    //     ],
    //     function(err, res) {
    //       console.log(res.affectedRows + " products updated!\n");
    //       // Call deleteProduct AFTER the UPDATE completes
    //       deleteProduct();
    //     }    // var query = connection.query(
    //     "UPDATE products SET  WHERE ?",
    // [
    //     {
    //         stock_quantity:stock_quantity-quant
    //     },
    //     {
    //         id=idNum
    //     }
    // ],
    // function(err, res) 
    // {
    // if (err) throw err;  
    // console.log(res.affectedRows + " products updated!\n");      
    // }
    // );
    // console.log(query);













//     // determine if bid was high enough
    //     if (chosenItem.highest_bid < parseInt(answer.bid)) {
    //       // bid was high enough, so update db, let the user know, and start over
    //       connection.query(
    //         "UPDATE auctions SET ? WHERE ?",
    //         [
    //           {
    //             highest_bid: answer.bid
    //           },
    //           {
    //             id: chosenItem.id
    //           }
    //         ],
    //         function(error) {
    //           if (error) throw err;
    //           console.log("Bid placed successfully!");
    //           start();
    //         }
    //       );
    //     }
    //     else {
    //       // bid wasn't high enough, so apologize and start over
    //       console.log("Your bid was too low. Try again...");
    //       start();
    //     }
    //   });

    // inquirer
    // .prompt(
    //     {
    //         name: "productID",
    //         type: "number",
    //         message: "What is the ID of the product you would like to buy?"
    //     },
    //     {
    //           name: "quantity",
    //           type: "number",
    //           message: "How many units of the product would you like to buy?"
    //     }
    //     ).then(function(order) {

    //      // based on their answer, either call the bid or the post functions
    //     //   if (answer.postOrBid === "POST") {
    //     //     postAuction();
    //     //   }
    //     //   else if(answer.postOrBid === "BID") {
    //     //     bidAuction();
    //     //   } else{
    //     //     connection.end();
    //     //   }
    //     });