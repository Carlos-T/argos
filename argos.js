// const  = require('child_process');
const { shell } = require('electron');
const { div } = require('./naive');
const { exec, spawn } = require('child_process');
// const Photon = require('electron-photon');

exec('lerna ls', (error, stdout, stderr) => {
  if (error) {
    console.log('error', error);
    console.log('stderr', stderr);
  } else {
    const packages = stdout.split('\n');
    packages.pop();
    const container = document.getElementsByClassName('nav-group')[0];
    packages.map(i => {
      const d = div('.nav-group-item', [i]);
      d.addEventListener('click', (e) => selectPackage(i, e));
      container.appendChild(d);
    });
  }
});

function selectPackage(i, e) {
  const curr = document.getElementsByClassName('active')[0];
  if (curr) {
    curr.classList.remove('active');
  }
  e.target.classList.add('active');
  const s = document.getElementsByClassName('selected-package')[0];
  s.classList.add('selected');
  s.getElementsByClassName('package-name')[0].textContent = i;
  s.getElementsByClassName('build-up')[0].addEventListener('click', () => buildUp(i));
  s.getElementsByClassName('build')[0].addEventListener('click', () => build(i));
  s.getElementsByClassName('build-down')[0].addEventListener('click', () => buildDown(i));
  cleanPre();
}

function buildUp(i) {
  cleanPre()
  const bu = spawn('lerna.cmd', ['run', 'build', `--scope=${i}`, '--include-filtered-dependants']);
  const precode = document.getElementsByClassName('precode')[0];
  bu.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    var string = new TextDecoder("utf-8").decode(data);
    console.log('<<<', string);
    precode.textContent = precode.textContent + string;
  });
  bu.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    var string = new TextDecoder("utf-8").decode(data);
    console.log('>>>', string);
    precode.textContent = precode.textContent + string;
  });
  bu.on('close', (code) => {
    shell.beep();
    console.log(`child process exited with code ${code}`);
    precode.textContent = precode.textContent + `child process exited with code ${code}`;
  });
}

function build(i) {
  cleanPre()
  const bu = spawn('lerna.cmd', ['run', 'build', `--scope=${i}`]);
  const precode = document.getElementsByClassName('precode')[0];
  bu.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    var string = new TextDecoder("utf-8").decode(data);
    console.log('<<<', string);
    precode.textContent = precode.textContent + string;
  });
  bu.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    var string = new TextDecoder("utf-8").decode(data);
    console.log('>>>', string);
    precode.textContent = precode.textContent + string;
  });
  bu.on('close', (code) => {
    shell.beep();
    console.log(`child process exited with code ${code}`);
    precode.textContent = precode.textContent + `child process exited with code ${code}`;
  });
}

function buildDown(i) {
  cleanPre()
  const bu = spawn('lerna.cmd', ['run', 'build', `--scope=${i}`, '--include-filtered-dependencies']);
  const precode = document.getElementsByClassName('precode')[0];
  bu.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    var string = new TextDecoder("utf-8").decode(data);
    console.log('<<<', string);
    precode.textContent = precode.textContent + string;
  });
  bu.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
    var string = new TextDecoder("utf-8").decode(data);
    console.log('>>>', string);
    precode.textContent = precode.textContent + string;
  });
  bu.on('close', (code) => {
    shell.beep();
    console.log(`child process exited with code ${code}`);
    precode.textContent = precode.textContent + `child process exited with code ${code}`;
  });
}

function cleanPre() {
  const precode = document.getElementsByClassName('precode')[0];
  precode.textContent = '';
}

