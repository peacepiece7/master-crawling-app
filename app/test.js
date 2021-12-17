const { fork } = require('child_process');
const ps = fork(`${__dirname}/test1.js`);
console.log(ps);
