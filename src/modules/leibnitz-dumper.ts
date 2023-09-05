import _ from 'lodash';
import { InternalStatus, SystemRules } from "./leibniz-defs";
import { AnyValue, isMatrix, isNumber, isQuaternion, ypr } from "./leibniz-tensor";

/**
 * Organized data in table view with row names and cell values
 */
export interface DataTable {
    headers: string[];
    cells: number[][];
}

/**
 * Returns the internal status for a time interval simulation steps
 * @param sys the system rules
 * @param dt the time interval
 * @param n the number of steps
 */
export function generateData(sys: SystemRules, dt: number, n: number): DataTable {
    var st = sys.initialStatus();

    var states: InternalStatus[] = [st];
    var time: number[] = [0];
    var t = 0;
    for (var i = 1; i < n; i++) {
        t += dt;
        st = sys.next(st, dt);
        states.push(st);
        time.push(t);
    }

    // Extracts the bodies status for each internal status instant
    const bodyStates = states.map(sys.bodies);
    // Extracts the sorted internal status key for first row
    const keys = _.keys(states[0]).sort();
    // Extracts the full internal status key
    const statusHeaders = _.flatMap(keys, key => headerSuffixes(states[0][key])
        .map(suffix => `${key}${suffix}`));
    // Extracts the headers
    const bodyHeaders = _.flatMap(_.range(0, bodyStates[0].length), i =>
        bodyStates[0][i].rotation
            ? [`P${i}_x`, `P${i}_y`, `P${i}_z`, `P${i}_yaw`, `P${i}_pitch`, `P${i}_roll`]
            : [`P${i}_x`, `P${i}_y`, `P${i}_z`]
    );
    const header = ['t', ...statusHeaders, ...bodyHeaders];

    // Extracts the cell values
    const dataRow = states.map((status, i) => {
        const rs = _.flatMap(keys, k => row(status[k]));
        const rb = _.flatMap(bodyStates[i], body => {
            const p = row(body.position);
            const r = body.rotation ? row(body.rotation) : [];
            return [...p, ...r];
        })
        return [time[i], ...rs, ...rb];
    });
    return { headers: header, cells: dataRow };
}

/**
 * Returns the header name of the composite value
 * @param n the composite value
 */
function headerSuffixes(n: AnyValue): string[] {
    if (isNumber(n)) {
        return [''];
    }
    if (isQuaternion(n)) {
        return ['_yaw', '_pitch', '_roll'];
    }
    if (isMatrix(n)) {
        if (n.cols === 1) {
            return _.range(0, n.rows).map(i => `_${i}`);
        } else {
            return _.flatMap(_.range(0, n.rows), i =>
                _.range(0, n.cols).map(j => `_${i}_${j}`));
        }
    }
    throw new Error(`unexpected value type ${n}`);
}

/**
 * Returns the scalar values array 
 * @param n the composite type
 */
function row(n: AnyValue): number[] {
    if (isNumber(n)) {
        return [n];
    }
    if (isQuaternion(n)) {
        const vect = ypr(n).scaleInPlace(180 / Math.PI);
        return [vect.x, vect.y, vect.z];
    }
    if (isMatrix(n)) {
        if (n.cols === 1) {
            return _.range(0, n.rows).map(i => n.get(i));
        } else {
            return _.flatMap(_.range(0, n.rows), i =>
                _.range(0, n.cols).map(j => n.get(i, j)));
        }
    }
    throw new Error(`unexpected value type ${n}`);
}

/**
 * Returns the csv string of table
 * @param data the data
 */
export function tableToString(data: DataTable): string {
    const headerRow = _.join(data.headers, ',');
    const cellRows = data.cells.map(row => _.join(row.map(x => '' + x), ','));
    return headerRow + '\n\r' + _.join(cellRows, '\n\r');
}
