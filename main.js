const Server = require('./server');


(async () => {
    const serverInstance = new Server();
    await serverInstance.createConnection();
})();