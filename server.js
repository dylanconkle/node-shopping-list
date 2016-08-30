var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {
        name: name,
        id: this.id
    };
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.remove = function(id) {
  var item = this.items.splice(id, 1);
  return item[0];
};

Storage.prototype.put = function(id, name) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id == id) {
      this.items[i].name = name;
      return this.items[i];
    }
  }
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
  if (!req.body) {
    return res.sendStatus(400);
  }
  var item = storage.put(req.params.id, req.body.name);
  res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
    var item = storage.remove(req.params.id);
    if (item) {
        res.status(201).json(item);
    } else {
        res.status(400).json({
            "error": "no item found"
        });
    }
});

app.listen(process.env.PORT || 3000, function() {
    var currentPort = process.env.PORT;
    console.log('Server Started!');
});

exports.app = app;
exports.storage = storage;
