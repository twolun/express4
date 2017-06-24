var http = require('http');
var fs = require('fs');

function serverStaticFile(res, path, contenType, responseCode) {
	if(!responseCode) responseCode = 200;
	fs.readFile(__dirname + path, (err, data) => {
		if(err) {
			res.writeHead(500, {'Content-Type': 'text/plain'});
			res.end('500 - Internal Error');
		} else {
			res.writeHead(responseCode, {'Content-Type': contenType});
			res.end(data);
		}
	})
}

http.createServer((req, res) => {
	console.log(req.url)
	var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
	switch (path) { 
		case '': 
			serverStaticFile(res, '/public/home.html', 'text/html'); 
			break ; 
		case '/about': 
			serverStaticFile(res, '/public/about.html', 'text/html');
			break ; 
		case '/img/logo.jpg': 
			serverStaticFile(res, '/public/img/logo.jpg', 'image/jpg');
			break;
		default : 
			serverStaticFile(res, '/public/404.html', 'text/html', 404);
			break ;

}
}).listen('3000');

console.log('Server started on localhost: 3000; press Ctrl+C to terminate...');