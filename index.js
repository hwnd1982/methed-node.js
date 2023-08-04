import { uid } from 'uid';

const capitalizeFirstLetter = str => {
  str = str.trim().toLowerCase();

  return `${str[0].toUpperCase()}${str.slice(1)}`;
};

const getExtendedData = ({ name, dateOfBirth, purpose }) => {
  const [firstName, lastName] = name.split(/\s+/).map(capitalizeFirstLetter);

  return {
    id: uid(10),
    firstName,
    lastName,
    dateOfBirth,
    age: Math.floor(
      (new Date().getTime() -
        new Date(
          dateOfBirth
            .split(/\s|\.|-/)
            .reverse()
            .join('-'),
        ).getTime()) /
        31536000000,
    ),
    purpose: capitalizeFirstLetter(purpose),
  };
};

console.log(
  getExtendedData({
    name: 'kirill LaVroV',
    dateOfBirth: '28.10.1982',
    purpose: 'Изучить node.js',
  }),
);
