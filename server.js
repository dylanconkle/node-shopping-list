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

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!request.body) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(request, ressponse) {
  if (!request.body) {
    return response.sendStatus(400);
  }
  var item = storage.put(request.params.id, request.body.name);
  response.status(201).json(item);
});

app.delete('/items/:id', function(request, response) {
    var item = storage.remove(request.params.id);
    if (item) {
        response.status(201).json(item);
    } else {
        response.status(400).json({
            "error": "no item found"
        });
    }
});

app.listen(8080, function() {
    console.log('Listening on port 8080!');
});
