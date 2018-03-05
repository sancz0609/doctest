function getData(){
  var xmlHttp = new XMLHttpRequest();
  var url = "http://localhost:3000/db";
  xmlHttp.open("GET", url, true);
  xmlHttp.send();

  xmlHttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var obj = JSON.parse(this.responseText);
        var btn = document.getElementById('button');
        //removing the button
        btn.classList.add("hide-me");



        var standardNouns = obj.Standard.nouns;
        var standardAdjectives = obj.Standard.adjectives;
        var standardVerbs = obj.Standard.verbs;
        console.log(obj.Standard.verbs);
        var standardWordCount = obj.Standard.wordCount;
        //details of eval document
        var evalNouns = obj.Eval.nouns;
        var evalAdjectives = obj.Eval.adjectives;
        var evalVerbs = obj.Eval.verbs;
        var evalWordCount = obj.Eval.wordCount;
        //commmon properties
        var commonNouns = obj.Common.nouns;
        var commonAdjectives = obj.Common.adjectives;
        var commonVerbs = obj.Common.verbs;
        console.log(commonNouns);

        var total = standardAdjectives+standardNouns+standardVerbs;
        var marks = commonNouns+commonVerbs+commonAdjectives;
        var percentage = Math.round((marks/total)*100);
        //html code that needs to be fired on button click
        var html_code = "<p class = \"new_content\">Comparison complete!!<br> <table id = \"table\"><tr><th>Table</th><th>Word Count</th><th>Nouns</th><th>Adjectives</th><th>Verbs</th></tr><tr><th>Your Document</th><td>"+evalWordCount+"</td><td>"+evalNouns+"</td><td>"+evalAdjectives+"</td><td>"+evalVerbs+"</td></tr><tr><th>Standard Document</th><td>"+standardWordCount+"</td><td>"+standardNouns+"</td><td>"+standardAdjectives+"</td><td>"+standardVerbs+"</td></tr></table><br></p><p class = \"new-content\">Your document has<b> "+commonNouns+"</b> common nouns with our standard document.<br>Your document has<b> "+commonAdjectives+"</b> common adjectives with our standard document.<br>Your document has<b> "+commonVerbs+"</b> common verbs with our standard document.<br><br>Your final score : <b>"+percentage+"%</b></p>";
        //where the content shall be inserted
        document.getElementById('content').insertAdjacentHTML('afterend', html_code);
    }
  }
}
npm install -D json-server
