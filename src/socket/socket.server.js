const {Server} = require('socket.io');
const aiService = require('../services/ai.service');

function setUpSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors : {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        console.log("New client connected");

        socket.on("ai-message", async (message) =>{
            const result = await aiService.generateResponse(message);
            
            socket.emit('ai-message-response',result)
        })

        socket.on('disconnect', () => {
            console.log("Client disconnected");
        })
    })
}

module.exports = setUpSocketServer;