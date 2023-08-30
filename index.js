import process from 'node:process';
import { ToDoJSONController } from './services/ToDoJSONController.js';
import { argsParse } from './utils/argsParse.js';

const app = async () => {
  const controller = new ToDoJSONController();
  const { command, id, value } = argsParse(process.argv, [
    'add',
    'update',
    'list',
    'status',
    'get',
    'delete',
    'clear',
  ]);

  await controller[command](...[id, value].filter(arg => arg));
  process.exit();
};

app();
