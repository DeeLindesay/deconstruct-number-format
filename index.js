'use strict';


exports = module.exports = function deconstructNumberFormat(requiredFormat) {


  var format= requiredFormat || '-9,999.90';

  format=format.trim(); //ignore leading and trailing spaces
  
  // *********************************************************************************
  // find position and type of negative and contents of prefix and postfix text
  // *********************************************************************************
  
  var negativeType = '', negativeRightSymbol = '', negativeLeftSymbol = '',
      negativeRightPos = -1, negativeLeftPos = -1, 
      absFormat,
      prefix = '', postfix = '';
  
  // brackets as negative
  if (/^([^()]+)?[(]([^09#]+)?[09#., ]+([^)]+)?[)](.+)?$/.exec(format)) {
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
      postfix = format.slice(negativeRightPos+1);
      format = format.slice(0, negativeRightPos);
    } else {
      postfix = format.search(/[^09#,.]([^09#](.+)?)?[)]$/) > -1  ? format.slice(format.search(/[^09#,.]([^09#](.+)?)?[)]$/), format.length-1) : "";
      format = format.slice(0, format.length - postfix.length - 1);
      negativeRightPos = 0;
    }

  } else if (format.indexOf("-") === -1){
    //positive values only
    negativeType = 'none';
    prefix = format.search(/[.,]?[09#]/) > 0 ? format.slice(0, format.search(/[.,]?[09#]/)) : "";
    format = format.slice(prefix.length);
    postfix = format.search(/[^09#,.]([^09#]+|$)/) > -1  ? format.slice(format.search(/[^09#,.]([^09#]+|$)/)) : "";
    format = format.slice(0, format.length-postfix.length);

  } else if (/^([^09#-]+)?-.+$/.exec(format)) {
    //negative symbol to left of number (before or after prefix)
    negativeType = 'left';
    negativeLeftPos = format.indexOf("-");
    negativeLeftSymbol = '-'
    if (negativeLeftPos > 0) { //after prefix
      prefix = format.slice(0, negativeLeftPos);
    } else {
      prefix = format.search(/[.,]?[09#]/) > 0 ? format.slice(1, format.search(/[.,]?[09#]/)) : "";
    }
    format = format.slice(prefix.length+1);
    postfix = format.search(/[^09#,.]([^09#]+|$)/) > -1  ? format.slice(format.search(/[^09#,.]([^09#]+|$)/)) : "";
    format = format.slice(0, format.length-postfix.length);

  } else {
    //negative symbol to right of number (before or after postfix)
    prefix = format.search(/[.,]?[09#]/) > 0 ? format.slice(0, format.search(/[.,]?[09#]/)) : "";
    format = format.slice(prefix.length);
    negativeType = 'right';
    negativeRightSymbol = '-'
    negativeRightPos = format.lastIndexOf("-");
    if (negativeRightPos < format.length-1) { //before postfix
      postfix = format.slice(negativeRightPos+1);
      format = format.slice(0, negativeRightPos);
    } else {
      postfix = format.search(/[^09#,.]([^09#](.+)?)?-$/) > -1  ? format.slice(format.search(/[^09#,.]([^09#](.+)?)?-$/), format.length-1) : "";
      format = format.slice(0, format.length - postfix.length - 1);
      negativeRightPos = 0;
    }
  }

  // *********************************************************************************
  //include spaces with negative symbols
  // *********************************************************************************

  while (negativeLeftPos === 0 && prefix && prefix[0] === ' ') {
    negativeLeftSymbol = negativeLeftSymbol + ' ';
    prefix = prefix.slice(1);
  }

  while (negativeRightPos === 0 && postfix && postfix[postfix.length-1] === ' ') {
    negativeRightSymbol = ' ' + negativeRightSymbol;
    postfix = postfix.slice(0, postfix.length-1);
  }

  while (format.length - format.trimLeft().length > 0) {
    negativeLeftSymbol = negativeLeftSymbol + ' ';
    format = format.slice(1);
  }

  while (format.length - format.trimRight().length > 0) {
    negativeRightSymbol = ' ' + negativeRightSymbol;
    format = format.slice(0, format.length-1);
  }

  var absMask = format;

  // *********************************************************************************
  //find the decimal character and parts of absolute format
  // *********************************************************************************

  var decimalChar = '', decimalsPart = '', integerPart = '', decimalsSeparator = '', integerSeparator = '';
  
  if (format.indexOf('.') > -1) {
    decimalChar = ".";
  } else {
    if (format.indexOf(',') > -1 && format.indexOf(',') === format.lastIndexOf(',')) {
      decimalChar = ',';
    }
  }

  if (decimalChar) {
    decimalsPart = format.slice(format.indexOf(decimalChar)+1);
    integerPart = format.slice(0,format.indexOf(decimalChar));
  } else {
    integerPart = format;
    decimalsPart = '';
  }

  //find the thousands/thousanths separators
  if (integerPart && integerPart.search(/[, ]/) > 0) {
    integerSeparator = integerPart[integerPart.search(/[, ]/)];
    integerPart = integerPart.replace(/[, ]/g, "");
  }

  if (decimalsPart && decimalsPart.search(/[, ]/) > 0) {
    decimalsSeparator = decimalsPart[decimalsPart.search(/[, ]/)];
    decimalsPart = decimalsPart.replace(/[, ]/g, "");
  }

  if ((integerPart.length && !(/^[09#]+$/).exec(integerPart)) || (decimalsPart.length && !(/^[09#]+$/).exec(decimalsPart))) {return false};

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
    postfix: postfix,
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