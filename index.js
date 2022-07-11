const needle = require('needle');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/test');

let URL = 'https://select.by/kross-kurs/';
let results = [];

function compareKursBuy (kursA,kursB) {
    if(kursA.buy < kursB.buy){
        return 1;
    }
    else if (kursA.buy === kursB.buy){
        return 0;
    }
    else {
        return -1;
    }
}

function compareKursSell (kursA,kursB) {
    if(kursA.sell > kursB.sell){
        return 1;
    }
    else if (kursA.sell === kursB.sell){
        return 0;
    }
    else {
        return -1;
    }
}

needle.get(URL, function(err,res) {
    "use strict";
    if(err) throw err;

    let $ = cheerio.load(res.body);

    let table = $('#curr_table');
    let row = table.find('tr').not('.tablesorter-childRow');
    let result = [];

    if(table) {
        row.each(function(i) {
            if(i != 0 && $(this).find('td:nth-child(2)>a').text() != '') {
                result[i] = {
                    bank : $(this).find('td:nth-child(2)>a').text(),
                    buy : $(this).find('td:nth-child(3)').text(),
                    sell : $(this).find('td:nth-child(4)').text()
                };
            }
        });
        result.shift();

    }

    let banksCount = 0;
    let totalBanks = {
        buy : {},
        sell : {}
    };

    result.sort(compareKursBuy);
    result.forEach(el => {
        totalBanks.buy[el.buy] = totalBanks.buy.hasOwnProperty(el.buy) ? ++banksCount : banksCount = 1;
    });
    result.sort(compareKursSell);
    result.forEach(el => {
        totalBanks.sell[el.sell] = totalBanks.sell.hasOwnProperty(el.sell) ? ++banksCount : banksCount = 1;
    });

    console.log(totalBanks);


    result.sort(compareKursBuy);
    console.log(result);
    result.sort(compareKursSell);

    let buy = "На покупку: " + result[0].buy;
    let sell = "На продажу: " + result[0].sell;

    console.log(buy);
    console.log(sell);

    function printKurs(kurs) {
        for(let i=0; i < kurs.length; i++){
            console.log(
                " Название: " + kurs[i].bank +
                ", Покупка: " + kurs[i].buy +
                ", Продажа: " + kurs[i].sell);
        }
    }

});
