export const argsParse = ([, , ...argv], commands = []) => {
  const [command] = argv;
  const args = { command };

  if (!command || /^(-h|--help)/.test(command)) {
    return { command: 'help', value: '' };
  }

  if (commands.includes(command)) {
    for (const arg of argv) {
      switch (true) {
        case command === arg:
          break;
        case /^(-h|--help)/.test(arg):
          return { command: 'help', value: args.command };
        case !isNaN(arg):
          args['id'] = arg;
          break;
        default:
          args['value'] = arg;
      }
    }
    return args;
  }

  return { command: 'error', value: 'Некорректная команда...' };
};
