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
      fs.readFile(filepath, 'utf8', (err, content) => {
        if (err) throw err;
        const match = content.match(/^\s*"\s*(.*?)\s*"\s*$/);
        if (match) {
          fs.writeFile(filepath, match[1].replace(/\s+/g, ' '), e => {
            if (e) throw e;
          });
        }
      });
    }
  })
  .catch(error => {
    throw error;
  });
