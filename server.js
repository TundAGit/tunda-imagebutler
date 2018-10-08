var server = require('webserver').create(),
	system = require('system'),
	fs     = require('fs'),
	port   = system.env.PORT || 8080;

var service = server.listen(port, function(request, response) {

	/*
	if(request.method == 'POST' && request.post.url){
		var url = request.post.url;

		request_page(url, function(properties, imageuri){
			response.statusCode = 200;
			response.write(JSON.stringify(properties));	
			response.write("\n");	
			response.write(imageuri);
			response.close();
		})

	} else {
		response.statusCode = 200;
		response.setHeader('Content-Type', 'text/html; charset=utf-8');
		response.write(fs.read('index.html'));
		
		response.close();
	}
	
	*/
	
	var url = "http://livingroom-cologne.de/imagebutler/tmp.php" + request.url;
	
	
	
	request_page(url, width, height, function(properties, imageuri){
		response.statusCode = 200;
		//response.setHeader('Content-Type', 'text/plain');
		//response.write("request method:" + request.method + " QUERY:" + request.url);
		//response.write(JSON.stringify(properties));	
		//response.write("\n");	
		response.write(imageuri);
		response.close();
	
	});
	
	

});

if(service) console.log("server started - http://localhost:" + server.port);

function request_page(url, width, height, callback){

	var page = new WebPage();
	
	page.viewportSize = { width: 1400, height: 1400 };
	page.clipRect = { top: 0, left: 0, width: 1400, height: 1400 };
	page.onLoadStarted = function () {
		console.log('loading:' + url);
	};
	
	
	page.onLoadFinished = function (status) {
		setTimeout(function(){
			console.log('loaded:' + url);

			var properties = {};

			properties.output = page.viewportSize.width + "__" + page.viewportSize.height;

			page.onCallback = function(data) {
				window.setTimeout(function () {
					page.clipRect = { top: 0, left: 0, width: width, height: height };
					
					var imageuri = 'data:image/png;base64,' + page.renderBase64('png');

					callback(properties,imageuri);

					page.close();
				},400);
			};
			
			properties.url = url;
			
			properties.title = page.evaluate(function () {
			
				window.callPhantom();
				
			});
			
			page.evaluate(function () {
				
				document.addEventListener('DOMContentLoaded', function() {
					
					 
					
					
				}, false);
				
			});
			
			
		},300);
	};

	page.open(url);
}