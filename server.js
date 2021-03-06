const http = require('http');
const _ = require('lodash');
const Utils = require('./utils');

const requestHandler = (req, res) => {

  if (!router[req.url] || !router[req.url][req.method]) return res.end(`${req.method} ${req.url} not found`);

  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {

    req.body = data ? JSON.parse(data) : {};

    try {
      router[req.url][req.method](req, res);
    } catch (err) {
      res.end(`Error processing request ${err}`);
    }
    
  });

};

const server = http.createServer(requestHandler);
const port = process.env.PORT || 3000;

server.listen(port, (err) => {

  if (err) return console.error(`Unable to start server ${err}`);

  console.log(`Server Listening on port ${port}`);
});

const router = {

  '/': {

    'GET': (req, res) => {

      const list = require('./list.json');
      res.end(JSON.stringify(list.list, null, 2));
      
    },

    'POST': (req, res) => {

      if (!req.body || !req.body.name) return res.end('name required');
      
      let list = require('./list.json');
      list.list.push(req.body.name);
      
      Utils.saveList(list)
	.then(list => res.end(JSON.stringify(list.list, null, 2)))
	.catch(e => res.end(`Error saving list ${e}`));
      
    },
    
  },
  
  '/current': {

    'GET': (req, res) => {

      const list = require('./list.json');
      res.end(JSON.stringify(list.current));
      
    },
    
  },

  '/move': {

    'POST': (req, res) => {

      return Utils.move()
	.then(list => res.end(`Next: ${list.current}`))
	.catch(e => res.end(`Error saving list ${e}`));

    },
    
  }
  
};


