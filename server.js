'use strict';
let Koa     = require('koa'),
    send    = require('koa-send'),
    Router  = require('koa-router'),
    serve   = require('koa-static'),
    koaBody = require('koa-body'),
    fs = require('fs'),
    { Client } = require('pg');

let app = new Koa();
let router = new Router();
let words = ['narancs',
            'szaloncukor',
            'illat',
            'ajándék',
            'fény',
            'Télapó',
            'tél',
            'karácsony',
            'fa',
            'mogyoró',
            'angyal',
            'hó',
            'hópehely',
            'hóember',
            'ég',
            'csillag',
            'hold',
            'bejgli',
            'család',
            'szánkó',
            'csizma',
            'meglepetés',
            'csillagszóró',
            'szenteste'
                    ];

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
                      
client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

function getCurrentHunTime(){
    let currTime = new Date();
    let tzOffsetUTC = -60;
    let tzOffsetInMs = tzOffsetUTC*60*1000;

    let currTimeInHungary = new Date(currTime.getTime() - tzOffsetInMs);
    return currTimeInHungary;
}

function getNrOfDaysInDec(){
    let currTimeInHungary = getCurrentHunTime();
    let nrDaysInDec = currTimeInHungary.getDate();

    return nrDaysInDec;
}

function getFileName(){
    let now = getCurrentHunTime();
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let millisec = now.getMilliseconds();

    let fileName = `msg_${day}_${hour}_${minute}_${millisec}.txt`;
    return fileName;
}

// serve files in public folder (css, js etc)
app.use(serve(__dirname + '/public'));

// rest endpoints
router.get('/api/words', async function (ctx){
    // You can use `await` in here
    let nrOfDays = getNrOfDaysInDec();
    let resp = words.slice(0,nrOfDays);

    ctx.body = resp;
});

router.get('/*', async function (ctx){
    ctx.body = '<div style="text-align: center;font-size: 20px;">' +
                '<p style="margin: 2em 0 0 0;font-family: monospace;">Present not found :(</p>'+
                '<img src="../decor/not-found.gif" alt="Page not found"></div>';
});

app.use(koaBody());
router.post('/api/sendMessage', async function (ctx){
    ctx.status = 200;
    ctx.body = `Request Body: ${JSON.stringify(ctx.request.body)}`;

    fs.appendFile('messages/' + getFileName(), ctx.request.body.message, function (err) {
        if (err) throw err;
      });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 5000);
