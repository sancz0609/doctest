function getData(){
  var xmlHttp = new XMLHttpRequest();
  var url = "http://localhost:3000/db";
  xmlHttp.open("GET", url, true);
  xmlHttp.send();

  xmlHttp.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var obj = JSON.parse(this.responseText);
        var btn = document.getElementById('button');
        //hiding the button after click
        btn.classList.add("hide-me");
        //getting the variables from json file
        var baseNouns = obj.baseDocumentStats.nounCount;
        var baseWordCount = obj.baseDocumentStats.wordCount;
        var checkNouns = obj.checkDocumentStats.nounCount;
        var checkWordCount = obj.checkDocumentStats.wordCount;
        var commonNouns = obj.checkDocumentStats.matchingNounCount;
        var percentage = Math.round((commonNouns/baseNouns)*100);
        //html code that needs to be fired on button click
        var html_code = "<p class = \"new_content\">Comparison complete!!<br> <table id = \"table\"><tr><th>Table</th><th>Word Count</th><th>Nouns<th></tr><tr><th>Your Document</th><td>"+checkWordCount+"</td><td>"+checkNouns+"</td></tr><tr><th>Standard Document</th><td>"+baseWordCount+"</td><td>"+baseNouns+"</td></tr></table><br></p><p class = \"new-content\">Your document has<b> "+commonNouns+"</b> common nouns with our standard document.<br>Your final score : <b>"+percentage+"%</b></p>";
        //where the content shall be inserted
        document.getElementById('content').insertAdjacentHTML('afterend', html_code);
    }
  }
}
