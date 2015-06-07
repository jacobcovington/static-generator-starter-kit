#!/usr/bin/env node
/*
 * Development mode
 *
 * Run build.js [TODO]
 * Start server: /build for *.html, else /assets
 *
 */
"use strict";
  
let http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    script = process.argv[1],
    cwd = path.dirname(script),
    path_html = path.join(cwd, "dist"),
    path_assets = path.join(cwd, "assets"),
    args = process.argv.slice(2),
    port = parseInt(args[0] || 8008),
    MIME = {
      txt: "text/plain",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      mp3: "audio/mpeg",
      mpeg: "audio/mpeg",
      mp4: "audio/mp4",
      wav: "audio/vnd.wave",
      xml: "application/xml",
      swf: "application/x-shockwave-flash",
      jpg: "image/jpeg",
      m4a: "audio/mp4a-latm"
    };


// TODO: run build.js
// TODO: then start server

http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname,
      ext = path.extname(uri),
      filename = path.join((
        ~[".html", ""].indexOf(ext)
        ? path_html
        : path_assets
      ), uri),
      server = fileServe(filename, response);

  fs.exists(filename, server);

}).listen(port);

console.log("Server running at\nhttp://localhost:" + port
            + "/\nCTRL + C to shutdown");

function fileServe (filename, response) {
  return function (exists) {
    if (!exists) {
      console.log("Page does not exist: " + filename);
      return respondError(response, 404, "Page not found");
    }
    
    if (fs.statSync(filename).isDirectory()) {
      filename += "/index.html";
    }

    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        return respondError(response, 500, err);
      }

      response.writeHead(200, mimeType(filename));
      response.write(file, "binary");
      response.end();
      return void 0;
    });
    return void 0;
  };
}

function mimeType (filename) {
  var ext = filename.match(/\.(.+)$/),
      mime = MIME[(ext && ext[1] && ext[1].toLowerCase()) || "txt"];

  return {"Content-type": mime};
}

function respondError (response, code, msg) {
  msg = msg || "#Failing";
  code = code || 0xBADF00D;

  response.writeHead(code, {"Content-type": "text/plain"});
  response.write(msg + "\n");
  response.end();

  console.log("ERROR: " + msg);
  return void 0;
}
