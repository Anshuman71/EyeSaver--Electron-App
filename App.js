const { app, BrowserWindow, Menu } = require("electron");
const shell = require("electron").shell;
const ipc = require("electron").ipcMain;

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 600,
    icon: "assets/icons/pngs/icon.png"
  });

  // and load the index.html of the app.
  win.loadFile("src/index.html");

  // win.webContents.openDevTools();

  win.on("closed", () => {
    win = null;
  });

  let menu = Menu.buildFromTemplate([
    {
      label: "Menu",
      submenu: [
        {
          label: "Edit timer",
          click() {
            let popUp = new BrowserWindow({
              frame: false,
              width: 300,
              alwaysOnTop: true,
              height: 200
            });
            popUp.on("close", () => {
              popUp = null;
            });
            popUp.loadFile("src/edit.html");
            popUp.show();
          }
        },
        { type: "separator" },
        {
          label: "Info",
          click() {
            let popUp = new BrowserWindow({
              frame: false,
              width: 300,
              alwaysOnTop: true,
              height: 250
            });
            popUp.on("close", () => {
              popUp = null;
            });
            popUp.loadFile("src/info.html");
            popUp.show();
          }
        },
        { type: "separator" },
        {
          label: "Exit",
          click() {
            app.quit();
          }
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipc.on("update-value", (event, arg) => {
  win.webContents.send("targetVal", arg);
});
