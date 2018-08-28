'use strict';

import(/* webpackPreload: true */ 'jquery');
import { SystemParser } from "./leibniz-ast-0.1.0.js";

const conf = {
    "funcs": {
        "r": "1",
        "omega00": "2*PI",
        "omega01": "2*PI/2",
        "omega02": "2*PI/4",
        "omega10": "2*PI/0.3",
        "omega11": "2*PI/0.5",
        "omega12": "2*PI/0.7",
        "axis0": "ex",
        "axis1": "ey",
        "axis2": "ez"
    },
    "vars": {
        "theta0": "0",
        "theta1": "0.1",
        "theta2": "0.2",
        "phi0": "0",
        "phi1": "0",
        "phi2": "0"
    },
    "update": {
        "phi0": "phi0 + omega00 * dt",
        "phi1": "phi1 + omega01 * dt",
        "phi2": "phi2 + omega02 * dt",
        "theta0": "theta0 + omega10 * dt",
        "theta1": "theta1 + omega11 * dt",
        "theta2": "theta2 + omega12 * dt",
    },
    "bodies": [
        {
            "position": "r * (cos(phi0) * ex + sin(phi0) * ey)",
            "rotation": "qrot(axis0 * theta0)"
        },
        {
            "position": "r * (cos(phi1) * ex + sin(phi1) * ey)",
            "rotation": "qrot(axis1 * theta1)"
        },
        {
            "position": "r * (cos(phi2) * ex + sin(phi2) * ey)",
            "rotation": "qrot(axis1 * theta1)"
        }
    ]
};

var system = undefined;
var result = undefined;

function createReport() {
    const resultText = JSON.stringify(result, null, 2)
    const errorsText = JSON.stringify(result.errors, null, 2);
    const systemText = JSON.stringify(system, null, 2);
    const bodiesText = JSON.stringify(system ? system.bodies : undefined, null, 2);
    $('#resultReport').html(resultText);
    $('#systemReport').html(systemText);
    $('#bodiesReport').html(bodiesText);
    $('#errorsReport').html(errorsText);
}

function parse() {
    const confStr = $('#conf').val();
    try {
        const conf = JSON.parse(confStr);
        const p = new SystemParser(conf);
        result = p.parse(conf);
        system = result.system;
        createReport();
    } catch (ex) {
        console.trace(ex);
        $('#report').html(ex.toString());
    }
}

function onNext() {
    if (system) {
        system = system.next(1);
        createReport();
    }
}

$(window).on('load', () => {
    $('#update').on('click', onNext);
    $('#conf').on('input', parse);
    $('#conf').val(JSON.stringify(conf, null, 2));
    parse();
});
