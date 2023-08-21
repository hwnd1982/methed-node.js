export const shuffle = arr =>
  arr.reverse().reduce((arr, item, i) => {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], item];

    return arr;
  }, arr);
