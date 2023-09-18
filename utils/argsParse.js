const API_PARAMS_KEY = {
  '-c': 'category',
  '-q': 'q',
  '-l': 'language',
  '-s': 'pageSize',
  // '': 'country',
  // '': 'sources',
  // '': 'excludeDomains',
  // '': 'from',
  // '': 'to',
  // '': sortBy,
  // '': domains,
  // '': searchIn,
  // '': page,
};

export const argsParse = ([, , ...argv]) => {
  const [command] = argv;
  const args = {};

  if (/^(-h|--help)/.test(command)) {
    return { help: true };
  }

  for (let i = 0, v = 1; i < argv.length; i++, v++) {
    switch (true) {
      case argv[i].startsWith('-') &&
        API_PARAMS_KEY[argv[i]] &&
        !argv[v].startsWith('-'):
        args[API_PARAMS_KEY[argv[i++]]] = argv[v++];
        break;
      default:
        return { error: 'Введена некорректная команда...' };
    }
  }

  return args;
};
