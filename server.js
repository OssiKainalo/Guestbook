var express = require('express'); //ottaa expressin mukaan
var app = express(); //express funktiot muuttujaan
var fs = require("fs"); //antaa seikkailla fileissä

var bodyParser = require("body-parser"); //jäsentelee pyynnöt req.bodya varten
app.use(bodyParser.urlencoded({ extended: true})); // parse application/x-www-form-urlencoded

app.use(express.static("views")); //pääsy mediaan ja styleen

//menee guestbook sivulle
app.get('/guestbook', function(req,res){
  var dataset = require("./guests.json");
  res.render('pages/guestbook', {data: dataset });
});

//lataa ejs moduulin
app.set('view engine', 'ejs');

//home
app.get('/', function(req, res) {
  res.render('pages/index');
  });

//guestbook
app.get('/guestbook', function(req,res){
  res.render('pages/guestbook')
});

//new message
app.get("/newmessage", function(req,res) {
  res.render("pages/newmessage");
});

//lisättävät tiedot guestbookiin
app.post("/newmessage", function(req,res){
  var data = require("./guests.json");
  data.push({
    username: req.body.username,
    country: req.body.country,
    message: req.body.message,
    date: new Date()
  });

//muuntaa jsoniksi
  var jsonStr = JSON.stringify(data);
//kirjoittaa messagen json tiedostoon
  fs.writeFile("guests.json", jsonStr, err => {
    if (err) throw err;
      console.log("New data saved.");
    });
    //lähettää guestbookkiin
    res.writeHead(302, {
      Location: "/guestbook"
    });
    res.end();
});


//jos ei löydä sivua
app.get("*", function(req, res){
  res.send("Can't find the requested page", 404);
});

//kuuntelee yhteyksiä
app.listen(8081, function() {
console.log('8081 is the magic port');
});
