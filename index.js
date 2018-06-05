const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const mime = require('mime-types');

module.exports = class CDNProvider {
    /**
     * 
     * @param {string} directory 
     * @param {number} port 
     */
    static provide(directory, port) {
        if (directory === '') {
            directory = path.resolve('/');
        }

        if (!directory) {
            throw new Error('Bad directory');
        }

        if (!port) {
            throw new Error('Bad port');
        }

        http.createServer((req, res) => {
            const parsedurl = url.parse(req.url, true);

            const requested = path.join(directory, parsedurl.pathname);

            fs.stat(requested, (err, stats) => {
                if (err) {
                    res.statusCode = 404;
                    return res.end('404 Not Found');
                }

                if (stats.isDirectory()) {
                    if (parsedurl.query && parsedurl.query.f) {
                        const data = {
                            type: 'directory',
                            content: []
                        };

                        fs.readdir(requested, (err, files) => {
                            if (err) {
                                throw err;
                            }

                            data.content = files;

                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify(data));
                        });
                    } else {
                        fs.readFile(__dirname + '/view.html', (err, data) => {
                            if (err) {
                                throw err;
                            }

                            res.setHeader('Content-Type', 'text/html');
                            res.end(data);
                        });
                    }
                } else {
                    res.setHeader('Content-Type', mime.lookup(requested));

                    fs.readFile(requested, (err, buf) => {
                        if (!err) {
                            res.end(buf);
                        } else {
                            res.end('404 Not Found');
                        }
                    });
                }
            });
        }).listen(port);
    }
}