const electron = require('electron');
const path = require('path');
const url = require('url');
//const youtubedl = require('youtube-dl');
const ytdl = require('ytdl-core');

// SET ENV
process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

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
  var url = arg;
  var isUrlValid= ytdl.validateURL(url);
  if(isUrlValid === false)
  {
    mainWindow.webContents.send('UrlInformation', isUrlValid);
    return;
  } 
  
  var options = [];
  ytdl.getInfo(url, options, function(err, urlInformation) 
  {
    if (err) throw err;  
    console.log('getUrlInformation: urlInformation: ' , urlInformation);
    mainWindow.webContents.send('UrlInformation', urlInformation);
  });
}
const mainMenuTemplate =  [
  {
    label: 'File',
    submenu:[
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