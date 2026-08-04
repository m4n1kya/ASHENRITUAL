/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

// Patch Node.js v24 Windows bug where fs.readlink on a file throws EISDIR instead of EINVAL
const origReadlink = fs.readlink;
fs.readlink = function (path, options, callback) {
  const cb = typeof options === 'function' ? options : callback;
  const opts = typeof options === 'function' ? {} : options;
  return origReadlink.call(fs, path, opts, (err, linkString) => {
    if (err && err.code === 'EISDIR') {
      const einvalErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      einvalErr.code = 'EINVAL';
      einvalErr.errno = -4071;
      return cb(einvalErr);
    }
    return cb(err, linkString);
  });
};

const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (path, options) {
  try {
    return origReadlinkSync.call(fs, path, options);
  } catch (err) {
    if (err && err.code === 'EISDIR') {
      const einvalErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      einvalErr.code = 'EINVAL';
      einvalErr.errno = -4071;
      throw einvalErr;
    }
    throw err;
  }
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (path, options) {
    try {
      return await origPromisesReadlink.call(fs.promises, path, options);
    } catch (err) {
      if (err && err.code === 'EISDIR') {
        const einvalErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        einvalErr.code = 'EINVAL';
        einvalErr.errno = -4071;
        throw einvalErr;
      }
      throw err;
    }
  };
}
