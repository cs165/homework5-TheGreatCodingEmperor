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
  let data = [];
  for(i=1;i<rows.length;i++){
    let tmp={};
    const n = rows[0].length;
    let key_name = [];
    for(let j=0;j<n;j++){
      key_name[j]=rows[0][j];
      tmp[key_name[j]]=rows[i][j];
    }
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
  
  const n = rows[0].length;
  let add = [];
  for(let i=0;i<n;i++){
    add[i]=messageBody[rows[0][i]];
  }
  await sheet.appendRow(add);

  res.json( { status: 'successed'} );
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;

  const column  = req.params.column;
  const value  = req.params.value;
  const messageBody = req.body;

  const n = rows[0].length;
  let change_row = -1;
  for(let i=1;i<rows.length;i++){
    for(let j=0;j<n;j++){
      if(column.toUpperCase()===rows[0][j].toUpperCase()
      &&value.toUpperCase()===rows[i][j].toUpperCase()){
        change_row=i;
        break;
      }
    }
    if(change_row!==-1)break;
  }
  let change_valueIndex=-1;
  if(change_row!==-1){
    let newRow = [];
    for(let j=0;j<n;j++){
      newRow[j]=rows[change_row][j];
      const o = new Object();
      if(messageBody.hasOwnProperty(rows[0][j])){
        newRow[j]=messageBody[rows[0][j]];
      }
    }
    sheet.setRow(change_row,newRow);
  }



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
    const n = rows[0].length;
    for(let j=0;j<n;j++){
      if(column.toUpperCase()===rows[0][j].toUpperCase()
      &&value.toUpperCase()===rows[i][j].toUpperCase()){
        delete_row = i;
        break;
      }
    }
  }
  if(delete_row !== -1){
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
