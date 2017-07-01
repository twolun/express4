const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const formidable = require('formidable');
const handlebars = require('express3-handlebars')
                    .create({ defaultLayout:'main' });
const fortune = require('./lib/fortune');
const credentials = require('./credentials');

app.disable('x-powered-by');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser(credentials.cookieSecret));

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.cookie('signed_monster', 'nom nom', { signed: true });
  res.cookie('monster', 'nom nom');
  res.render('home');
})
app.get('/about', function(req, res){
  console.log(req.cookies.monster);
  console.log(req.signedCookies)
  res.cookie('token', 'my token ising been seeing...')
  res.render('about', {fortune: fortune.getFortune()});
})
app.get('/v1/api/getInfo', function(req, res){
  res.json({info: [1, 2, 3]})
})

app.get('/headers', function(req, res){
  res.set('Conent-Type', 'text/html');
  let s = '';
  for(let name in req.headers) {
    s += name + ':' + req.headers[name] + '<br />';
  }
  res.send(s);
})
app.get('/newsletter', function(req, res){
  res.render('newsletter', {csrf: 'CSRF token goes here'})
})
app.get('/thank-you', function(req, res){
  res.render('thank-you')
})
app.post('/process', function(req, res){
  // console.log('Form (from querystring): ' + req.query.form);
  // console.log('CSRF token (from hidden form field): ' + req.body._csrf);
  // console.log('Name (from visible form hield): ' + req.body.name);
  // console.log('Email (from visible form field: ' + req.body.email);
  // res.redirect(303, '/thank-you');
  if(req.xhr || req.accepted('json, html') === 'json') {
    res.send({success: true});
  } else {
    // 如果发生错误重定向到错误页面
    res.send(303, '/thank-you');
  }
})
app.get('/content/vacation-photo', function(req, res){
  const now = new Date();
  res.render('content/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth()
  })
})
app.post('/content/vacation-photo/:year/:month', function(req, res){
  const form = formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if(err) res.redirect(303, '/error');
    console.log('recieved fields: ');
    console.log(fields);
    console.log('recieve files: ');
    console.log(files);
    res.redirect(303, '/thank-you');
  })
})

var tours = [ 
  { id: 0, name: 'Hood River', price: 99.99 }, 
  { id: 1, name: 'Oregon Coast', price: 149.95 }
];

app.get('/api/tours', function(req, res){
  res.json(tours)
})
app.put('/api/tours/:id', function(req, res){
  let idx = 0;
  let p = tours.some((p, index) => {
    idx = index;
    return p.id == req.params.id;
  });
  console.log(tours)
  if(p) {
    if(req.query.name) tours[idx].name = req.query.name;
    if(req.query.price) tours[idx].price = req.query.price;
    console.log(tours)
    res.json({success: true});
  } else {
    res.json({error: 'no such tour exists'});
  }
})
app.delete('/api/tours/:id', function(req, res){
  let i;
  for(i = tours.length - 1; i > 0; i--) {
    if(tours[i].id == req.params.id) break;
  }
  console.log(tours)
  if(i > 0) {
    tours.splice(i, 1);
    res.json({success: true});
  } else {
    res.json({error: 'no such tour exists'});
  }
  console.log(tours)
})

// 定制404页面
app.use(function(req, res){
  res.status(404);
  res.render('404');
})

// 定制500页面
app.use(function(err, req, res, next){
  console.log(err)
  res.status(500);
  res.render('500');
})

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl + C to teminate')
})