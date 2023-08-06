import fs from 'node:fs/promises';

export const readText = async pathFile => {
  try {
    const result = await fs.readFile(pathFile, 'utf8');

    return result;
  } catch (err) {
    console.warn(`Ошибка чтения файла: ${err.message}`);
  }
};
