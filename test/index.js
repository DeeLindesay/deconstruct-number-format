'use strict';

var test = require('testit');
var deconstruct = require('../');
var assert = require('assert');

console.log(deconstruct);

test('deconstruct', function () {
  var actual = deconstruct('-£9,999.00 /m');
  var expected = {
    negativeType: 'left',
    negativeRightPos: undefined,
    negativeLeftPos: 0,
    postfix: '/m',
    prefix: '£',
    leftSpaces: 0,
    rightSpaces: 1,
    mask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: undefined,
    padLeft: null,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  }
  console.log(actual);
  console.log(expected);
  assert.deepEqual(actual, expected);
});

test('deconstruct', function () {
  var actual = deconstruct('(# ##0,000 0) years');
  var expected = {
    negativeType: 'brackets',
    negativeRightPos: 11,
    negativeLeftPos: 0,
    postfix: ' years',
    prefix: '',
    leftSpaces: 0,
    rightSpaces: 0,
    mask: '# ##0,000 0',
    decimalChar: ',',
    integerSeparator: ' ',
    decimalsSeparator: ' ',
    padLeft: 1,
    maxLeft: null,
    padRight: 4,
    maxRight: 4
  }
  console.log(actual);
  console.log(expected);
  assert.deepEqual(actual, expected);
});