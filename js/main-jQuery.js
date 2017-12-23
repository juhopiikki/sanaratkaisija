var words = [];
$(document).ready(function() {

  var letters = [];
  var list1 = [];
  var finnishWords = [];

  $.ajax({
    type: "GET" ,
    url: "../js/wordlist.xml" ,
    dataType: "xml" ,
    success: function(xml) {
      $(xml).find('s').each(function(){
        finnishWords.push($(this).text());
      });
    }
  });

  $("#calculate").click(function() {
    var word = $("#letters").val();
    //console.log(word);
    for (i=0; i<word.length; i++) {
      letters.push(word[i]);
      //console.log(word[i]);
    }
    words2 = getCombinations2(word);

    var uniqueWords = [];

    for(i=0; i<words2.length; i++) {
      if(words2.indexOf(words2[i]) != -1) {
        if($.inArray(words2[i], uniqueWords) === -1) uniqueWords.push(words2[i]);
      }
    }

    $("#wordlist").empty();

    for(i=0; i<uniqueWords.length; i++) {
      if(finnishWords.indexOf(uniqueWords[i]) > 0) {
        var li = document.createElement('li');
        $("#wordlist").append(li);
        li.innerHTML = li.innerHTML + "<h5>"
        + uniqueWords[i].charAt(0).toUpperCase()
        + uniqueWords[i].slice(1)
        + "</h5>";
      }
    }
  });

});

function getCombinations2 (word) {
  if(word.length < 2) {
    return [word];
  } else {
    var allAnswers = [];
    for (var i = 0; i < word.length; i++) {
      var letter = word[i];
      var shorterWord = word.substr(0, i) + word.substr(i+1, word.length - 1);
      var shortwordArray = getCombinations2(shorterWord);
      for (var j = 0; j < shortwordArray.length; j++) {
        allAnswers.push(shortwordArray[j]);
        allAnswers.push(letter + shortwordArray[j]);
      }
    }
    return allAnswers;
  }
}
