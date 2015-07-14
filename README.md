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
- negativeType: 'right', 'left', 'brackets', 'none'
- negativeRightPos: 0 if right negative or bracket is at end of expression, >0 if right/bracket is followed by postfix; -1 no right negative
- negativeLeftPos: 0 if right negative or bracket is at start expression, >0 if right/bracket follows prefix; -1 no left negative
- postfix: text characters after number; can be ''
- prefix: text characters before number (cannot include 0,9,#); can be ''
- negativeLeftSymbol: left hand negative symbol (may include trailing spaces), eg '(', '( ', '- '
- negativeRightSymbol: right hand negative symbol (may include leading spaces), eg ')', ' )', ' -'
- decimalChar: character repesenting decimal (. or ,)
- integerSeparator: separator of thousands (space or ,); empty string if no separator
- decimalsSeparator: separator of thousanths (space or ,); empty string if no separator
- padLeft: padding front of number, based on first postition of a zero; -1 = no padding
- maxLeft: max places permitted before the dp, based on 9 or 0 in first position; -1 = no max
- padRight: zero padding required to right of dp, based on last postition of a zero; -1 = no padding
- maxRight: max places permitted after the dp, based on 0 or 9 in last position, can be 0 (integer only); -1 = no max

Notes:
- For numbers such as 8,345 where the comma is a thousands separator use a trailing decimal point eg 9,999. otherwise ',' will be interpreted as the decimal point.


Does not work for:
- structured reference numbers, eg 9999-9999
- ignores and removes leading and trailing spaces (but retains those between pre/post fix and negative symbols etc)