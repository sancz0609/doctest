//extracting fs.
//only working with text files
const fs = require('fs');

//for extracting natural
var natural = require('natural');

//for tokenizing
var tokenizer = new natural.WordTokenizer();

var baseDocument;
var checkDocument;
var baseLength;
var checkLength;

//for wordpos
var WordPOS = require('wordpos'),
wordpos = new WordPOS();

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
