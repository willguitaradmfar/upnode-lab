var express = require('express');
var fs = require('fs')
var app = express();
var helper = require('./my_modules/helper');

app.configure(function(){
    app.use(express.logger('dev'));
    //Diretório temporário
    app.use(express.bodyParser({uploadDir:'./tmp_dir'}));
    //Diretório aonde estão os arquivos estáticos
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon(__dirname + '/public/images/favicon.ico')); 
});

app.get('/form', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});


app.post('/file-upload', function(req, res) {
    //console.log(req.body);
    //console.log(req.files);
    // diretorio temporario
    var tmp_path = req.files.my_file.path;
    console.log(tmp_path);
    // diretorio definitivo
    var local_path = process.env.PATH_UPLOAD + req.files.my_file.name;
    // enviar arquivo do dir temporario para o definitivo
    fs.rename(tmp_path, local_path, function(err) {
        //if (err) throw err;
        if (err) {
            console.log(JSON.stringify(err));
            res.sendfile(__dirname + '/public/error.html');
            return;
        }
        // deletar arquivo temporario
        fs.unlink('./' + tmp_path, function() {
        if (err) console.log(JSON.stringify(err));
            //res.send('File uploaded to: ' + local_path + ' - ' + req.files.my_file.size + ' bytes');
            res.sendfile(__dirname + '/public/success.html');
        });
        helper.removeAllFiles('./tmp_dir');
    });
});

app.listen(process.env.PORT);
console.log('Listening on port '+process.env.PORT+'...');
