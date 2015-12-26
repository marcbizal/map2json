let chalk = require('chalk');
let path = require('path');
let fs = require('fs');

const FIX_SOIL = true;
const MAP_HEADER = new Buffer('4D415020', 'hex');

// \u2717 ✗
// \u2713 ✓

export default class Map {
    constructor(filepath) {
        this.filename = path.basename(filepath);
        this.dir = path.dirname(filepath);
        this.type = this.filename.split('_')[0].toLowerCase();
        this.width = 0;
        this.height = 0;
        this.data = [];

        fs.readFile(filepath, (error, buffer) => {
            if (error) {
                console.log(chalk.red(`\u2717 Failed to read \'${this.filename}\'...\n`));
                if(error.fileNotFound) {
                    console.log(chalk.red('File Doesn\'t Exist\n'));
                } else if(error.noPermission) {
                    console.log(chalk.red('No Permission\n'));
                } else {
                    console.log(chalk.red('Unknown Error\n'));
                }
            } else {
                let header = new Buffer(4);
                buffer.copy(header);

                if (header.equals(MAP_HEADER)) {
                    let chunkSize = buffer.readUInt32LE(4);
                    this.width = buffer.readUInt32LE(8);
                    this.height = buffer.readUInt32LE(12);

                    console.log(chalk.green(`\u2713 Successfully opened \'${this.filename}\'...`));
                    console.log(`Chunk Size: ${chunkSize}B\nWidth: ${this.width}\nHeight: ${this.height}\n`);

                    let offset = 16; // 16 byte offset.
                    let block = 0;
                    for (let y = 0; y < this.height; y++) {
                        this.data[y] = [];
                        for (let x = 0; x < this.width; x++) {
                            block = buffer.readUInt16LE(offset);
                            offset += 2; // Add 2 bytes to the offset.

                            // In some of the game files ground is actually soil...
                            if (block == 5 && FIX_SOIL) block = 0;

                            this.data[y][x] = block;
                        }
                    }
                } else {
                    console.log(chalk.red(`\u2717 Invalid map file \'${this.filename}\'! Got header \'${header.toString()}\'\n`));
                }
            }
        });
    }
}
