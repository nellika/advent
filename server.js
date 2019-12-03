'use strict';
let Koa     = require('koa'),
    send    = require('koa-send'),
    Router  = require('koa-router'),
    serve   = require('koa-static');

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

function getNrOfDaysInDec(){
    let currTime = new Date();
    let tzOffsetUTC = currTime.getTimezoneOffset();
    let tzOffsetInMs = tzOffsetUTC*60*1000;

    let currTimeInHungary = new Date(currTime.getTime() - tzOffsetInMs);
    let nrDaysInDec = currTimeInHungary.getDay() + 1;

    return nrDaysInDec;
}

// serve files in public folder (css, js etc)
app.use(serve(__dirname + '/public'));

// rest endpoints
router.get('/api/words', async function (ctx){
    // You can use `await` in here
    let nrOfDays = getNrOfDaysInDec();
    let resp = words.slice(0,24);

    ctx.body = resp;
});

app.use(router.routes());
app.use(router.allowedMethods());

// this last middleware catches any request that isn't handled by
// koa-static or koa-router, ie your index.html in your example
//app.use(function* index() {
//  yield send(this, __dirname + '/index.html');
//});

app.listen(process.env.PORT || 5000);
