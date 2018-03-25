/**
* ...
*
* @param {(string|Array<string>)} symbols Symbols for itarable. 
* * ex: 'abc' OR ['a','b','c']
*/
var createSymbIterator = function(symbols) {
	// parse symbols
	if(typeof symbols === 'string') {
		symbols = symbols.split('');
	}
	else if(!Array.isArray(symbols)) {
		throw new Error('A symbols parameter is incorrect');
	}
	
	
	function createWorkSymbols(arr) {
		var res = {};
		for(var i=0; i < arr.length; res[arr[i]] = i++);
		return res;
	}
	
	
	var workSymbols = createWorkSymbols(symbols);
	
	
	return {}
};

