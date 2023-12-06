const Hapi = require("@hapi/hapi");
const Routes = require("./routes");

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: "localhost",
    });

    server.route(Routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
