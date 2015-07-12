'use strict';


exports = module.exports = function deconstructNumberFormat(requiredFormat) {


  var format= requiredFormat || '-9,999.90';


  //find position and type of negative and contents of prefix and postfix text
  format=format.trim();
  var negativeType, negativeRightPos, negativeLeftPos, absFormat, prefix, postfix;
  if (/^([^()]+)?[(]([^09#]+)?[09#., ]+([^)]+)?[)](.+)?$/.exec(format)) {
    negativeType = 'brackets';
    negativeLeftPos = format.indexOf("(");
    if (negativeLeftPos > 0) {
      prefix = format.slice(0, negativeLeftPos);
    } else {
      prefix = format.search(/0|9|#/) > 0 ? format.slice(1, format.search(/0|9|#/)) : "";
    }
    format = format.slice(prefix.length+1);

    negativeRightPos = format.indexOf(")");
    if (negativeRightPos < format.length-1) {
      postfix = format.slice(negativeRightPos+1);
      format = format.slice(0, negativeRightPos);
    } else {
      postfix = format.search(/[^09#,. ]([^09#](.+)?)?[)]$/) > -1  ? format.slice(format.search(/[^09#,. ]([^09#](.+)?)?[)]$/), format.length-1) : "";
      format = format.slice(0, format.length - postfix.length - 1);
      negativeRightPos = 0;
    }

  } else if (format.indexOf("-") === -1){
    negativeType = 'none';

  } else if (/^([^09#-]+)?-.+$/.exec(format)) {
    negativeType = 'left';
    negativeLeftPos = format.indexOf("-");
    if (negativeLeftPos > 0) {
      prefix = format.slice(0, negativeLeftPos);
    } else {
      prefix = format.search(/0|9|#/) > 0 ? format.slice(1, format.search(/0|9|#/)) : "";
    }
    format = format.slice(prefix.length+1);
    postfix = format.search(/[^09#,. ][^09#]?/) > -1  ? format.slice(format.search(/[^09#,. ][^09#]?/)) : "";
    format = format.slice(0, format.length-postfix.length);

  } else {
    prefix = format.search(/0|9|#/) > 0 ? format.slice(0, format.search(/0|9|#/)) : "";
    format = format.slice(prefix.length);
    negativeType = 'right';
    negativeRightPos = format.lastIndexOf("-");
    if (negativeRightPos < format.length-1) {
      postfix = format.slice(negativeRightPos+1);
      format = format.slice(0, negativeRightPos);
    } else {
      postfix = format.search(/[^09#,.]([^09#](.+)?)?-$/) > -1  ? format.slice(format.search(/[^09#,.]([^09#](.+)?)?-$/), format.length-1) : "";
      format = format.slice(0, format.length - postfix.length - 1);
      negativeRightPos = 0;
    }
  }

  //record and trim extra spaces
  var leftSpaces, rightSpaces

  leftSpaces = format.length - format.trimLeft().length
  format = format.trimLeft();
  rightSpaces = format.length - format.trimRight().length
  format = format.trimRight();

  //find the decimal character and parts of format

  var decimalChar, decimalsPart = '', integerPart = '', decimalsSeparator, integerSeparator;
  if (format.search(/[.,]([09# ]+)?$/) > 0) {
    decimalChar = format[format.search(/[.,]([09# ]+)?$/)];
    if (format.indexOf(decimalChar) !== format.lastIndexOf(decimalChar)) {
      decimalChar = decimalChar === ',' ? decimalChar = '.' : ','
      if (format.indexOf(decimalChar) !== format.lastIndexOf(decimalChar)) {decimalChar = null}
    };

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

  //resolve length and padding
  var padLeft, maxLeft, padRight, maxRight;
  padLeft = integerPart.indexOf("0") >= 0 ? integerPart.length - integerPart.indexOf("0") : null;
  maxLeft = integerPart[0] === "0" || integerPart[0] === "9" ? integerPart.length : null;
  padRight = decimalsPart.indexOf("0") >= 0 ? decimalsPart.lastIndexOf("0")+1 : null;
  maxRight = decimalsPart.length <= 0 ? 0 : (decimalsPart[decimalsPart.length-1] === "0" || decimalsPart[decimalsPart.length-1] === "9" ? decimalsPart.length : null);

  var deconstructedFormat = {
    negativeType: negativeType,
    negativeRightPos: negativeRightPos,
    negativeLeftPos: negativeLeftPos,
    postfix: postfix,
    prefix: prefix,
    leftSpaces: leftSpaces,
    rightSpaces: rightSpaces,
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