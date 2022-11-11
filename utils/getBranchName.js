const fs = require('fs');

module.exports = function getCurrentBranchName(p = process.cwd()) {
    const gitHeadPath = `${p}/.git/HEAD`;
    // console.log('Branch Name-->',gitHeadPath,fs.readFileSync(gitHeadPath, 'utf-8'))
    return fs.readFileSync(gitHeadPath, 'utf-8').trim().split('/')[2];
};