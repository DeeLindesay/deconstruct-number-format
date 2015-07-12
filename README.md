# deconstruct-number-format
To deconstruct a number format eg '-£#,##0.##0 /m', '(33 years)', '$ -99.00' and return a set of parameters to describe the format.

Accepts:
- negative signs before or after prefix text
- brackets as negative signs
- prefix and postfix texts
- . or , as decimal point
- space or , as thousand separators
- space or , as thousanths separators
- #,9 or 0 as number holders

Returns:
- negativeType: 'right', 'left', 'brackets'
- negativeRightPos: 0 if right negative or bracket is at end of expression, >0 if right/bracket is followed by postfix
- negativeLeftPos: 0 if right negative or bracket is at start expression, >0 if right/bracket follows prefix
- postfix: text characters after number (cannot include 0,9,#)
- prefix: text characters before number (cannot include 0,9,#)
- leftSpaces: between prefix/negative and number
- rightSpaces: between number and postfix/negative 
- decimalChar: character repesenting decimal (. or ,)
- integerSeparator: separator of thousands (space or ,)
- decimalsSeparator: separator of thousanths (space or ,)
- padLeft: padding front on number, based on first postition of a zero
- maxLeft: max places permitted before the dp, based on the first 9 or 0
- padRight: zeros required to right of dp, based on last postition of a zero
- maxRight: max places permitted after the dp, based on the last 0 or 9 (can be 0 (integer only) or undefined(no max))
