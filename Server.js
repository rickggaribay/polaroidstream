var ws = require('websocket.io'), server = ws.listen(80), http = require('https');

var sockets =[];

server.on('connection', function (socket) {

    console.log('Connected to client');

    sockets.push(socket);

    var options = {
        host: 'stream.twitter.com',
        port: 443,
        path: "/1/statuses/filter.json?track=VSLIVE%20twitpic&track=VSLIVE%20photo",
        //path: "/1/statuses/filter.json?track=NYC%20twitpic&track=NYC%20photo",
        method: 'GET',
        headers:{
            "Authorization":"Basic..."
        }

    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        res.on('data', function (chunk) {

            console.log('BODY: ' + chunk);
            var s;
            for(i=0;i<sockets.length;i++)
            {
                sockets[i].send(chunk);
            }
            //socket..send(chunk);
        });
    });

    req.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });

req.end();



  socket.on('message', function (data) { 
		console.log('Message received:', data);
  });

  socket.on('close', function () {
      // Foo
		console.log('Socket closed!');
  });
});