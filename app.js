const express = require('express');
const app = express();
const morgan = require('morgan');
const db = require('./db');
//var mongodb =require('mongodb')


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('combined'));
app.get('/', (req, res) => {
    res.render('index');
});

async function initialization() {
    await db.DbConnection();
}

server = app.listen(3000, () => {
    initialization();
    console.log(`listening on 3000`);
});

const io = require(`socket.io`)(server);

io.on('connection', (socket) => {
    console.log(`${socket.username} connected`);

    socket.on('disconnect', async () => {
        console.log(`\n${socket.username} disconnected`);
        console.log(`Last 10 Messages:`);
        await db.finalMsg(socket.username);

    });

    socket.username = "anonymous";
    socket.on('change_username', async (data) => {
        socket.username = data.username;

        let messages = await db.finalMsg(socket.username);
        io.emit('type message', messages)
    });

    socket.on('new_message', async (data) => {
        io.emit('new_message', { username: socket.username, message: data.message })

        await db.FindUser({ username: socket.username, message: data.message });
    })
})