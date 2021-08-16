const app = require("express")(); // second () for calling express to get the application
const server = require("http").createServer(app); // http is a built in node module
const cors = require("cors");

const io = require("socket.io")(server, {
    cors: {
        origin: "*", // allow access for all origin
        methods: ["GET", "POST"]
    }
}); // second param is the options object

app.use(cors());

// declare our PORT
const PORT = process.env.PORT || 5000; // localhost://5000 for backend

// create our first route
app.get("/", (req, res) => { // "/" is the root route
    res.send("Server is running.");
});

io.on('connection', (socket) => {
    // i join, gives our own id on the frontend
    socket.emit('me', socket.id); 
    // broadcast a message
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });

    socket.on('calluser', ({ userToCall, signalData, from, name }) => { // pass more data to the calluser function from the front end, destructure data to {...}
        io.to(userToCall).emit("calluser", {signal: signalData, from, name});
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal); // did not destructure data
    });
});

// for visit this server
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));