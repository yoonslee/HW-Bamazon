var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Passw0rd",
  database: "Bamazon"
});

inquirer.prompt([
  {
    type: "list",
    name: "option",
    message: "What would you like to do, Manager?",
    choices: [
      "View Products for Sale",
      "View Low Inventory",
      "Add to Inventory",
      "Add New Product"
    ]
  }
]).then(function(answers) {
  if(answers.option === "View Products for Sale") {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      console.log("Available Products:");

      for(var i = 0; i < res.length; i++) {
        if(res[i].stock_quantity > 0) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price + " | In Stock: " + res[i].stock_quantity);
        }
      }
    });
  } else if (answers.option === "View Low Inventory") {
    connection.query("SELECT * FROM products WHERE stock_quantity < ?", [5], function(err, res) {
      if (err) throw err;

      console.log("Products with Low Inventory (< 5):");

      for(var i = 0; i < res.length; i++) {
        if(res[i].stock_quantity < 5) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | $" + res[i].price + " | In Stock: " + res[i].stock_quantity);
        }
      }
    });
  }  else if (answers.option === "Add to Inventory") {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      inquirer.prompt([
        {
          type: "input",
          name: "itemId",
          message: "Enter the ID number of the item you'd like to add more of:",
          validate: function(value) {
            if(isNaN(value) === false && value > 0 && value < res.length + 1) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: "input",
          name: "quantityAdded",
          message: "How many would you like to add?",
          validate: function(value) {
            if(isNaN(value) === false && value > 0) {
              return true;
            } else {
              return false;
            }
          }
        }
      ]).then(function(answers) {
        var itemId = parseFloat(answers.itemId);
        var quantityAdded = parseFloat(answers.quantityAdded);

        connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [quantityAdded, itemId], function(err, res) {});

        console.log(res[itemId - 1].item_id + " | " + res[itemId - 1].product_name + " | $" + res[itemId - 1].price + " | In Stock: " + res[itemId - 1].stock_quantity + " (+" + quantityAdded + ") = " + (res[itemId - 1].stock_quantity + quantityAdded));
      });
    });
  }  else if (answers.option === "Add New Product") {

  }
});