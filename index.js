import { bufferToText, textToBuffer } from './modules/buffer.js';
import { mergeTextFiles } from './modules/mergeTextFiles.js';
import {
  resizeImage,
  greyscaleImage,
  blurImage,
} from './modules/resizeImage.js';

const text = 'Привет мир!';
const utf8Buffer = textToBuffer(text, 'utf8');
const decodedHex = bufferToText(utf8Buffer, 'hex');
const hexBuffer = textToBuffer(decodedHex, 'hex');
const decodedText = bufferToText(utf8Buffer, 'utf8');

console.log('utf8Buffer: ', utf8Buffer);
console.log('decodedText: ', decodedText);
console.log(
  'comparing utf8Buffer &  hexBuffer: ',
  hexBuffer.equals(utf8Buffer),
);

const appMergeTextFiles = async () => {
  await mergeTextFiles('./files', 'result.txt');
};

const imageFormattingApp = async () => {
  await resizeImage('./files/img.jpg', './files/resize-img.jpg');
  await greyscaleImage(
    './files/resize-img.jpg',
    './files/greyscale-resize-img.jpg',
  );
  await blurImage(
    './files/greyscale-resize-img.jpg',
    './files/blur-greyscale-resize-img.jpg',
  );
};

appMergeTextFiles();
imageFormattingApp();
