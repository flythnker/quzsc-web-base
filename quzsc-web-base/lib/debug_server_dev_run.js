
var debug = require('debug')('quzsc-web-base:debug-server');
var http = require('http');
var express = require('express');

function test1(port = 2000)
{
    console.info("port:" + port);
    var app = express();
    app.use(function(req, res, next) {
        // var err = new Error('Not Found');
        // err.status = 404;
        // next(err);
        console.info("  aa ");
        console.info(req.headers);
        console.info(req.rawHeaders);
        res.send("OK");
    });

// error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development


        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });



    port = 3000;
    app.set('port', port);
    var server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }
}


if (require.main === module) {

    test1();

}