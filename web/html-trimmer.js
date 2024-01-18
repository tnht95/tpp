import fs from 'node:fs';

import FileHound from 'filehound';

const files = FileHound.create()
  .paths('./src/')
  .discard('node_modules')
  .ext('tsx')
  .find();

files
  .then(filePaths => {
    for (const filepath of filePaths) {
      fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) throw err;
        fs.writeFile(filepath, data.replace(/^ +| +$| +(?= )/g, ''), e => {
          if (e) throw e;
        });
      });
    }
  })
  .catch(error => {
    throw error;
  });
