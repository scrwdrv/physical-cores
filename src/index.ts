import * as os from 'os';
import { execSync } from 'child_process';

let physicalCores = 0;

switch (os.platform()) {
    case 'linux':
        physicalCores = parseInt(exec('lscpu -p | egrep -v "^#" | sort -u -t, -k 2,4 | wc -l').trim(), 10)
        break;
    case 'darwin':
        physicalCores = parseInt(exec('sysctl -n hw.physicalcpu_max').trim(), 10)
        break;
    case 'win32':
        physicalCores = exec('WMIC CPU Get NumberOfCores')
            .split(os.EOL)
            .map((line) => { return parseInt(line) })
            .filter((value) => { return !isNaN(value) })
            .reduce((sum, number) => { return sum + number }, 0);
        break;
    default:
        physicalCores = os.cpus().filter((cpu, index) => {
            return !cpu.model.includes('Intel') || index % 2 === 1
        }).length;
}


module.exports = physicalCores;

function exec(cmd: string) {
    return execSync(cmd, { encoding: 'utf8' })
}