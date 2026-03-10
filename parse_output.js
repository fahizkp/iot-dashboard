const fs = require('fs');
const data = JSON.parse(fs.readFileSync('zenzor_data.json', 'utf8'));

console.log(`Array length: ${data.length}`);
data.forEach((deviceData, index) => {
  if (deviceData.length > 0) {
    const first = deviceData[0];
    const deviceId = first.device ? first.device.deviceUniqueID : 'Unknown';
    console.log(`Device[${index}]: ${deviceId}, name: ${first.device ? first.device.name : 'Unknown'}, points: ${deviceData.length}`);
    console.log(`Last point: { temp: ${first.temperature}, lat: ${first.lattitude}, lng: ${first.longitude}, time: ${first.eventTime} }`);
  }
});
