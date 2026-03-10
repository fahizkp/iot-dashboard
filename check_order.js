const fs = require('fs');
const data = JSON.parse(fs.readFileSync('zenzor_data.json', 'utf8'));

if (data.length > 0 && data[0].length > 0) {
  const points = data[0];
  console.log(`First point: ${points[0].eventTime}`);
  console.log(`Last point: ${points[points.length-1].eventTime}`);
}
