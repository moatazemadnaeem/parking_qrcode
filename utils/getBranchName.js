const fs = require('fs');

module.exports = function getCurrentBranchName(p = process.cwd()) {
  const gitHeadPath = `${p}/.git/HEAD`;
  if(fs.existsSync(p)&&fs.existsSync(gitHeadPath)){
    return fs.readFileSync(gitHeadPath, 'utf-8').trim().split('/')[2];
  }
  return false;
};