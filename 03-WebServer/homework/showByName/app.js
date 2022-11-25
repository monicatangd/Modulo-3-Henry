var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor
http.createServer(function(req, res){
    if(req.url==="/"){
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end("Estas en el Home");
    }else{
        fs.readFile(__dirname+`/images${req.url}_doge.jpg`, (err, img) =>{
            if(err){
                res.writeHead(404);
                res.end("Imagen no encontrada");
            }else{
                res.writeHead(200);
                res.end(img);
            }
        } );
    }
}).listen(3001, console.log("Server running localhost:3001"));