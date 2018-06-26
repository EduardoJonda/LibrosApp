const express = require("express");
const app = express()
const mysql = require("mysql")
const bodyParser= require('body-parser')
const multer = require('multer');
var imge = "";
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, 'uploads')
  },
  filename: function (req, file, cb){
    crypto.pseudoRandomBytes(32, function(err, raw){
    	imge = raw.toString('hex') + path.extname(file.originalname);
        cb(null, imge);
    })
  }
});
 
var upload = multer({storage: storage});


app.use("/bootstrap",express.static(__dirname+"/bootstrap"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

app.use(express.static('uploads'));

con = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"",
	database:"librotable"
});

app.listen(3000,function(){
	console.log("Listening on 3000 ...");
});

app.get("/",function(req,res){
	con.query("select * from libros",function(error,result){
		res.render("index.ejs",{lista:result});
	});
});

app.get("/nuevo",function(req,res){
	res.render("nuevo.ejs",{});
});

app.post("/guardar",upload.single('libro[imagen]'),function(req,res){
	var tit = req.body.libro.titulo;
	var res = req.body.libro.resumen;
	var img = imge;
		console.log("Guardando : "+img);
	var fecha = req.body.libro.fecha;
	con.query("insert into libros (titulo, resumen, imagen, fecha) value (\""+tit+"\",\""+res+"\",\""+img+"\",\""+fecha+"\")",function(error,result){
	});
});

app.get("/editar/:librosid",function(req,res){
	console.log("Ver el id"+req.params.librosid);
	const id = req.params.librosid;
	const idlibro = id.substring(0,2);
	console.log("Ver el id recortado "+idlibro);
	con.query("select * from libros where libros_id="+req.params.librosid,function(error,result){
		res.render("editar.ejs",{libro:result[0]});
	});
});

app.post("/actualizar",function(req,res){
	var id = req.body.libro.id;
	var tit = req.body.libro.titulo;
	var res = req.body.libro.resumen;
	var img = req.body.libro.imagen;
	var fecha = req.body.libro.fecha;
	con.query(" update libros set titulo=\""+tit+"\",resumen=\""+res+"\",imagen=\""+img+"\",fecha=\""+fecha+"\" where libros_id="+id,function(error,result){
	});
	/// alert("El libro fue actualizado satisfactoriamente");
	/// res.redirect("/");
});

app.get("/eliminar/:librosid",function(req,res){

	  con.query("delete from libros where libros_id="+req.params.librosid,function(error,result){
	  });

	  fs.unlink(__dirname+"/uploads/"+imge, function(err) {
		if (err) {
		return console.error(err);
		}
		console.log('File deleted successfully!');
		});

	res.redirect("/");
});
