'use strict';

var test = require('testit');
var deconstruct = require('../');
var assert = require('assert');

console.log(deconstruct);

test('deconstruct $(# ###,### #) per year', function () {
  var actual = deconstruct('$(# ###,### #) per year');
  var expected = {
    negativeType: 'brackets',
    negativeLeftPos: 1,
    negativeRightPos: 11,
    negativeLeftSymbol: '(',
    negativeRightSymbol: ')',
    postfix: ' per year',
    prefix: '$',
    absMask: '# ###,### #',
    decimalChar: ',',
    integerSeparator: ' ',
    decimalsSeparator: ' ',
    padLeft: -1,
    maxLeft: -1,
    padRight: -1,
    maxRight: -1
  };
  assert.deepEqual(actual, expected);
});


test('deconstruct $( 9 ###,### 0 ) per month', function () {
  var actual = deconstruct('$( 9 ###,### 0 ) per month');
  var expected = {
    negativeType: 'brackets',
    negativeLeftPos: 1,
    negativeRightPos: 13,
    negativeLeftSymbol: '( ',
    negativeRightSymbol: ' )',
    postfix: ' per month',
    prefix: '$',
    absMask: '9 ###,### 0',
    decimalChar: ',',
    integerSeparator: ' ',
    decimalsSeparator: ' ',
    padLeft: -1,
    maxLeft: 4,
    padRight: 4,
    maxRight: 4
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct ( $0##.##0 )/m', function () {
  var actual = deconstruct('( $0##.##0 )/m');
  var expected = {
    negativeType: 'brackets',
    negativeLeftPos: 0,
    negativeRightPos: 8,
    negativeLeftSymbol: '( ',
    negativeRightSymbol: ' )',
    postfix: '/m',
    prefix: '$',
    absMask: '0##.##0',
    decimalChar: '.',
    integerSeparator: '',
    decimalsSeparator: '',
    padLeft: 3,
    maxLeft: 3,
    padRight: 3,
    maxRight: 3
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct (#,###. years)', function () {
  var actual = deconstruct('(#,###. years)');
  var expected = {
    negativeType: 'brackets',
    negativeLeftPos: 0,
    negativeRightPos: 0,
    negativeLeftSymbol: '(',
    negativeRightSymbol: ')',
    postfix: ' years',
    prefix: '',
    absMask: '#,###.',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: -1,
    padRight: -1,
    maxRight: 0
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct (#,##0.0#)', function () {
  var actual = deconstruct('(#,##0.0#)');
  var expected = {
    negativeType: 'brackets',
    negativeLeftPos: 0,
    negativeRightPos: 0,
    negativeLeftSymbol: '(',
    negativeRightSymbol: ')',
    postfix: '',
    prefix: '',
    absMask: '#,##0.0#',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: 1,
    maxLeft: -1,
    padRight: 1,
    maxRight: -1
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct - £9,999.00 /m', function () {
  var actual = deconstruct('- £9,999.00 /m');
  var expected = {
    negativeType: 'left',
    negativeLeftPos: 0,
    negativeRightPos: -1,
    negativeLeftSymbol: '- ',
    negativeRightSymbol: '',
    postfix: ' /m',
    prefix: '£',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});


test('deconstruct - £9,999.00 /m\u00B2', function () {
  var actual = deconstruct('- £9,999.00 /m\u00B2');
  var expected = {
    negativeType: 'left',
    negativeLeftPos: 0,
    negativeRightPos: -1,
    negativeLeftSymbol: '- ',
    negativeRightSymbol: '',
    postfix: ' /m\u00B2',
    prefix: '£',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});



test('deconstruct - £9,999.00m', function () {
  var actual = deconstruct('- £9,999.00m');
  var expected = {
    negativeType: 'left',
    negativeLeftPos: 0,
    negativeRightPos: -1,
    negativeLeftSymbol: '- ',
    negativeRightSymbol: '',
    postfix: 'm',
    prefix: '£',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct £ - 9,999.09 (/m)', function () {
  var actual = deconstruct('£ - 9,999.09(/m)');
  var expected = {
    negativeType: 'left',
    negativeLeftPos: 2,
    negativeRightPos: -1,
    negativeLeftSymbol: '- ',
    negativeRightSymbol: '',
    postfix: '(/m)',
    prefix: '£ ',
    absMask: '9,999.09',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 1,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});


test('deconstruct -9,999.00', function () {
  var actual = deconstruct('-9,999.00');
  var expected = {
    negativeType: 'left',
    negativeLeftPos: 0,
    negativeRightPos: -1,
    negativeLeftSymbol: '-',
    negativeRightSymbol: '',
    postfix: '',
    prefix: '',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct £9,999.00m -', function () {
  var actual = deconstruct('£9,999.00m -');
  var expected = {
    negativeType: 'right',
    negativeLeftPos: -1,
    negativeRightPos: 0,
    negativeLeftSymbol: '',
    negativeRightSymbol: ' -',
    postfix: 'm',
    prefix: '£',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct £9,999.00 /m -', function () {
  var actual = deconstruct('£9,999.00 /m -');
  var expected = {
    negativeType: 'right',
    negativeLeftPos: -1,
    negativeRightPos: 0,
    negativeLeftSymbol: '',
    negativeRightSymbol: ' -',
    postfix: ' /m',
    prefix: '£',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});


test('deconstruct £ 9,999.09 - (/m)', function () {
  var actual = deconstruct('£ 9,999.09 - (/m)');
  var expected = {
    negativeType: 'right',
    negativeLeftPos: -1,
    negativeRightPos: 9,
    negativeLeftSymbol: '',
    negativeRightSymbol: ' -',
    postfix: ' (/m)',
    prefix: '£ ',
    absMask: '9,999.09',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 1,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});


test('deconstruct 9,999.00-', function () {
  var actual = deconstruct('9,999.00-');
  var expected = {
    negativeType: 'right',
    negativeLeftPos: -1,
    negativeRightPos: 0,
    negativeLeftSymbol: '',
    negativeRightSymbol: '-',
    postfix: '',
    prefix: '',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct £9,999. /m.', function () {
  var actual = deconstruct('£9,999. /m.');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: ' /m.',
    prefix: '£',
    absMask: '9,999.',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: -1,
    maxRight: 0
  };
  assert.deepEqual(actual, expected);
});


test('deconstruct £ #,##0.09 (/m)', function () {
  var actual = deconstruct('£ #,##0.09 (/m)');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: ' (/m)',
    prefix: '£ ',
    absMask: '#,##0.09',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: 1,
    maxLeft: -1,
    padRight: 1,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});


test('deconstruct 9,999.00m', function () {
  var actual = deconstruct('9,999.00m');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: 'm',
    prefix: '',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct 9,999.00 m', function () {
  var actual = deconstruct('9,999.00 m');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: ' m',
    prefix: '',
    absMask: '9,999.00',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: -1,
    maxLeft: 4,
    padRight: 2,
    maxRight: 2
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct 9,999,000', function () {
  var actual = deconstruct('9,999,000');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: '',
    prefix: '',
    absMask: '9,999,000',
    decimalChar: '',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: 3,
    maxLeft: 7,
    padRight: -1,
    maxRight: 0
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct 0,999', function () {
  var actual = deconstruct('0,999');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: '',
    prefix: '',
    absMask: '0,999',
    decimalChar: ',',
    integerSeparator: '',
    decimalsSeparator: '',
    padLeft: 1,
    maxLeft: 1,
    padRight: -1,
    maxRight: 3
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct 0,999 999', function () {
  var actual = deconstruct('0,999 999');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: '',
    prefix: '',
    absMask: '0,999 999',
    decimalChar: ',',
    integerSeparator: '',
    decimalsSeparator: ' ',
    padLeft: 1,
    maxLeft: 1,
    padRight: -1,
    maxRight: 6
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct 0,999.999', function () {
  var actual = deconstruct('0,999.999');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: '',
    prefix: '',
    absMask: '0,999.999',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: 4,
    maxLeft: 4,
    padRight: -1,
    maxRight: 3
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct 0,999.', function () {
  var actual = deconstruct('0,999.');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: '',
    prefix: '',
    absMask: '0,999.',
    decimalChar: '.',
    integerSeparator: ',',
    decimalsSeparator: '',
    padLeft: 4,
    maxLeft: 4,
    padRight: -1,
    maxRight: 0
  };
  assert.deepEqual(actual, expected);
});

test('deconstruct .###,###', function () {
  var actual = deconstruct('.###,###');
  var expected = {
    negativeType: 'none',
    negativeLeftPos: -1,
    negativeRightPos: -1,
    negativeLeftSymbol: '',
    negativeRightSymbol: '',
    postfix: '',
    prefix: '',
    absMask: '.###,###',
    decimalChar: '.',
    integerSeparator: '',
    decimalsSeparator: ',',
    padLeft: -1,
    maxLeft: 0,
    padRight: -1,
    maxRight: -1
  };
  assert.deepEqual(actual, expected);
});