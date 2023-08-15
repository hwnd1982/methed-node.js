import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import sharp from 'sharp';

export const resizeImage = async (inputPath, outputPath) =>
  pipeline(
    createReadStream(inputPath),
    sharp().resize(400, 400).toFormat('jpeg'),
    createWriteStream(outputPath),
  );

export const blurImage = async (inputPath, outputPath, value = 2) =>
  pipeline(
    createReadStream(inputPath),
    sharp().greyscale().blur(value).toFormat('jpeg'),
    createWriteStream(outputPath),
  );

export const greyscaleImage = async (inputPath, outputPath) =>
  pipeline(
    createReadStream(inputPath),
    sharp().greyscale().toFormat('jpeg'),
    createWriteStream(outputPath),
  );
