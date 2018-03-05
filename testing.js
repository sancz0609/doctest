//extracting fs.
//only working with text files
const fs = require('fs');

//for extracting natural
var natural = require('natural');

//for tokenizing
var tokenizer = new natural.WordTokenizer();
var path = require('path');

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);
//pos tagger over

var baseDocument;
var checkDocument;
var baseLength;
var checkLength;

//for wordpos
//var WordPOS = require('wordpos'),
//wordpos = new WordPOS();

/*
// doc extracting is not working
//extracting the base document
textract.fromFileWithPath('base.docx', function( error, text ) {
  if(error)
  {
    console.log("error");
  }
  else {
    this.baseDocument = text;
  }
});

//extracting the base document
textract.fromFileWithPath('check.docx', function( error, text ) {
  if(error)
  {
    console.log("error");
  }
  else {
    checkDocument = text;
  }
});*/

var evalNouns = [];
var standardNouns = [];
var evalAdjectives = [];
var standardAdjectives = [];
var evalVerbs = [];
var standardVerbs = [];
var similarNouns = [];
var similarAdjectives = [];
var similarVerbs = [];

//console.log(this.baseDocument);
//console.log(checkDocument);
//extracting the text files sync

var baseDocument = fs.readFileSync('./base.txt','utf-8');
var checkDocument = fs.readFileSync('./check.txt','utf-8');
var tokenBaseDocument = tokenizer.tokenize(baseDocument);
var tokenCheckDocument = tokenizer.tokenize(checkDocument);

/*
//gibrish code for practiceing async -- ignore it
setTimeout(function(){
  //tokenizing the base document
  var tokenizer = new natural.WordTokenizer();


  setTimeout(function(){
    this.baseLength = tokenBaseDocument.length;

  },1000);


}, 1000);

setTimeout(function(){
  //tokenizing the check document
  var tokenizer = new natural.WordTokenizer();


  setTimeout(function(){
  this.checkLength = tokenCheckDocument.length;
  },1000);


}, 1000);

console.log(baseLength);
*/

baseLength = tokenBaseDocument.length;
checkLength = tokenCheckDocument.length;

var range_min = baseLength - (baseLength/5); //applying 20 percent lower limit
var range_max = baseLength + (baseLength/5); //applying 20 percent upper limit

if(checkLength < range_min || checkLength > range_max )
{
  console.log("Word count is not upto the mark");
  return;
}

else{
  //call for calculating everything
  calculate(tokenBaseDocument, tokenCheckDocument, end);
}

