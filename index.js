'use strict';

function git (command, directory) {
  let git = require('simple-git')(directory);

  return new Promise((resolve, reject) => {
    git._run(command, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    });
  });
}

async function remoteHash () {
  let refs = await git('ls-remote origin refs/heads/master');

  // specific format for git 1.8.5, which is what travis currently installs.
  return refs.split('\t')[0];
}

async function inspect (hash) {

  let range = hash.trim() + ' ' + (process.env.TRAVIS_COMMIT || 'HEAD'),
    diff = await git('diff-tree ' + range + ' -r --name-only --no-commit-id'),
    results = diff ? diff.trim().split('\n') : [];

  return results;
}

function clean (results, options) {

  // remove any undefined, empty, or null values
  results = results.filter((result) => !!result);

  if (options.pattern && options.pattern instanceof RegExp) {
    results = results.filter((result) => options.pattern.test(result));
  }

  if (options.map && typeof options.map === 'function') {
    results = results.map(options.map);
  }

  // little hack for uniqueness
  results = Array.from(new Set(results));

  return results;
}

module.exports = async function target (options) {

  if (!process.env.TRAVIS || !process.env.CI) {
    console.warn('travis-target: Not running in a Travis CI environment.');
    return [];
  }

  let hash = await remoteHash(),
    files = await inspect(hash),
    results = clean(files, options || {});

  return results;
};
