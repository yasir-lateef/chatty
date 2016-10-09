var express = require('express'),
    app = require('express')(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    usernames = [];

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(___dirname+'/public/index.html');
});

io.sockets.on('connect', function(socket){
    console.log('Socket Opened - ' + socket.id)

    socket.on('new-user', function(username, callback){
        if(usernames.indexOf(username) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = username;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    socket.on('send-message', function(data){
        io.sockets.emit('new-message', {msg:data,name:socket.username});
    });
    socket.on('disconnect', function(){
        console.log('A user disconnected at socket - ' + socket.id);
        usernames.splice(usernames.indexOf(socket.username),1);
        updateUsernames()
    });
});

http.listen(3000, function(){
    console.log('Listening to Port 3000');
});

function updateUsernames(){
    io.sockets.emit('update-usernames', usernames);
}