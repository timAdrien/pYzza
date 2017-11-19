exports = module.exports = function(io){
    io.on('connection', (socket) => {
    
        console.log(`Un utilisateur s'est connecté`);
        
        socket.on('disconnect', function() {
            console.log(`Un utilisateur s'est déconnecté`);
        });
        
        socket.on('refreshPizzas', () => {
            socket.broadcast.emit('refreshPizzas');
        });
        
        socket.on('creatingPizza', () => {
            socket.broadcast.emit('someoneCreatingPizza');
        });
    });
}