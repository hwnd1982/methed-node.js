const {getExtendedData} = require('extended-data');

console.log(
  'ExtendedData: ',
  getExtendedData(
    {
      name: 'kirill  lavrov',
      dateOfBirth: '28.10.1982',
      purpose: 'карьерный рост'
    }
  )
);
