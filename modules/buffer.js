export const textToBuffer = (text, encoding) => Buffer.from(text, encoding);
export const bufferToText = (buffer, encoding) => buffer.toString(encoding);
