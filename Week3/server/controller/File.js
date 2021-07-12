const fs = require('fs');

module.exports = {
    get: (location) => JSON.parse(fs.readFileSync(location)),
    write: (location, data) => {
        fs.writeFile(location, data, (err) => {
            if (err) throw err;
        })
    },
    add: (location, data) => {
        fs.appendFile(location, data, 'utf8', (err) => {
            if (err) throw err;
        })
    }
}