export const argsParse = ([, , ...argv], commands = []) => {
  const args = {};

  if (commands.includes(argv[0])) {
    args[argv[0]] = true;
  }

  for (let i = 0; i < argv.length; i++) {
    switch (true) {
      case !argv[i].startsWith('-'):
        break;
      case argv[i + 1] && !argv[i + 1].startsWith('-'):
        args[argv[i].substring(1)] = argv[i + 1];
        break;
      case argv[i].startsWith('-no-'):
        args[argv[i].substring(4)] = false;
        break;
      case argv[i].startsWith('--'):
        if (argv[i].includes('=')) {
          const [key, value] = argv[i].split('=');

          args[key.substring(2)] = value;
        } else {
          args[argv[i].substring(2)] = true;
        }
        break;
      default:
        args[argv[i].substring(1)] = true;
    }
  }

  return args;
};
