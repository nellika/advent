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
let littleStory = ['Téli ég, Te csillagos!<br>'+
                   'Holfénytől vagy mámoros.<br>'+
                   'Karácsonyfán szaloncukor,<br>'+
                   'Bejgliillat kis konyhánkból.<br>'+
                   'Narancs is van, meg mogyoró,<br>'+
                   'Sok meglepetés a fa alól,<br>'+
                   'Egy valami kéne még,<br>'+
                   'Egy ici-pici ajándék...<br>'+
                   'Télapó anno nem hozott,<br>'+
                   'Most elfeledték angyalok...<br>'+
                   'Csizmám pedig készen áll,<br>'+
                   'Hópelyheket nem talál.<br>'+
                   'Lenne pedig hóember,<br>'+
                   'Megtömném sok bejglivel.<br>'+
                   'Szánkózna az egész család,<br>'+
                   'Mosolygova néznénk fel rád.<br>'+
                   'Csillagszórónk úgy fénylene,<br>'+
                   'Mint Holdadnak ezüst éle.']

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});
                      
client.connect();

function getCurrentHunTime(){
    let currTime = new Date();
    let tzOffsetUTC = -60;
    let tzOffsetInMs = tzOffsetUTC*60*1000;

    let currTimeInHungary = new Date(currTime.getTime() - tzOffsetInMs);
    return currTimeInHungary;
}

function getNrOfDaysInDec(){
    let currTimeInHungary = getCurrentHunTime();
    let currMonth = currTimeInHungary.getMonth();

    if (currMonth != 11) {
        return 0;
    }

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
    let resp = nrOfDays > 24 ? littleStory.slice(0,1) : words.slice(0,nrOfDays);

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

    const text = 'INSERT INTO messages(message) values($1) RETURNING *';
    let msg = ctx.request.body.message;
    let values = [msg]

    client.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          console.log(res.rows[0])
        }
      })
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 5000);
