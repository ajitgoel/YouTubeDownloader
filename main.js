const electron = require('electron');
const path = require('path');
const url = require('url');
const youtubedl = require('youtube-dl');
const windowStateKeeper = require('electron-window-state');

//const ytdl = require('ytdl-core');
//const isPlaylist = require("is-playlist");

// SET ENV
process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on('ready', function()
{
  // Load the previous state with fallback to defaults 
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    title: 'YouTube Downloader', 
    show: false,
    'x': mainWindowState.x,
    'y': mainWindowState.y,
    'width': mainWindowState.width,
    'height': mainWindowState.height
    //backgroundColor: '#002b36',
  });
  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes:true
  }));

  mainWindow.on('ready-to-show', function() 
  { 
    mainWindow.show(); 
    mainWindow.focus(); 
  });

  mainWindow.on('closed', function()
  {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
});

exports.getUrlInformation=(url)=>
{  
    //var options = ['--get-id','--get-thumbnail','--get-description','--get-duration','--get-filename']; 

    var options = ['-j', '--flat-playlist', '-e','--get-title', '--get-thumbnail'];
    youtubedl.getInfo(url, options, function(error, urlInformation) 
    {
      if (error) 
      {
        mainWindow.webContents.send('UrlInformation', false);
        return;
      }

      var urlsInformationArray = [];
      if(urlInformation.constructor === Array)
      {
        urlsInformationArray.push.apply(urlsInformationArray, urlInformation);
      }
      else
      {
        urlsInformationArray.push(urlInformation);
      }

      mainWindow.webContents.send('UrlInformation', urlsInformationArray);
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