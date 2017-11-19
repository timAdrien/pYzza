exports = module.exports = function(io){
    
    /** @socket
     * @event connection 
     * @description A la connexion aux sockets le socket de connexion est 
     * déclanché et se met à écouter sur tout les event déclarés
     */
    io.on('connection', (socket) => {
    
        console.log(`Un utilisateur s'est connecté`);
        
        /** @socket
         * @event disconnect 
         * @description Evenement spécial qui est fired quand un utilisateur
         * se déconnecte
         */
        socket.on('disconnect', function() {
            console.log(`Un utilisateur s'est déconnecté`);
        });
        
        /** @socket
         * @event refreshPizzas 
         * @description Renvoi un event de refresh des pizzas de tout
         * les utilisateurs sauf celui qui a envoyé l'event
         */
        socket.on('refreshPizzas', () => {
            socket.broadcast.emit('refreshPizzas');
        });
        
        /** @socket
         * @event creatingPizza 
         * @description Quand une pizza est en cours de création
         * tout les utilisateurs sont notifiés qu'une pizza
         * est en cours de création
         */
        socket.on('creatingPizza', () => {
            socket.broadcast.emit('someoneCreatingPizza');
        });
    });
}