'use strict';

var test = require('testit');
var deconstruct = require('../');
var assert = require('assert');

console.log(deconstruct);

test('deconstruct.deconstructNumberFormat', function () {
  var actual = deconstruct.deconstructNumberFormat('-£9,999.00 /m');
  var expected = {
    negativeType: 'left',
    negativeRightPos: 9999,
    negativeLeftPos: 0,
    postfix: ' /m',
    prefix: '£',
    leftSpaces: 0,
    rightSpaces: 0,
    decimalChar: ',',
    integerSeparator: ',',
    decimalsSeparator: 9999,
    padLeft: 4,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  }
  console.log(actual);
  console.log(expected);
});