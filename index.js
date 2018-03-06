//for working with file system
const fs = require('fs');

//provides utilities for working with file and directory paths
var path = require('path');

//for extracting natural
var natural = require('natural');

//for tokenizing
var tokenizer = new natural.WordTokenizer();

//POS tagger based on Eric Brill's transformational algorithm
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

var checkNouns = [];
var baseNouns = [];
var checkAdjectives = [];
var baseAdjectives = [];
var checkVerbs = [];
var baseVerbs = [];
var sameNouns = [];
var sameAdjectives = [];
var sameVerbs = [];

//extracting the text files sync
baseDocument = fs.readFileSync('./docs/base.txt','utf-8');
checkDocument = fs.readFileSync('./docs/check.txt','utf-8');

//making tokens of base and check document
var tokenBaseDocument = tokenizer.tokenize(baseDocument);
var tokenCheckDocument = tokenizer.tokenize(checkDocument);

//finding length of base and check document
baseLength = tokenBaseDocument.length;
checkLength = tokenCheckDocument.length;

var range_min = baseLength - (baseLength/5); //applying 20 percent lower limit
var range_max = baseLength + (baseLength/5); //applying 20 percent upper limit

if(checkLength < range_min || checkLength > range_max )
{
  console.log("Word count is not upto the mark");
  return;
}

else
{
  //call for evaluateing results
  evaluate(tokenBaseDocument, tokenCheckDocument, end);
}

//counting nouns, adjectives and vers for both documents to compare
function evaluate(base, check, callback)
{
  var baseTagged = tagger.tag(base);
  var checkTagged = tagger.tag(check);

  baseTagged = countingPOS(baseTagged.length,baseTagged)
  checkTagged = countingPOS(checkTagged.length,checkTagged)

  //for the counting of base document
  for(var i=0; i < baseTagged.length; i++)
  {
    //if its a noun
    if(baseTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      baseNouns.push(baseTagged[i][0]);
    //if its an adjective
    else if(baseTagged[i][1] == "JJ"|"JJR"|"JJS")
      baseAdjectives.push(baseTagged[i][0]);
    //if its a verb
    else if(baseTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      baseVerbs.push(baseTagged[i][0]);
  }
    //for the counting of evaluation document

  for(var i=0; i < checkTagged.length; i++){
    //if its a noun
    if(checkTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      checkNouns.push(checkTagged[i][0]);
    //if its an adjective
    else if(checkTagged[i][1] == "JJ"|"JJR"|"JJS")
      checkAdjectives.push(checkTagged[i][0]);
    //if its a verb
    else if(checkTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      checkVerbs.push(checkTagged[i][0]);
  }
   compareNouns();
   compareAdjectives();
   compareVerbs();
   end();
  }
/*
function countingPOS(lengthCheck,docTagged[][],noun[],adj[],verb[])
{
  for(var i=0; i < lengthCheck; i++)
  {
      if(docTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      {
        baseNouns.push(docTagged[i][0]);
      }
      //if its an adjective
      else if(docTagged[i][1] == "JJ"|"JJR"|"JJS")
      {
        baseAdjectives.push(docTagged[i][0]);
      }
      //if its a verb
      else if(docTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      {
        baseVerbs.push(docTagged[i][0]);
      }
  }
  return docTagged;
}*/

//comparing nouns of both documents and calculating noun percentage
function compareNouns(){
  var corpus = baseNouns;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < checkNouns.length; i++){
	if(spellcheck.isCorrect(checkNouns[i])){
		sameNouns.push(checkNouns[i]);
	}
}

}

function compareAdjectives(){
  var corpus = baseAdjectives;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < checkAdjectives.length; i++){
	if(spellcheck.isCorrect(checkAdjectives[i])){
		sameAdjectives.push(checkAdjectives[i]);
	}
}
}

function compareVerbs(){
  var corpus = baseVerbs;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < checkVerbs.length; i++){
	if(spellcheck.isCorrect(checkVerbs[i])){
		sameVerbs.push(checkVerbs[i]);
	}
}
}



//json file -- to be executed in the end
 function end(){
    var score = {
      Standard :
        {
          wordCount : baseLength,
          nouns : baseNouns.length,
          adjectives : baseAdjectives.length,
          verbs : baseVerbs.length
        },

      Eval :
        {
          wordCount : checkLength,
          nouns : checkNouns.length,
          adjectives : checkAdjectives.length,
          verbs : checkVerbs.length
        },
      Common :
      {
          nouns : sameNouns.length,
          adjectives : sameAdjectives.length,
          verbs : sameVerbs.length
      }

    }
      //object to string
  var json = JSON.stringify(score, null, 2);
  //storing it in .json file
  fs.writeFileSync('output.json',json)
 }
