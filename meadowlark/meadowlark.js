const express = require('express');
const app = express();
const handlebars = require('express3-handlebars')
                    .create({ defaultLayout:'main' });
const fortune = require('./lib/fortune');

app.disable('x-powered-by');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.get('/', function(req, res){
  res.render('home');
})
app.get('/about', function(req, res){
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