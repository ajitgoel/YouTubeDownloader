const electron = require('electron');
const path = require('path');
const url = require('url');
//const youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core');

// SET ENV
process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
//let addWindow;

app.on('ready', function()
{
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes:true
  }));
  mainWindow.on('closed', function(){
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

exports.getUrlInformation=(arg)=>
{
  //console.log("getUrlInformation: " + arg);
  /*var url = arg;
  var options = [];
  youtubedl.getInfo(url, options, function(err, urlInformation) 
  {
    if (err) throw err;  

    console.log('id:', urlInformation.id);
    console.log('title:', urlInformation.title);
    console.log('url:', urlInformation.url);
    console.log('thumbnail:', urlInformation.thumbnail);
    console.log('description:', urlInformation.description);
    console.log('filename:', urlInformation._filename);
    console.log('format id:', urlInformation.format_id);

    mainWindow.webContents.send('UrlInformation', urlInformation);
  });*/

  var url = arg;
  var options = [];
  ytdl.getInfo(url, options, function(err, urlInformation) 
  {
    if (err) throw err;  

    console.log('getUrlInformation: urlInformation: ' , urlInformation);

    /*console.log('id:', urlInformation.id);
    console.log('title:', urlInformation.title);
    console.log('url:', urlInformation.url);
    console.log('thumbnail:', urlInformation.thumbnail);
    console.log('description:', urlInformation.description);
    console.log('filename:', urlInformation._filename);
    console.log('format id:', urlInformation.format_id);
*/
    mainWindow.webContents.send('UrlInformation', urlInformation);
  });

}
// Handle add item window
/*function createAddWindow(){
  addWindow = new BrowserWindow({
    width: 300,
    height:200,
    title:'Add Shopping List Item'
  });
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes:true
  }));
  // Handle garbage collection
  addWindow.on('close', function(){
    addWindow = null;
  });
}*/

// Catch item:add
/*ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addWindow.close(); 
  // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
  //addWindow = null;
});*/

// Create menu template
const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: 'File',
    submenu:[
      /*{
        label:'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label:'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },*/
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}