//counting nouns, adjectives and vers for both documents to compare
function calculate(standard, evaluate, callback){
  var standardTagged = tagger.tag(standard);
  var evalTagged = tagger.tag(evaluate);

  //for the counting of standard document
  for(var i=0; i < standardTagged.length; i++){
    //if its a noun
    if(standardTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      standardNouns.push(standardTagged[i][0]);
    //if its an adjective
    else if(standardTagged[i][1] == "JJ"|"JJR"|"JJS")
      standardAdjectives.push(standardTagged[i][0]);
    //if its a verb
    else if(standardTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      standardVerbs.push(standardTagged[i][0]);
  }
    //for the counting of evaluation document
  for(var i=0; i < evalTagged.length; i++){
    //if its a noun
    if(evalTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      evalNouns.push(evalTagged[i][0]);
    //if its an adjective
    else if(evalTagged[i][1] == "JJ"|"JJR"|"JJS")
      evalAdjectives.push(evalTagged[i][0]);
    //if its a verb
    else if(evalTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      evalVerbs.push(evalTagged[i][0]);

  }

   compareNouns();
   compareAdjectives();
   compareVerbs();
   end();
  }

//comparing nouns of both documents and calculating noun percentage
function compareNouns(){
  var corpus = standardNouns;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < evalNouns.length; i++){
	if(spellcheck.isCorrect(evalNouns[i])){
		similarNouns.push(evalNouns[i]);
	}
}

}

function compareAdjectives(){
  var corpus = standardAdjectives;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < evalAdjectives.length; i++){
	if(spellcheck.isCorrect(evalAdjectives[i])){
		similarAdjectives.push(evalAdjectives[i]);
	}
}
}

function compareVerbs(){
  var corpus = standardVerbs;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < evalVerbs.length; i++){
	if(spellcheck.isCorrect(evalVerbs[i])){
		similarVerbs.push(evalVerbs[i]);
	}
}
}



//json file -- to be executed in the end
 function end(){
    var score = {
      Standard :
        {
          wordCount : baseLength,
          nouns : standardNouns.length,
          adjectives : standardAdjectives.length,
          verbs : standardVerbs.length
        },

      Eval :
        {
          wordCount : checkLength,
          nouns : evalNouns.length,
          adjectives : evalAdjectives.length,
          verbs : evalVerbs.length
        },
      Common :
      {
          nouns : similarNouns.length,
          adjectives : similarAdjectives.length,
          verbs : similarVerbs.length
      }

    }
      //object to string
  var json = JSON.stringify(score, null, 2);
  //storing it in .json file
  fs.writeFileSync('output.json',json)
 }

/*
var baseNouns;
var checkNouns;

var commonNouns = [];

wordpos.getNouns(checkDocument, function(result){
  checkNouns = result;

  wordpos.getNouns(baseDocument, function(result_a){
    baseNouns = result_a;
    calculatePercentage();
  })

});

//calculating noun percentage
function calculatePercentage(){
  var corpus = baseNouns;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < checkNouns.length; i++){
	if(spellcheck.isCorrect(checkNouns[i])){
		commonNouns.push(checkNouns[i]);
	}
}
    console.log(commonNouns)
    end();
}

//json file -- to be executed in the end
 function end(){
   var stats = {

     baseDocumentStats :
     {
       wordCount : baseLength,
       nounCount : baseNouns.length
     },

     checkDocumentStats :
     {
       wordCount : checkLength,
       nounCount : checkNouns.length,
       matchingNounCount : commonNouns.length
     }

   };
      //object to string
      var json = JSON.stringify(stats,null,2);
      //fs.writeFileSync('output.json',json);

      fs.writeFile('output.json',json,'utf-8',(err) => {
        if(err) {
          console.log("error");
          return;
        }
        console.log("success");

      });

 }



/*
let states = ['baseDocumentStats','checkDocumentStats'];

let stats = {};   //initialising object with default value
states.map(state => {
  stats[state] = {
    wordCount : baseLength,
    MPL : 45454
  }
  //console.log(state);
});

india.haryana.cities.push({
  name : "Gurgaon",
  pinCode : 122001
});

india.punjab.cities = {};

*/



/*
var document = fs.readFileSync('evaluate.txt','utf-8'); //don't require

var keyWords = fs.readFileSync('key.txt','utf-8'); //don't require




//for tokenizing


var token_keyWords = tokenizer.tokenize(keyWords);

//gives the number of words
var length = token_document.length;
console.log("Document contains "+length+"words.");


if(length>=1000 && length<=4000)
    console.log("Word Check Complete : It's valid")

else {
    console.log("Invalid number of words.");
    //exit program here
}

var marks = 0;
var correctWords = [];
var spellcheck = new natural.Spellcheck(token_document);

for(i in token_keyWords){
    if(spellcheck.isCorrect(token_keyWords[i])){
        marks++;
        correctWords.push(token_keyWords[i]);
    }
}

console.log("These are the concepts that you have covered : \n"+correctWords+"\n and you get these marks for that :"+marks);

console.log("You get these many marks : "+marks);

//dictionary and its tokenization
var dictionary = fs.readFileSync('dictionary.txt','utf-8');
var token_dictionary = tokenizer.tokenize(dictionary);
console.log(token_dictionary);

var spellcheck1 = new natural.Spellcheck(token_dictionary);
var mistakes = 0;
var incorrectWords = [];

for(i in token_document){
    if(!spellcheck1.isCorrect(token_document[i])){
        mistakes++;
        incorrectWords.push(token_document[i]);
    }
}

console.log("These are the spelling mistakes you had : \n"+incorrectWords+"and you have these many mistakes \n: "+mistakes);
*/
/*
var req = new XMLHttpRequest();
req.onload = function(event){
  alert("text file has opened");
}
req.open('get','./document.txt',true);
req.send();
*/

// alert("hello world");
