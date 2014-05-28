pavlov.specify('Toml Extended', function(){

	describe('RegEx - isTable', function(){

		it('simple test case', function(){
			var string = '[test]';
			var result = { name: 'test', indent: 0, array: false };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});

		it('should return false when only a comment is present', function(){
			var string = '#test';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false when ono opening breaket is specified', function(){
			var string = 'test]';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false when no closing breaket is given', function(){
			var string = '[test #test';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false when the string suddenly stops', function(){
			var string = '[test';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false on empty string', function(){
			var string = '';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false on null', function(){
			var string = null;
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false on undefined', function(){
			var string = undefined;
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false when uncommented words after breakets', function(){
			var string = '[test] nocomment';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false when comment is before breaket', function(){
			var string = '#comment [test]';
			console.log(toml.regex.isTable(string));
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('comment can be added', function(){
			var string = '[test] #comment';
			var result = { name: 'test', indent: 0, array: false };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});
	
		it('indentation can be aded', function(){
			var string = '  [test]';
			var result = { name: 'test', indent: 2, array: false };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});

		it('should convert tab into 4 spaces indentation', function(){
			var string = '\t[test]';
			var result = { name: 'test', indent: 4, array: false };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});

		it('should convert 2 tabs into 8 spaces indentation', function(){
			var string = '\t\t[test]';
			var result = { name: 'test', indent: 8, array: false };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});

		it('should accept mixed indentation', function(){
			var string = ' \t \t [test]';
			var result = { name: 'test', indent: 11, array: false };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});

		it('should let the tab width to be set', function(){
			toml.options.tabWidth = 2;
			var string = ' \t \t [test]';
			var result = { name: 'test', indent: 7, array: false };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});

		it('should return false on double opened breakets and one closing', function(){
			var string = '[[test] #comment';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('should return false on double closing breakets and one opening', function(){
			var string = '[test]] #comment';
			assert(toml.regex.isTable(string)).isFalse();
		});

		it('simple should accept array table notation', function(){
			var string = '[[test]] #testcomment';
			var result = { name: 'test', indent: 0, array: true };
			assert(toml.regex.isTable(string)).isSameAs(result);
		});
	});

	describe('RegEx - isAssignment', function(){

		it('simple test case', function(){
			var string = 'test=test';
			var result = { name: 'test', value: 'test'};
			assert(toml.regex.isAssignment(string)).isSameAs(result);
		});

		it('should return false on null', function(){
			var string = null;
			assert(toml.regex.isAssignment(string)).isFalse();
		});
	});

	describe('RegEx - filterValue', function(){

		it('should match empty string', function(){
			var string = '';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('simple test case', function(){
			var string = ' ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});
		
		it('should match statements', function(){
			var string = ' asdasd test ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('a double quoted string', function(){
			var string = ' "test" ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('should ignore hashes in strings', function(){
			var string = ' "tes#t" ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});
		
		it('should match multiple comments and strings', function(){
			var string = ' "tes#t"  "##test" "test#" ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('should match escaped quote simple test case', function(){
			var string = ' "\\"" ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('should match escaped char that us no quote', function(){
			var string = ' "\\g" ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('should match multiple comments and strings and quots', function(){
			var string = ' "te\\"s#t"  "##t\\g\\"est" "te\\u3456st#" ';
			var comment = '#comment';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('should match multiple # in comment', function(){
			var string = ' "te\\"s#t"  "##t\\g\\"est" "te\\u3456st#" ';
			var comment = '#comment #dsfsdf "';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});

		it('should match multiple # in comment complex', function(){
			var string = ' "te\\"s#t"  "##t\\g\\"est" "te\\u3456st#" ';
			var comment = '#comment #  asadsa as#asdasd #sad  \\ " \\"  "';
			assert(toml.regex.filterValue(string+comment)).isSameAs(string.trim());
		});
	});
});