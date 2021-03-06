'use strict';


exports = module.exports = function deconstructNumberFormat(requiredFormat) {


  var format= requiredFormat || '-9,999.90';

  format=format.trim(); //ignore leading and trailing spaces
  
  // *********************************************************************************
  // find position and type of negative and contents of prefix and suffix text
  // *********************************************************************************
  
  var negativeType = '', negativeRightSymbol = '', negativeLeftSymbol = '',
      negativeRightPos = -1, negativeLeftPos = -1, 
      absFormat,
      prefix = '', suffix = '';
  
  // brackets as negative
  if (/^([^()]+)?[(]([^09#]+)?[09#., ]+([^)]+)?[)](.+)?$/.test(format)) {
    negativeType = 'brackets';
    negativeLeftPos = format.indexOf("(");
    negativeLeftSymbol = '('
    if (negativeLeftPos > 0) { //after prefix
      prefix = format.slice(0, negativeLeftPos);
    } else {
      prefix = format.search(/0|9|#/) > 0 ? format.slice(1, format.search(/0|9|#/)) : "";
    }
    format = format.slice(prefix.length+1);

    negativeRightPos = format.indexOf(")");
    negativeRightSymbol = ')'
    if (negativeRightPos < format.length-1) { //before prefix
      suffix = format.slice(negativeRightPos+1);
      format = format.slice(0, negativeRightPos);
    } else {
      suffix = format.search(/[^09#,.]([^09#](.+)?)?[)]$/) > -1  ? format.slice(format.search(/[^09#,.]([^09#](.+)?)?[)]$/), -1) : "";
      format = format.slice(0, format.length - suffix.length - 1);
      negativeRightPos = 0;
    }

  } else if (format.indexOf("-") === -1){
    //positive values only
    negativeType = 'none';
    prefix = format.search(/[.,]?[09#]/) > 0 ? format.slice(0, format.search(/[.,]?[09#]/)) : "";
    format = format.slice(prefix.length);
    suffix = format.search(/[^09#,.]([^09#]+|$)/) > -1  ? format.slice(format.search(/[^09#,.]([^09#]+|$)/)) : "";
    format = format.slice(0, format.length-suffix.length);

  } else if (/^([^09#-]+)?-.+$/.test(format)) {
    //negative symbol to left of number (before or after prefix)
    negativeType = 'left';
    negativeLeftPos = format.indexOf("-");
    negativeLeftSymbol = '-'
    if (negativeLeftPos > 0) { //after prefix
      prefix = format.slice(0, negativeLeftPos);
    } else {
      prefix = format.search(/[09#]/) > 0 ? format.slice(1, format.search(/[09#]/)) : "";
    }
    format = format.slice(prefix.length+1);
    suffix = format.search(/[^09#,.]([^09#]+|$)/) > -1  ? format.slice(format.search(/[^09#,.]([^09#]+|$)/)) : "";
    format = format.slice(0, format.length-suffix.length);

  } else {
    //negative symbol to right of number (before or after suffix)
    prefix = format.search(/[09#]/) > 0 ? format.slice(0, format.search(/[09#]/)) : "";
    format = format.slice(prefix.length);
    negativeType = 'right';
    negativeRightSymbol = '-'
    negativeRightPos = format.lastIndexOf("-");
    if (negativeRightPos < format.length-1) { //before suffix
      suffix = format.slice(negativeRightPos+1);
      format = format.slice(0, negativeRightPos);
    } else {
      suffix = format.search(/[^09#,.]([^09#](.+)?)?-$/) > -1  ? format.slice(format.search(/[^09#,.]([^09#](.+)?)?-$/), format.length-1) : "";
      format = format.slice(0, format.length - suffix.length - 1);
      negativeRightPos = 0;
    }
  }

  // *********************************************************************************
  //include spaces with negative symbols
  // *********************************************************************************

  //When negative is before prefix move spaces from start of prefix to end of negative symbol
  while (negativeLeftPos === 0 && prefix && prefix[0] === ' ') {
    negativeLeftSymbol = negativeLeftSymbol + ' ';
    prefix = prefix.slice(1);
  }

  //When negative follows suffix move spaces end of suffix to start of negative symbol
  while (negativeRightPos === 0 && suffix && suffix[suffix.length-1] === ' ') {
    negativeRightSymbol = ' ' + negativeRightSymbol;
    suffix = suffix.slice(0, -1);
  }

  //When negative follows prefix move spaces from start of format to end of negative symbol
  while (negativeLeftPos > 0 && format.length && format[0] === ' ') {
    negativeLeftSymbol = negativeLeftSymbol + ' ';
    format = format.slice(1);
  }

  //When negative before suffix move spaces from end of format to start of negative symbol
  while (negativeRightPos > 0 && format.length && format[format.length-1] === ' ') {
    negativeRightSymbol = ' ' + negativeRightSymbol;
    format = format.slice(0, -1);
  }

  var absMask = format;

  // *********************************************************************************
  //find the decimal character and parts of absolute format
  // *********************************************************************************

  var decimalChar = '', decimalsPart = '', integerPart = '', decimalsSeparator = '', integerSeparator = '';

  //if last char is a ',' and there are no other commas then use this as decimal point
  if (format[format.length-1] === ',' && format.indexOf(',') === format.length-1) {
    decimalChar = ',';
  //otherwise use consider '.'
  } else if (format.indexOf('.') > -1) {
    if (format.indexOf('.') === format.lastIndexOf('.')) {
      decimalChar = ".";
    } else {
      // two of '.' means this must be the separator, so assume  ',' is the decimal
      decimalChar = ',';
    }
  //otherwise use ',' if it exists and there is only one
  } else if (format.indexOf(',') > -1) {
    if (format.indexOf(',') === format.lastIndexOf(',')) {
      decimalChar = ',';
    } else {
      decimalChar = '.';
    }
  }

  if (decimalChar && format.indexOf(decimalChar)>-1) {
    decimalsPart = format.slice(format.indexOf(decimalChar)+1);
    integerPart = format.slice(0,format.indexOf(decimalChar));
  } else {
    integerPart = format;
    decimalsPart = '';
  }

  while (decimalsPart.length && decimalsPart.search(/[., ]$/) > -1) {
    decimalsPart = decimalsPart.slice(0, -1);
  }

  while (integerPart.length && integerPart[0].search(/[., ]/) > -1) {
    integerPart = integerPart.slice(1);
  }

  //find the thousands/thousanths separators
  if (integerPart && integerPart.search(/[., ]/) > 0) {
    integerSeparator = integerPart[integerPart.search(/[., ]/)];
    integerPart = integerPart.replace(/[., ]/g, "");
  }

  if (decimalsPart && decimalsPart.search(/[., ]/) > 0) {
    decimalsSeparator = decimalsPart[decimalsPart.search(/[., ]/)];
    decimalsPart = decimalsPart.replace(/[., ]/g, "");
  }

  if ((integerPart.length && !(/^[09#]+$/).test(integerPart)) || (decimalsPart.length && !(/^[09#]+$/).test(decimalsPart))) {return false};

  // *********************************************************************************
  //resolve length and padding
  // *********************************************************************************

  var padLeft, maxLeft, padRight, maxRight;
  padLeft = integerPart.indexOf("0") >= 0 ? integerPart.length - integerPart.indexOf("0") : -1;
  maxLeft = integerPart.length === 0 ||integerPart[0] === "0" || integerPart[0] === "9" ? integerPart.length : -1;
  padRight = decimalsPart.indexOf("0") >= 0 ? decimalsPart.lastIndexOf("0")+1 : -1;
  maxRight = decimalsPart.length === 0 || decimalsPart[decimalsPart.length-1] === "0" || decimalsPart[decimalsPart.length-1] === "9" ? decimalsPart.length : -1;

  // *********************************************************************************
  // output
  // *********************************************************************************

  var deconstructedFormat = {
    negativeType: negativeType,
    negativeLeftPos: negativeLeftPos,
    negativeRightPos: negativeRightPos,
    negativeLeftSymbol: negativeLeftSymbol,
    negativeRightSymbol: negativeRightSymbol,
    suffix: suffix,
    prefix: prefix,
    absMask: absMask,
    decimalChar: decimalChar,
    integerSeparator: integerSeparator,
    decimalsSeparator: decimalsSeparator,
    padLeft: padLeft,
    maxLeft: maxLeft,
    padRight: padRight,
    maxRight: maxRight
  }

  return deconstructedFormat;
};