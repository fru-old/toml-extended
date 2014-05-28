window.toml = (function(){
	
	/*
	 * 	
	 */
	var options = {
		tabWidth: 4
	}
		
	var acceptedNameChars = '^ \\t\\[\\]';

	/*
	 * 	
	 */
	function isTable(line){

		var regex = new RegExp(
			// Whitespace followed by [ or [[
			'^([ \\t]*)\\[(\\[?)' +
			// At least one name character
			'([' + acceptedNameChars+ ']+)' +
			// ] or ]] followed by an optional comment
			'\\](\\]?)(?: |\\t)*(?:#.*)?$');
		
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
			'([' + acceptedNameChars + ']+)' +
			// Whitespace, equals and the Assignment
			'(?:[ \\t]*)=(.*)$');

		var match = regex.exec(line);
		if(match && match.length === 3){
			return {name: match[1], value: match[2]};
		}
		return false;
	}

	/*
	 * 	
	 */
	function filterComments(line){
		var dontMatchHashInStrings = '[^#\'"]|(?:"(?:[^\\\\"]|(?:\\\\.))*")';
		var regex = new RegExp(
			// This doesn't countain comments
			'^((?:' + dontMatchHashInStrings + ')*)' +
			// This is the comment that will be removed
			'(?:#(?:.|")*)?$'); 
	
		var match = regex.exec(line);
		if(!(match && match.length === 2))return false;
		return match[1];
	}
	
	/*
	 * 	
	 */
	function parseValue(line, previous){
		
	}
	
	/*
	 * 	Returned Object
	 */
	return {
		options: options,
		regex: {
			isTable: isTable,
			isAssignment: isAssignment,
			filterComments: filterComments
		},
		internal: {
			parseValue: parseValue
		}
	}


}());