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
    let nrDaysInDec = currTimeInHungary.getDate();

    return nrDaysInDec;
}

function getCurrTimeInHungary(){
    let currTime = new Date();
    let tzOffsetUTC = currTime.getTimezoneOffset();
    let tzOffsetInMs = tzOffsetUTC*60*1000;

    let currTimeInHungary = new Date(currTime.getTime() - tzOffsetInMs);
    let nrDaysInDec = currTimeInHungary.getDate();

    return currTimeInHungary;
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

router.get('/api/currTimeInHun', async function (ctx){
    // You can use `await` in here
    let currTimeHun = getCurrTimeInHungary();
    ctx.body = currTimeHun;
});

router.get('/*', async function (ctx){
    ctx.body = '<div style="text-align: center;font-size: 20px;">' +
                '<p style="margin: 2em 0 0 0;font-family: monospace;">Present not found :(</p>'+
                '<img src="../decor/not-found.gif" alt="Page not found"></div>';
});

app.use(router.routes());
app.use(router.allowedMethods());

// this last middleware catches any request that isn't handled by
// koa-static or koa-router, ie your index.html in your example
//app.use(function* index() {
//  yield send(this, __dirname + '/index.html');
//});

app.listen(process.env.PORT || 5000);
