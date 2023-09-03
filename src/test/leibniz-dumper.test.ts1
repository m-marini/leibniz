import { generateData, toCsv } from "../modules/leibnitz-dumper";
import { compile } from "../modules/leibniz-compiler";
import { CurrentSysDefVersion, SystemDefinition } from "../modules/leibniz-defs";

test('dump and toCSV', () => {
    const sys: SystemDefinition = {
        version: CurrentSysDefVersion,
        bodies: [{
            position: 'ex',
            rotation: 'i'
        }, {
            position: 'ey',
        }],
        funcs: {},
        initialStatus: {
            s: '0',
            q: 'i',
            v: 'ex',
            m: 'I2'
        },
        transition: {}
    }
    const { rules, errors } = compile(sys);
    const data = generateData(rules, 0.1, 2);
    const csv = toCsv(data, rules);
    expect(csv).toEqual(
        '"m 0,0","m 0,1","m 1,0","m 1,1","q w","q i","q j","q k","s","v 0","v 1","v 2",x 0,y 0,z 0,w 0,i 0,j 0,k 0,x 1,y 1,z 1,w 1,i 1,j 1,k 1\r\n'
        + '1,0,0,1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,,,,\r\n'
        + '1,0,0,1,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,,,,\r\n');
});
