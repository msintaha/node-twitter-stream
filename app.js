const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    hbs = require('express-handlebars'),
    server = require('http').createServer(app),
    Twit = require('twit'),
    io 	= require('socket.io')(server);

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

server.listen(port);

const twitter = new Twit({
    consumer_key: 'ClkspMmRMOTAJvysssMpylY56',
    consumer_secret: '34qxajeFKcPTvMocYT5xMdOTZrQohbOAO1btgpRihJuA1tGxlM',
    access_token: '138086873-jMTpMLwOTPKRRDQ9MnlgUvwIollZTadG3i9ZnRlz',
    access_token_secret: 'xFdxY1bV2aRaxvy5AJ16i7kCxsVNe6MzThTr5QgJxJzwJ'
});

const stream = twitter.stream('statuses/filter', { track: 'nodejs,angular' });

io.on('connect', function(socket) {
    stream.on('tweet', function (tweet) {
        const data = {
            'name': tweet.user.name,
            'screen_name': tweet.user.screen_name,
            'text': tweet.text,
            'avatar': tweet.user.profile_image_url
        };

        socket.emit('tweets', data);
    });
});
