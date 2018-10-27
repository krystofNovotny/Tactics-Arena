module.exports = (wss, socket) => {
    socket.on('connect', player => require('./client/connect')(wss, socket, player));
    socket.on('disconnect', () => require('./client/disconnect')(wss, socket));
    socket.on('player.activity', player => require('./subscriptions/playerActivity')(player));
    socket.on('game.activity', data => require('./subscriptions/gameActivity')(wss, data));
    socket.on('chat.lobby', data => require('./subscriptions/chat/lobby')(wss, data));
};
