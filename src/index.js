const electron = require("electron");
const path = require("path");
var ProgressBar = require("progressbar.js");
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;

let minutes = 19,
  rest = 20,
  seconds = 59,
  done = 0,
  interval,
  track = 19,
  myNotification;

let line = new ProgressBar.Circle("#container", {
  strokeWidth: 20,
  trailColor: "#eee",
  trailWidth: 20,
  from: { color: "#01579b" },
  to: { color: "#ff0057" },
  step: function(state, circle, attachment) {
    circle.path.setAttribute("stroke", state.color);
  }
});

const time = document.getElementById("time");
const takeRest = document.getElementById("takeRest");
const theme = document.getElementById("theme");

theme.addEventListener("click", () => {
  if (document.body.style.color !== "rgb(255, 255, 255)") {
    document.body.style.backgroundColor = "#262626";
    document.body.style.color = "#fff";
  } else {
    document.body.style.backgroundColor = "#fff";
    document.body.style.color = "#262626";
  }
});

function twoDig(num) {
  return num < 10 ? 0 + "" + num : num;
}

function timer() {
  if (minutes === 0 && seconds === 0) {
    if (takeRest.innerText === "TAKE REST")
      myNotification = new Notification("EyeSaver", {
        body: "Time for a break"
      });
    else
      myNotification = new Notification("EyeSaver", {
        body: "Resume your work"
      });
    clearInterval(interval);
    time.innerText = twoDig(0) + " : " + twoDig(0);
    line.animate(1);
    done = 0;
    // line.animate(0);
  } else {
    time.innerText = twoDig(minutes) + " : " + twoDig(seconds--);
    line.animate(done);
    if (takeRest.innerText === "START") done += 1 / rest;
    else done += 1 / (track * 60);
    if (seconds === 0 && minutes > 0) {
      minutes--;
      seconds = 60;
    }
  }
}

timer();
takeRest.addEventListener("click", () => {
  let timerOn = false,
    tr = takeRest.innerHTML;
  if (tr === "Start" && !timerOn) {
    clearInterval(interval);
    line.animate(0);
    minutes = track;
    done = 0;
    seconds = 59;
    interval = setInterval(timer, 1000);
    timerOn = true;
    track = minutes;
  } else if (tr !== "Start") {
    line.animate(0);
    minutes = 0;
    done = 0;
    seconds = rest;
    clearInterval(interval);
    timerOn = false;
    interval = setInterval(timer, 1000);
  }
  takeRest.innerHTML = takeRest.innerHTML === "Start" ? "Take Rest" : "Start";
});

ipc.on("targetVal", (event, arg) => {
  done = 0;
  clearInterval(interval);
  minutes = Number(arg[0]) - 1 > -1 ? Number(arg[0]) - 1 : track;
  track = minutes;
  rest = Number(arg[1]) > 0 ? Number(arg[1]) : rest;
});
