/**
* Returns object with public interface:
* * increment, decrement, forIncrement, forDecrement, compare
*
* @param {(string|Array<string>)} symbols Symbols for iterable. 
* * ex: 'abc' OR ['a','b','c']
*/
function createSymbIterator(symbols) {
	// parse symbols
	if(typeof symbols === 'string') {
		symbols = symbols.split('');
	}
	if(!Array.isArray(symbols) || symbols.length === 0) {
		throw new Error('A symbols parameter is incorrect');
	}
	
	// private functions
	function createWorkSymbols(arr) {
		var res = {};
		for(var i=0; i < arr.length; res[arr[i]] = i++);
		return res;
	}
	
	function valueToWorkNum(value, workSymbols, valueName) {
		var arr = value.split('');
		var res = [];
		for(var i=0; i < arr.length; i++) {
			if(workSymbols[arr[i]] !== undefined) {
				res.push(workSymbols[arr[i]]);
			}
			else {
				throw new Error('"' + valueName + '" parameter is incorrect. \nValue must have only symbols : "' + symbols.join(' ') + '"');
			}
		}
		return res;
	}
	function workNumToValue(num, symbols) {
		var res = '';
		for(var i=0; i < num.length; i++) {
			res += symbols[num[i]];
		}
		return res;
	}
	
	function compareWorkNums(num1, num2) {
		if(num1.length !== num2.length) {
			return num1.length > num2.length ? 1 : -1;
		}		
		for(var i=0; i < num1.length; i++) {
			if(num1[i] === num2[i]) {
				continue;
			}
			else {
				return num1[i] > num2[i] ? 1 : -1;
			}
		}
		return 0;
	}	
	function checkInc(num, ind, max) {
		if(num[ind] === max) {
			num[ind] = 0;		
			if(ind === 0) {
				num.push(0);
				return 1;
			}
			else {		
				ind--;
				num[ind]++;			
				var res = checkInc(num, ind, max);
				return res === 0 ? -1 : res;
			}
		}
		return 0;
	}	
	function checkDec(num, ind, max) {
		if(num[ind] === -1) {	
			if(ind === 0) {
				num[ind] = 0;
			}
			else {	
				if(num[ind-1] === 0) {
					num.pop();
					ind--;
					for(var i=ind; num[i] === 0; num[i] = max, i--);
					return 1;
				}
				else {
					num[ind] = max;
					num[ind-1]--;
				}
			}			
		}
		return 0;
	}
	function iter(value, n) {
		var func = n > 0 ? checkInc : checkDec;
		var num = valueToWorkNum(value, workSymbols, 'value'); 
		var ind = num.length-1;
		num[ind] += n;
		func(num, ind, (n > 0 ? baseCount : baseCount-1));
		return workNumToValue(num, symbols);
	}	
	
	function parseParams(from, to, isDec) {
		var res = {		
			from : valueToWorkNum(from, workSymbols, 'from')
		};
		switch(typeof to) {
			case 'string':
				res.toValue = to;		
				var cr = compareWorkNums(from, valueToWorkNum(to, workSymbols, 'to'));
				if((cr === 1 && !isDec) || (cr === -1 && isDec)) {
					throw new Error('Parameters are incorrect');
				}
				break;
			case 'number': 
				res.toCount = to;
				break;
			default:
				throw new Error('"to" parameter is incorrect');
		}
		return res;
	}
	function callFunc(obj, i, func) {
		var value = workNumToValue(obj.from, symbols);		
		return (func(value, i) || value === obj.toValue || (obj.toCount !== undefined && i === obj.toCount));
	}
		
	var baseCount = symbols.length;
	var workSymbols = createWorkSymbols(symbols);
	
	// public interface
	return {
		increment : function(value) {
			return iter(value, 1);
		},
		decrement : function(value) {
			return iter(value, -1);
		},
		forIncrement : function(from, to, func) {
			var obj = parseParams(from, to, false);
			var ind = obj.from.length-1;
			var i = 0;
			while(true) {
				var cr = checkInc(obj.from, ind, baseCount);
				if(cr === 1) {
					ind++;
				}
				if(callFunc(obj, i, func)) 
					return;
				obj.from[ind]++;
				i++;
			}
		},
		forDecrement : function(from, to, func) {
			var obj = parseParams(from, to, true);
			var ind = obj.from.length-1;
			var i = 0;
			while(true) {
				var cr = checkDec(obj.from, ind, baseCount-1);
				if(cr) {
					ind--;
				}
				if(callFunc(obj, i, func)) 
					return;
				obj.from[ind]--;
				i++;
			}
		},
		compare : function(value1, value2) {
			return compareWorkNums(
				valueToWorkNum(value1, workSymbols, 'value1'),
				valueToWorkNum(value2, workSymbols, 'value2')
			);
		}
	}
};