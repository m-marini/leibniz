import _ from 'lodash';
import { InternalStatus, SystemRules } from "./leibniz-defs";
import { AnyValue, isMatrix, isNumber, isQuaternion } from "./leibniz-tensor";

/**
 * 
 * @param sys 
 * @param dt 
 * @param n 
 */
export function generateData(sys: SystemRules, dt: number, n: number): InternalStatus[] {
    var st = sys.initialStatus();

    var states: InternalStatus[] = [st];
    for (var i = 1; i < n; i++) {
        st = sys.next(st, dt);
        states.push(st);
    }
    return states;
}

function headers(n: AnyValue): string[] {
    if (isNumber(n)) {
        return [''];
    }
    if (isQuaternion(n)) {
        return [' w', ' i', ' j', ' k'];
    }
    if (isMatrix(n)) {
        if (n.cols === 1) {
            return _.range(0, n.rows).map(i => ` ${i}`);
        } else {
            return _.flatMap(_.range(0, n.rows), i =>
                _.range(0, n.cols).map(j => ` ${i},${j}`));
        }
    }
    throw new Error(`unexpected value type ${n}`);
}

function row(n: AnyValue): string[] {
    if (isNumber(n)) {
        return [`${n}`];
    }
    if (isQuaternion(n)) {
        return [`${n.w}`, `${n.x}`, `${n.y}`, `${n.z}`];
    }
    if (isMatrix(n)) {
        if (n.cols === 1) {
            return _.range(0, n.rows).map(i => `${n.get(i)}`);
        } else {
            return _.flatMap(_.range(0, n.rows), i =>
                _.range(0, n.cols).map(j => `${n.get(i, j)}`));
        }
    }
    throw new Error(`unexpected value type ${n}`);
}

/**
 * 
 * @param data
 */
export function toCsv(data: InternalStatus[], sys: SystemRules): string {
    const bodies = data.map(sys.bodies);
    const ks = _.keys(data[0]).sort();
    const hs = _.flatMap(ks, key => headers(data[0][key]).map(sfx => `"${key}${sfx}"`));
    const hb = _.flatMap(_.range(0, bodies[0].length), i =>
        [`x ${i}`, `y ${i}`, `z ${i}`, `w ${i}`, `i ${i}`, `j ${i}`, `k ${i}`]
    );
    const header = _.concat(hs, hb).join(',');
    const dataRows = data.map((status, i) => {
        const rs = _.flatMap(ks, k => row(status[k]));
        const rb = _.flatMap(bodies[i], body => {
            const p = row(body.position);
            const r = body.rotation ? row(body.rotation) : ['', '', '', ''];
            return _.concat(p, r);
        })
        return _.concat(rs, rb).join(',');
    });
    const result= _.concat(header, dataRows).join('\r\n') + '\r\n';
    return result;
}
