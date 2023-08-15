import { bufferToText, textToBuffer } from './modules/buffer.js';
import { mergeTextFiles } from './modules/mergeTextFiles.js';

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

appMergeTextFiles();
