/*
    Glory to God in the highest
    =============================
*/


//видео о вс.коде и джсноуд. как устанавливать модули в js node

const DomParser = require('dom-parser');
const path = require('path');
const fs = require('fs');

/*
opening large text file with one-line data it hangs freezes.
*/


//ῥῤ problem. change to one. also dashes and braces in meanings.
    
//οράω, εώρα не может посмотреть.

function prepareMeanings() {
    //'this sort of thing in meanings: ἔλλαβ（ε), ἐλλάβετ（ο)
    //ῥῤ problem. change to one. also dashes and braces in meanings.

    const autenrieth=('data/autenrieth.xml')
    const mliddell=('data/middleliddell.xml')
    const lscott=('data/liddellscott.xml')

    //all Greek words not in our db should be saved for looking up.
    
    var parser = new DomParser();
    var meanings=[]

    fs.readFile(autenrieth, 'utf8', function(err, html){
        if (err) return
    
        var dom = parser.parseFromString(html);
             
        dom.getElementsByTagName("entryFree").slice(100,140).forEach((entry) => {
           
            const lemma=entry.getAttribute("key")
            if (!lemma.length) return
            var meaning=entry.textContent.replace(/\s{2,}/g, ' ').replace().trim();

            console.log(lemma, meaning)  
            
            meanings.push({lemma:lemma, english:meaning})

            //（

        })

    })
    return

    fs.readFile(mliddell, 'utf8', function(err, html){
        if (err) return
    
        var dom = parser.parseFromString(html);
        dom.getElementsByTagName("entryFree").forEach((entry) => {
           
            const word=entry.getAttribute("key")
            var meaning=entry.textContent;
            
            if (meanings.fillter(m=> m.lemma==lemma).length)
                meanings[lemma]+=crlf+meaning;
            else
                meanings.push({lemma:lemma, english:meaning})

            //（

        })

    })

    //is it liddell-scott-jones or just LS?
    fs.readFile(lscott, 'utf8', function(err, html){
        if (err) return
    
        var dom = parser.parseFromString(html);
        dom.getElementsByTagName("entryFree").forEach((entry) => {
           
            const word=entry.getAttribute("key")
            var meaning=entry.textContent;

            //（

        })

    })

    fs.writeFile("meanings.json", JSON.stringify(meanings))

}

prepareMeanings()

function prepareMessages() {

}

//all words from meanings for perseus parsing. perseus parsing with web scraping

//Disabling the statistic in the database prevents the error. It seems that, the first time, the stats must be updated or something like that (thats the reason of high volume or writes).

//el.wiktionary.org, greekdoc.com есть формы.

// формы с приставками не должны ли иметь свои лиммы
// чтобы лиммы все были в формах
//some forms in lexicon but not in its p.o.s.-table");
/*


'τεροις -не все ли должны быть comp?	
κλύω κλύοντες aor     act  pl masc nom 
κλύω κλύοντες aor     act  pl masc voc 
Но на -οντες подавляющее большинство - наст. вр. Почему тут вдруг аорист?
*/


//ongithubon github search for liddell & stuff, lexicon. +scott


/*
Порядок действий.
* solve problems in the data
   
    why many keys in autenrieth are "" proper names, not really needed

collate Greek_100_CI_AS_SC

*/



  

function prepareJsonForms() {


    var adjs=require ('./data/adjectives.js')
    var nouns=require('./data/nouns.js')
    var verbs=require('./data/verbs.js')
    var parts=require('./data/participles.js')
    var indecls=require('./data/indeclinables.js')




    //const odbc = require('odbc')

    var forms=[];

    adjs.adjectives.forEach(entry => entry.pos="adj")
    nouns.nouns.forEach(entry => entry.pos="noun")
    verbs.verbs.forEach(entry => entry.pos="verb")
    parts.participles.forEach(entry => entry.pos="part")


    forms=forms.concat(nouns.nouns, adjs.adjectives, verbs.verbs, parts.participles, indecls.indeclinables)
    fs.writeFile("./data/forms.js", JSON.stringify(forms), function (err) {
        if (err) throw err;
    });

}