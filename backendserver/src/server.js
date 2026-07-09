const app = require("./app");
require("dotenv").config();
const http = require("http");

const startServer = async () => {
    try {
        const PORT = process.env.PORT || 5000;
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);

    }
}

startServer();