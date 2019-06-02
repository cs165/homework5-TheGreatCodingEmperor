const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '1IoLg4dTdrMHf3KZMXURTEYsNIZCgTFCgr9sqHUK1S-M';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  console.log(rows);
  const keys = rows[0];
  const data = [];
  for(i=1;i<rows.length;i++){
    const tmp={};
    key1=rows[0][0];
    key2=rows[0][1];
    tmp[key1]=rows[i][0];
    tmp[key2]=rows[i][1];
    data.push(tmp);
  }

  // TODO(you): Finish onGet.

  res.json( data );
}
app.get('/api', onGet);

async function onPost(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;

  const messageBody = req.body;
  // TODO(you): Implement onPost.
  console.log(messageBody);
  const keys = Object.getOwnPropertyNames(messageBody);
  for(let i=0;i<keys.length;i++)

  res.json( { status: 'successed'} );
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const messageBody = req.body;


  // TODO(you): Implement onPatch.

  res.json( { status: 'successed'} );
}
app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  const column  = req.params.column;
  const value  = req.params.value;
  let delete_row = -1;
  for(let i=0;i<rows.length;i++){
    if(rows[0][0]===column){
      if(rows[i][0]===value){
        delete_row=i;
        break;
      }
    }
    else{
      if(rows[i][1]===value){
        delete_row=i;
        break;
      }
    }
  }
  if(delete_row!==-1){
    await sheet.deleteRow(delete_row);
  }
  
  

  // TODO(you): Implement onDelete.

  res.json( { status: 'successed'} );
}
app.delete('/api/:column/:value',  onDelete);


// Please don't change this; this is needed to deploy on Heroku.
const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});
