// 03.21.2016

/*jslint white: true */

//////////////////////////////////////// Bubble Tea Ordering System ////////////////////////////////////////
// Bubble Tea Price Charts
var teaOptions = [["Black", "Green", "Red"], [2.50, 3.00, 3.50]];
var toppingOptions = [["Grass Jelly", "Cocount", "Pearls", "Mango Stars"], [0.50, 0.75, 0.50, 1.00]];
var milkOptions = [["yes", "no"], [1.00, 0.00]];

var toppingsOutput;

// Drink Order
var toppingList = [];
var drinks = [];

// Drinks List
var tableOrder;

// Variables for drawing the drink order
var teaCanvas;
var context;
var canvasWidth;
var canvasHeight;


//////////////////////////////////////// Bubble Tea Ordering Canvas ////////////////////////////////////////
// Erases the canvas 
function resetCanvas(){
    "use strict";
    
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

// Retrieves the index of the array of the current selected option in the drop down list
function getOptionIndex(elemId, values){
    "use strict";
    
    var selected = document.getElementById(elemId);
    var type = selected.options[selected.selectedIndex].value;
    
    return values.indexOf(type);
}

// Draw the toppings in the bubble tea drink on the canvas
function drawToppings(colours, size){
    "use strict";
    
    var toppingStartPosY = [180, 160, 140, 120];
    var toppingStartPosX;
    var toppingLength = 5;
    var toppingIndex;
    var i, j;
    
    // Draw each topping with their respective colour
    for(i = 0; i < toppingList.length; i += 1){
        toppingStartPosX = 10;
        
        // Get the topping colour for a specific topping
        toppingIndex = toppingOptions[0].indexOf(toppingList[i]);
        
        context.save();
            // Set topping colour
            context.fillStyle = colours[toppingIndex];
        
            // Draw the topping
            for(j = 0; j < toppingLength; j += 1){
                context.fillRect(toppingStartPosX, toppingStartPosY[i], size, size);
                toppingStartPosX += 20;   
            }
        context.restore();
    }
}

// Called when the teaType changes or the milk option changes 
// or a topping is added/removed from the topping list
// Draws the bubble tea order to the canvas
// What is drawn is based on the user selections
function drawOrder(){
    "use strict";
    
    // drinkColours[0] are the tea colours
    // drinkColours[1] are the topping colours
    // drinkColours[2] is the transparency added when milk is added to the drink
    var drinkColours = [teaOptions[0], ["black", "white", "purple", "yellow"], [0.5, 1.0]];
    var toppingSize = 10;
    
    // Erase the canvas
    resetCanvas();
    
    context.save();
    
        context.translate((canvasWidth / 2) - toppingSize, 0);
        context.beginPath();

        // Get tea colour
        var teaIndex = getOptionIndex("tea", teaOptions[0]);
        context.fillStyle = drinkColours[0][teaIndex];

        //Get milk choice
        var milkIndex = getOptionIndex("milk", milkOptions[0]);
        
        // Add or remove transparency to simulate milk
        context.globalAlpha = drinkColours[2][milkIndex];
        context.fillRect(0, 0, (canvasWidth / 2) + toppingSize, canvasHeight);
    
        // Add toppings to canvas
        drawToppings(drinkColours[1], toppingSize);
        
    context.restore();
}

//////////////////////////////////////// Bubble Tea Drink Option Functions ////////////////////////////////////////
// Returns a string of items of from the list array
// using a start and end tag
// useful for building a ul or ol list or a table row
function buildList(list, startTag, endTag){
    "use strict";
    
    var output = "";
    var i;
    
    // Create the topping list
    for( i = 0; i < list.length; i += 1){
            output += startTag + list[i] + endTag;
    }
    
    return output;
}

// Called when the Add Toppings button is pressed
// Adds the selected topping to the topping list on the web page and the array toppingList
function addTopping(){
    "use strict";
    
    var selected = document.getElementById("toppings");
    var type = selected.options[selected.selectedIndex].value;
    
    // Adds the topping if it has not already been selected
    // Outputs the list of chosen toppings to the webpage
    if(toppingList.indexOf(type) === -1){
        toppingList.push(type);
        toppingsOutput.innerHTML = buildList(toppingList, "<li>", "</li>");
    }
    else{
        console.warn("Warning: Topping already added!");
    }
    
    drawOrder();
}

// Removes from the list the last topping that was added to the list
function removeTopping(){
    "use strict";
    
    // Only removes toppings from a list that is not empty
    // Outputs the remaining list of chosen toppings to the webpage
    if(toppingList.length > 0){
        toppingList.pop();
        toppingsOutput.innerHTML = buildList(toppingList, "<li>", "</li>");
    }
    else{
        console.warn("Warning: Cannot remove topping from empty list!");
    }
    
    drawOrder();
}

//////////////////////////////////////// Bubble Tea Drink Functions ////////////////////////////////////////
// Drink constructor
// teaType is a string
// toppingsList is an array of strings
// milkOption is a string
function Drink(teaType, toppingsList, milkOption){
    "use strict";
    
    this.teaType = teaType;
    this.toppingsList = toppingsList.slice();
    this.milkOption = milkOption;
}

// Adds up the final total of the toppings selected
function getToppingsTotal(toppings){
    "use strict";
    
    var toppingTotal = 0;
    var i;
    
    for(i = 0; i < toppings.length; i += 1){
        var index = toppingOptions[0].indexOf(toppings[i]);
        toppingTotal += toppingOptions[1][index];
    }
    
    return toppingTotal;
}

// Calculates the total cost of a single drink order
function calculateCost(drink){
    "use strict";
    var cost = 0;
    
    var teaIndex = teaOptions[0].indexOf(drink.teaType);
    var milkIndex = milkOptions[0].indexOf(drink.milkOption);
    
    // Gets the price of the type of tea chosen
    cost += teaOptions[1][teaIndex];
    
    // calculate topping cost
    cost += getToppingsTotal(drink.toppingsList);
    
    // Gets the price of whether milk was added or not
    cost += milkOptions[1][milkIndex];
    
    return cost;
}

// Creates a table to output each drink and their total
// Also outputs the final total of the entire drink order
// Order is an array of Drinks
function outputOrder(order){
    "use strict";
    
    var i;
    var table = "";
    var sum = 0;
    
    // Build the heading row of the table
    table += "<tr>";
    table += "<th>#</th><th>Tea</th><th>Milk</th><th>Toppings</th><th>Cost</th>";
    table += "</tr>";
    
    // Build the drink rows of the table
    for(i = 0; i < order.length; i += 1){
        var total = 0;
        total = calculateCost(order[i]);
        
        table += "<tr>";
        
        // Drink #
        table += "<td>Drink " + (i + 1) + "</td>"; 
        // Tea
        table += "<td>" + order[i].teaType + "</td>";
        // Milk
        table += "<td>" + order[i].milkOption + "</td>";
        // Toppings List
        table += "<td style='width: 10%'>" + buildList(order[i].toppingsList, "", " ") + "</td>";
        // Drink Cost
        table += "<td>$" + total.toFixed(2) + "</td>";
        
        table += "</tr>";
        
        sum += total;
    }
    
    // Build the final row / total cost row of the table
    table += "<tr><th></th><th></th><th>Total</th><th></th><th>$" + sum.toFixed(2) + "</th></tr>";
 
    return table;
}

// Removes all items from a list array
function emptyList(list){
    "use strict";
    
    // only removes from an empty list
    while(list.length > 0){
        list.pop();
    }
}

// Updates the HTML page with new information
function updatePage(){
    "use strict";
    
    // Resets the dropdowns to their defaults
    document.getElementById("tea").selectedIndex = 0;
    document.getElementById("toppings").selectedIndex = 0;
    document.getElementById("milk").selectedIndex = 0;
    
    // Updates the drink list
    tableOrder.innerHTML = outputOrder(drinks);
    
    // Empties the toppingList array
    emptyList(toppingList);
    
    // Resets the toppings list on the HTML page
    toppingsOutput.innerHTML = "";
    
    // Erases the canvas
    resetCanvas();
}

// Called when Add Drink button pressed
// Adds a Drink object to the drinks array
function addDrink(){
    "use strict";
    
    // Gets the chosen tea and milk from the dropdowns
    var teaIndex = getOptionIndex("tea", teaOptions[0]);
    var milkIndex = getOptionIndex("milk", milkOptions[0]);
    
    // Creates a new Drink and adds it to the drinks array
    drinks.push(new Drink(teaOptions[0][teaIndex], toppingList, milkOptions[0][milkIndex]));
    
    // Update the page
    updatePage();
}

// Called when Remove Drink button pressed
// Removes the last drink item added to the list
function removeDrink(){
    "use strict";
    
    // only removes from the list if it is not empty
    if(drinks.length > 0){
        drinks.pop();
    }
    else{
        console.warn("Warning: Cannot remove drink from empty list!");
    }
    
    // Update the page
    updatePage();
}

// Called when the reset button is pressed
// Empties the entire drink order
function resetDrinks(){
    "use strict";
    
    // Empty drink list
    emptyList(drinks);
    
    // Update the page
    updatePage();
}

//////////////////////////////////////// Bubble Tea Setup and Start ////////////////////////////////////////
// Fills a HTML drop down list with values
function fillDropDown(elemId, values){
    "use strict";
    
    var dropDown = document.getElementById(elemId);
    var output = "";
    var i;
    
    // Creates the drop down list
    for(i = 0; i < values.length; i += 1){
        output += "<option value='" + values[i] + "'"; 
        if(i === 0){
            output += " selected";
        }
        output += ">" + values[i] + "</option>";
    }
    
    dropDown.innerHTML = output;
}

// Setup of the entire system
function setup(){
    "use strict";
    
    // Setup dropdown values
    fillDropDown("tea", teaOptions[0]);
    fillDropDown("toppings", toppingOptions[0]);
    fillDropDown("milk", milkOptions[0]);
    
    // Output for the toppings chosen
    toppingsOutput = document.getElementById("currentToppings");

    // Setup canvas variables
    teaCanvas = document.getElementById("teaCanvas");
    context = teaCanvas.getContext("2d");
    canvasWidth = teaCanvas.width;
    canvasHeight = teaCanvas.height;
    
    // Output for the drinks order
    tableOrder = document.getElementById("drinks");
}
