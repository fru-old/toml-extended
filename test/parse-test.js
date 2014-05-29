pavlov.specify('Toml Extended', function(){

	describe('Parse - integration', function(){

		it('Example', function(){
			var input = document.getElementById('extended').innerHTML;
			var expected = document.getElementById('extended-expected').innerHTML;
			assert(toml.parse(input)).isSameAs(JSON.parse(expected));
		});
	});
});