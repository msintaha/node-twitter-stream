var express = require('express'),
    app     = express(),
    port    = process.env.PORT || 3000,
    hbs  = require('express-handlebars'),
    server  = require('http').createServer(app),
    Twit = require('twit'),
    io 	= require('socket.io')(server);

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

server.listen(port);

var twitter = new Twit({
    consumer_key: '',
    consumer_secret: '',
    access_token: '',
    access_token_secret: ''
});

var stream = twitter.stream('statuses/filter', { track: 'javascript,angular' });

io.on('connect', function(socket) {
    stream.on('tweet', function (tweet) {
        var data = {};
        data.name = tweet.user.name;
        data.screen_name = tweet.user.screen_name;
        data.text = tweet.text;
        data.avatar = tweet.user.profile_image_url;
        socket.emit('tweets', data);
    });
});
