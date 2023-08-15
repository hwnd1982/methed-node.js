import { readdir } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';

export const mergeTextFiles = async (dirPath, outputFileName) =>
  (await readdir(dirPath, { withFileTypes: true })).reduce(
    async (promise, file) => {
      if (
        !file.isDirectory() &&
        file.name.endsWith('.txt') &&
        file.name !== outputFileName
      ) {
        const wStream = await promise;
        try {
          wStream.write(`[${file.name}]\n`);

          for await (const chunk of createReadStream(
            `${dirPath}/${file.name}`,
          )) {
            wStream.write(chunk);
          }
          wStream.write('\n');

          return wStream;
        } catch (err) {
          console.log(err.message);
        }
      }

      return promise;
    },
    Promise.resolve(createWriteStream(`${dirPath}/${outputFileName}`)),
  );
