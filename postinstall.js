/**
 * postinstall configuration
 */


const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp-promise');

const pathList = ['logs'];

// create log folders
pathList.forEach((p) => {
  const fullpath = path.join(`${__dirname}/${p}`);
  fs.access(fullpath, fs.R_OK, (err) => {
    if (err) mkdirp(fullpath);
  });
});
