import Server from './app';
import dotenv from 'dotenv';

// This function run our service
(() => {
    try {
        dotenv.config();
        const server = new Server();
        server.start();
    } catch (e) {
        console.error(e);
        process.exit(0);
    }
})();
