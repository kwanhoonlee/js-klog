const fs = require('fs')

function getBlockList(){
    var files = fs.readdirSync(path.coding)

    return files
}

module.exports = {
    getBlockList : getBlockList
} 