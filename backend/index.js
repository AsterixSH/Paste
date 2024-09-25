const express = require('express');
const bodyParser = require('body-parser');

const { paste } = require('./handlers/paste')
const { encryptedPaste } = require('./handlers/encryptedPaste');

const app = express();
app.use(bodyParser.json());

// routes
app.post('/paste', paste);
app.post('/encryptedPaste', encryptedPaste);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`REST-API is now Running!\n\nPort: ${port}\nRoutes:`);
    
    // Print all routes
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path){
        console.log('- ' + r.route.path);
      }
    })
  });
