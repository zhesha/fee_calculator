const fs = require('fs');

function getInput() {
  const fileName = process.argv[2];
  if (!fileName) {
    throw new Error('Please run the program with `node app.js <path>`, and provide a path to a file with input data');
  }
  try {
    const rawData = fs.readFileSync(fileName, 'utf8');
    const data = JSON.parse(rawData);
    return data;
  } catch (err) {
    console.error(`Could not read file ${fileName} or file is not valid JSON`);
    throw err;
  }
}

module.exports = getInput;
