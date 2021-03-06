const { shell } = require('electron');
const { div, createElement } = require('./naive');
const { exec, spawn } = require('child_process');

exec('lerna ls', (error, stdout, stderr) => {
  if (error) {
  } else {
    const packages = stdout.split('\n');
    packages.pop();
    const container = document.querySelector('.nav-group');
    packages.map((i, index) => {
      const d = div(`.nav-group-item.package-${index}`, [i]);
      d.addEventListener('click', (e) => selectPackage(index, e));
      container.appendChild(d);
      const s = document.querySelector('.packages-detail');
      createPackageDetail(s, i, index);
    });
  }
});

function selectPackage(i, e) {
  const list = document.querySelector('.packages-list');
  const currList = list.querySelector('.active');
  if (currList) {
    currList.classList.remove('active');
  }
  list.querySelector(`.package-${i}`).classList.add('active');

  const detail = document.querySelector('.packages-detail');
  const currDetail = detail.querySelector('.active');
  if (currDetail) {
    currDetail.classList.remove('active');
  }
  detail.getElementsByClassName(`package-${i}`)[0].classList.add('active');
}

function buildUp(package, index) {
  cleanPre(index);
  const precode = document.querySelector(`.packages-detail .package-${index} .precode`);
  launchCommand('lerna.cmd', ['run', 'build', `--scope=${package}`, '--include-filtered-dependants'], precode);
}

function build(package, index) {
  cleanPre(index);
  const precode = document.querySelector(`.packages-detail .package-${index} .precode`);
  launchCommand('lerna.cmd', ['run', 'build', `--scope=${package}`], precode);
}

function buildDown(package, index) {
  cleanPre(index);
  const precode = document.querySelector(`.packages-detail .package-${index} .precode`);
  launchCommand('lerna.cmd', ['run', 'build', `--scope=${package}`, '--include-filtered-dependencies'], precode);
}

function start(package, index) {
  cleanPre(index);
  const precode = document.querySelector(`.packages-detail .package-${index} .precode`);
  launchCommand('lerna.cmd', ['run', 'start', `--scope=${package}`], precode);
}

function launchCommand(command, params, logPlaceholder) {
  const bu = spawn(command, params);
  bu.stdout.on('data', (data) => {
    var string = new TextDecoder("utf-8").decode(data);
    logPlaceholder.textContent = logPlaceholder.textContent + string;
  });
  bu.stderr.on('data', (data) => {
    var string = new TextDecoder("utf-8").decode(data);
    logPlaceholder.textContent = logPlaceholder.textContent + string;
  });
  bu.on('close', (code) => {
    shell.beep();
    logPlaceholder.textContent = logPlaceholder.textContent + `child process exited with code ${code}`;
  });
}

function cleanPre(index) {
  const precode = document.querySelector(`.packages-detail .package-${index} .precode`);
  precode.textContent = '';
}


function createButton(className, icon, text, packageName, index) {
  const fns = {
    'build-up': buildUp,
    'build': build,
    'build-down': buildDown,
    'start': start
  };
  const b = createElement('button', `.${className}.btn.btn-default`, [createElement('span', `.icon.icon-text.${icon}`), createElement('span', '', [text])]);
  b.addEventListener('click', () => fns[className](packageName, index));
  return b;
}

function createButtonBar(name, index) {
  return [
    createButton('build-up', 'icon-up', 'Build up', name, index),
    createButton('build', 'icon-database', 'Build', name, index),
    createButton('build-down', 'icon-down', 'Build down', name, index),
    createButton('start', 'icon-play', 'Start', name, index)

  ];
}

function createPackageDetail(parent, name, index) {
  parent.appendChild(createElement('div', `.package.package-${index}`, [
    createElement('h4', '.package-name', [name]),
    createElement('div', '.btn-group', createButtonBar(name, index)),
    createElement('pre', '.precode')
  ]));
}