pavlov.specify('Toml Extended', function(){

	describe('Parse - integration', function(){

		it('Example', function(){
			var example = document.getElementById('extended').innerHTML;
			for(var i = 0; i < 1; i++)toml.parse(example);
			console.log("Finished")
			assert.pass("Finished");
		});
	});
});