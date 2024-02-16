import fs from 'node:fs';

import FileHound from 'filehound';

const throwIfErr = e => {
  if (e) throw e;
};

const trimSpaces = filePaths => {
  for (const filePath of filePaths) {
    fs.readFile(filePath, 'utf8', (e, content) => {
      throwIfErr(e);

      let newContent = '';

      //   class=" 1   2 3  " id= "  1 3 3   "  flag x=  " "
      //   class="1   2 3  " id= "1 3 3   "  flag x=  ""
      const regExLeftOuterTrim = /(?<=") +(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g;
      if (regExLeftOuterTrim.test(content)) {
        newContent = content.replaceAll(regExLeftOuterTrim, '');
      }

      //   class="1   2 3  " id= "1 3 3   "  flag x=  ""
      //   class="1   2 3" id= "1 3 3"  flag x=  ""
      const regExRightOuterTrim = / +(?=")(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g;
      if (regExRightOuterTrim.test(newContent || content)) {
        newContent = (newContent || content).replaceAll(
          regExRightOuterTrim,
          ''
        );
      }

      //   class="1   2 3" id= "1 3 3"  flag x=  ""
      //   class="1 2 3" id= "1 3 3"  flag x=  ""
      const regExInnerTrim = /  +(?=(?:(?:[^"]*"){2})*[^"]*"[^"]*$)/g;
      if (regExInnerTrim.test(newContent || content)) {
        newContent = (newContent || content).replaceAll(regExInnerTrim, ' ');
      }

      if (newContent) {
        fs.writeFile(filePath, newContent, throwIfErr);
      }
    });
  }
};

FileHound.create()
  .paths('./src/')
  .discard('node_modules')
  .ext('tsx')
  .find()
  .then(trimSpaces)
  .catch(throwIfErr);
