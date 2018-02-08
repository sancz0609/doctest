/*var fs = require('fs');

var document = fs.readFileSync('evaluate.txt','utf-8');

var keyWords = fs.readFileSync('key.txt','utf-8');

var natural = require('natural');

var tokenizer = new natural.WordTokenizer();
//for tokenizing
var token_document = tokenizer.tokenize(document);
console.log(token_document);
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
