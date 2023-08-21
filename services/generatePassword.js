import { shuffle } from '../utils/shuffle.js';

export const generatePassword = (options = {}) => {
  let charset = 'abcdfghijklmnopqrstuvwxyz';
  let crop = 0;

  if (options.uppercase) {
    charset += charset.toUpperCase();
  }

  if (options.numbers) {
    charset += '0123456789';
  }

  if (options.special) {
    charset += '!@#$%^&*()_+~';
  }

  crop = Math.floor(Math.random() * (charset.length - options.length + 1));

  return shuffle(charset.split(''))
    .join('')
    .slice(crop, crop + options.length);
};
