window.toml = (function(){
	
	/*
	 * 	
	 */
	var options = {
		tabWidth: 4
	}
		
	var wrongNameChars = ' \\t\\[\\]';

	/*
	 * 	
	 */
	function isTable(line){

		var regex = new RegExp(
			// Whitespace followed by [ or [[
			'^([ \\t]*)' + '\\[(\\[?)' +
			// At least one name character
			'([^' + wrongNameChars+ ']+)' +
			// ] or ]] followed by an optional comment
			'\\](\\]?)' + '(?: |\\t)*' + '(?:#.*)?$'
		);
		
		var match = regex.exec(line);
	
		if(match && match.length === 5 && !match[2] === !match[4]){
			var tabReplacement = Array(options.tabWidth+1).join(' ');
			var indent = (match[1]||'').replace(/\t/g, tabReplacement);
			return {name: match[3], indent: indent.length, array: !!match[2]};
		}
		return false;
	}

	/*
	 * 	
	 */
	function isAssignment(line){
		var regex = new RegExp(
			// Matches Whitespace
			'^(?:[ \\t]*)' +
			// At least one name character
			'([^#' + wrongNameChars + ']+)' +
			// Whitespace, equals and the Assignment
			'(?:[ \\t]*)' + '=' + '(.*)$');

		var match = regex.exec(line);
		if(match && match.length === 3){
			return {name: match[1], value: match[2]};
		}
		return false;
	}

	/*
	 * 	
	 * @see http://blog.stevenlevithan.com/archives/faster-trim-javascript
	 */
	function filterValue(line){
		var dontMatchHashInStrings = '[^#\'"]|(?:"(?:[^\\\\"]|(?:\\\\.))*")';
		var regex = new RegExp(
			// This doesn't countain comments
			'^((?:' + dontMatchHashInStrings + ')*)' +
			// This is the comment that will be removed
			'(?:#(?:.|")*)?$'); 
	
		var match = regex.exec(line);
		if(!(match && match.length === 2))return false;
		var result = match[1];

		//if(!result)throw "error"
		return result.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}

	/*
	 * @see http://jsperf.com/count-the-number-of-characters-in-a-string
	 */
	function parseValue(string, name){

		// Breakets balanced
		var filtered = string.replace(/"(?:[^\\"]|(?:\\.))*"/g, '');
		var opening = filtered.split(/\{|\(|\[/g).length;
		var closing = filtered.split(/\}|\)|\]/g).length;
		if(opening !== closing)return false;

		// Validate Ending
		var last = string.substr(string.length - 1);
		if(last === ',')return false;

		// Validate using json / function
		try{
			// TODO #{} or #{{}}
			string = '{"test":' + string + '}';
			return JSON.stringify(string);
		}catch(e){
			return false;
		}
	}

	/*
	 *
	 */
	function parse(text){
		var lines = text.split('\n');
		var previous = '';
		var result = {};
		var lastTable = null;
		var lastName = null;
		var lastLine = 0;

		for(var i = 0; i < lines.length; i++){
			var line = lines[i];
			var table = isTable(line);
			var assignment = isAssignment(line); 

			if(table || assignment){
				if(previous){
					line = filterValue(line);
					var value = parseValue(previous);
					if(!value){
						previous += line;
						continue;
					}else{
						lastName = '';
						previous = '';
						store(result, lastTable, lastName, value);
					}
				}
				if(table){
					lastTable = table;
				}else{
					lastLine = i;
					lastName = assignment.name;
					previous = filterValue(assignment.value);
				}
			}else{
				//if(!lastName)throw
				previous += filterValue(line);
			}
		}
		if(previous){
			var value = parseValue(previous);
			if(value){
				store(result, lastTable, lastName, value);
			}else{
				console.log("rest:")
				console.log(previous);
				//throw		
			}
		}
		return result;
	}

	/*
	 *
	 */
	function store(result, table, name, value){
		console.log("insert:");
		console.log(table);
		console.log(name);
		console.log(value);
	}


	
	/*
	 * 	Returned Object
	 */
	return {
		options: options,

		// remove this on deployment
		regex: {
			isTable: isTable,
			isAssignment: isAssignment,
			filterValue: filterValue
		},

		// remove this on deployment
		internal: {
			parseValue: parseValue
		},
		
		parse: parse
	}


}());