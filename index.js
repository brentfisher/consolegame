var blessed = require('blessed');

screen = blessed.screen({
  smartCSR: true
});
screen.title = 'beer';

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

var contrib = require('blessed-contrib');
var grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

var counterBox = grid.set(0, 0, 4, 3, blessed.text, {
  label: "Loop Counter",
  content: "0"
});

var logBox = grid.set(0, 3, 4, 9, blessed.log, {
  label: "log",
});

var dollarsBox = null;
var beersDrankBox = null;
var itemBox = null;
var listBox = null;
var priceBox = null;
var descBox = null;
var buyPrompt = null;

var activityBox = grid.set(4, 0, 4, 3, blessed.text, {
  label: "brewery",
  content: beerASCII(),
  left: 0,
  right: 0,
  width: "100%",
  height: "100%"
});

screen.render();

activityBox.on('click', function(mouse) {
  // activityBox.setContent('You clicked ' + mouse.x + ', ' + mouse.y + '.');
  logBox.log("You drink a beer, you feel happy");
  clicks = clicks + 1;
  if (dollarsBox)
    dollarsBox.content = "$ " + dollars.toString();
  // if (listBox)
  //   listBox.focus();
  logic(clicks);
  screen.render();
});


var fps = 75;
var counter = 0;
clicks = 0;
dollars = 0;
// setInterval(GameLoop, 1000 / fps);
setInterval(GameLoop, 1000);

function GameLoop() {
  counterBox.content = counter.toString();
  // dollarsBox.content = counter.toString();
  screen.render();
  counter++;
}

function beerASCII() {
 return " \
     o©ºº©oo©oº°©            \n \
    /           \\          \n \
    |___________|____      \n \
    |            |____)     \n \
    |  B E E R   |  | |     \n \
    |            |  | |     \n \
    |   F O R    |  | |     \n \
    |            |  | |     \n \
    |   Y O U    |  | |     \n \
    |            |__|_|     \n \
    |            |____)     \n \
    |____________|          \n \
   (______________)   \n \
 ";
}

var drawDollars = function() {
  dollarsBox = grid.set(8, 0, 1, 2, blessed.text, {
    label: "dollars",
    content: "0"
  });
  screen.render();
}

var drawBeersDrank = function() {
  beersDrankBox = grid.set(9, 0, 1, 2, blessed.text, {
    label: "beers drank",
    content: "0"
  });
  screen.render();
}

var drawItems = function() {
  itemBox = grid.set(8, 2, 4, 4, blessed.text, {
    label: "Items",
    content: ""
  });
  screen.render();
}

var drawShop = function() {
  priceBox = grid.set(4, 9, 1, 3, blessed.text, {
  });
  descBox = grid.set(5, 9, 3, 3, blessed.text, {
  });

  listBox = grid.set(4, 3, 4, 6, blessed.list, {
    label: "Shop",
    items: [
      'HomeBrew Kit',
      'placeholder'
    ],
    mouse: true,
    keys: true,
    vi: true,
    width: '50%',
    height: 'shrink',
    //border: 'line',
    top: 5,
    //bottom: 2,
    left: 0,
    style: {
      fg: 'blue',
      bg: 'default',
      selected: {
        bg: 'green'
      }
    },
  });
  listBox.select(0);
  listBox.focus();
  listBox.on('select', function(item) {
    var item = item.getText();
    var price = getPrice(item);
    var desc = getDesc(item);
    descBox.content = desc.toString();
    priceBox.content = price.toString();
    initPrompts();
    buyPrompt.ask('Question?', function(err, value) {
      if (value) {
        logBox.log("Bought item: " + item);
        listBox.removeItem(item);
        descBox.content = "";
        priceBox.content = "";
        if (!itemBox) {
          drawItems();
          itemBox.content = item;
        } else {
          itemBox.content = itemBox.content += "\n" + item;
          screen.render();
        }
        screen.render();
      } else {
        logBox.log("transaction canceled");
      }
    });
    screen.render();
    // logBox.log(item.getText());
  });
  screen.render();
}

function getPrice(item) {
  var output = "";
  switch (item) {
    case "HomeBrew Kit":
      output = 0;
      break;
    case "placeholder":
      output = 0;
      break;
  }
  return output;
}

function getDesc(item) {
  var output = "";
  switch (item) {
    case "HomeBrew Kit":
      output = "A gift from your buddy jayblack, with a note: 'Get Rekt'";
      break;
    case "placeholder":
      output = "nothing to see here";
      break;
  }
  return output;
}

function initPrompts() {
  buyPrompt = blessed.question({
    parent: screen,
    border: 'line',
    height: 'shrink',
    width: 'half',
    top: 'center',
    left: 'center',
    label: ' {blue-fg}Question{/blue-fg} ',
    tags: true,
    keys: true,
    vi: true
  });
  screen.render();
}

function logic(clicks) {
  if (clicks) {
    if (clicks == 1) {
      logBox.log("You feel drunk, maybe we should start brewing this stuff...");
      drawBeersDrank();
      drawDollars();
      drawShop();
    }
  } else { 
  }
}
