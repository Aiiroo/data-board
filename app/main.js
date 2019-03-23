import React from 'react';
import ReactDOM from 'react-dom';
import Factory from './component/factory.js';
import Promise from 'promise-polyfill';
import {getUrlParam} from './utils/BaseUtils';
import './assets/main.less';

Object.assign = Object.assign || function(target, varArgs) {
	if (target == null) {
		throw new TypeError('Cannot convert undefined or null to object');
	}

	var to = Object(target);

	for (var index = 1; index < arguments.length; index++) {
		var nextSource = arguments[index];

		if (nextSource != null) {
			for (var nextKey in nextSource) {
				if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
					to[nextKey] = nextSource[nextKey];
				}
			}
		}
	}
	return to;
};
// To add to window  
if (!window.Promise) {
	window.Promise = Promise;
}

let code = getUrlParam('code');
let index = getUrlParam('index');

ReactDOM.render(
    <Factory code={code} index={index} />,
( document.getElementById('root')));

  