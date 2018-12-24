const electron = require("electron");
const path = require("path");
const remote = electron.remote;
const ipc = electron.ipcRenderer;

let btn = document.getElementById("closeBtn");
let min = document.getElementById("min");
let sec = document.getElementById("sec");
let sub = document.getElementById("submit");

btn.addEventListener("click", event => {
  let window = remote.getCurrentWindow();
  window.close();
});

sub.addEventListener("click", () => {
  ipc.send("update-value", [min.value, sec.value]);
  let window = remote.getCurrentWindow();
  window.close();
});
