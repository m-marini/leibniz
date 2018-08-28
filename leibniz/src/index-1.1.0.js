'use strict';

import(/* webpackPreload: true */ 'jquery');
// import Favicon from './Leibniz.jpg';
import { Leibniz } from './leibniz-0.1.1';


const leibniz = new Leibniz();

$(window).on('load', () => leibniz.init('canvasId'));
