var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': post(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	console.log(cookies);
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
	 var name = request.body.name;
        var email = request.body.email;
        var newSessionId = login.login(name, email);
        response.setHeader('Set-Cookie','session_id=' + newSessionId);

      	response.end(login.hello(newSessionId));

	//	response.end("Logged In\n");
};

function del(request, response) {
	 var cookies = request.cookies;
        login.logout(cookies['session_id']);
       
};

function put(request, response) {

	var cookies = request.cookies;
        var newSession_ID = login.refresh(cookies['session_id']);
        response.setHeader('Set-Cookie', 'session_id=' + newSession_ID);
        response.end(login.hello(newSession_ID));

	response.end("Re-freshed session id\n");
};

app.listen(8000);

console.log("Node.JS server running at 8000...");
