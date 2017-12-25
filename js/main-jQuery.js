var words = [];
$(document).ready(function() {

  var list1 = [];
  var finnishWords = [];
  var combinations = [];

  var dontCalculateAll = $("#dontCalculateAll").val();

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

    dontCalculateAll = $("#dontCalculateAll").is(":checked");
    var word = $("#letters").val();
    var words2 = [];
    //console.log(word);
    combinations = getCombinations2(word);
    if(dontCalculateAll) {
      words2.push(getCombinations1(word));
    } else {
      for(var i = 0; i < combinations.length; i++) {
        var test2 = getCombinations1(combinations[i]);
        words2.push(test2);
      }
    }
    var uniqueWords = [];

    for(i = 0; i < words2.length; i++) {
      for(j = 0; j < words2[i].length; j++) {
        if($.inArray(words2[i][j], uniqueWords) === -1) uniqueWords.push(words2[i][j]);
      }
    }

    var anyfound = false;

    $("#wordlist").empty();
    for(i = 0; i < uniqueWords.length; i++) {
      if(finnishWords.indexOf(uniqueWords[i]) > 0) {
        anyfound = true;
        var li = document.createElement('li');
        $("#wordlist").append(li);
        li.innerHTML = li.innerHTML + "<h5>"
        + uniqueWords[i].charAt(0).toUpperCase()
        + uniqueWords[i].slice(1)
        + "</h5>";
      }
    }

    if(!anyfound) {
      var li = document.createElement('li');
      $("#wordlist").append(li);
      li.innerHTML = li.innerHTML + "<h5>" + "Yhtään sanaa ei löytynyt.."
      + "</h5>";
    }

  });

});

// get all orders of these letters
function getCombinations1 (word) {
  if(word.length < 2) {
    return [word];
  } else {
    var allAnswers = [];
    for (var i = 0; i < word.length; i++) {
      var letter = word[i];
      var shorterWord = word.substr(0, i) + word.substr(i+1, word.length - 1);
      var shortwordArray = getCombinations1(shorterWord);
      for (var j = 0; j < shortwordArray.length; j++) {
        // allAnswers.push(shortwordArray[j]);
        allAnswers.push(letter + shortwordArray[j]);
      }
    }
    return allAnswers;
  }
}

// get all combinations of these letters (no order)
function getCombinations2 (word) {
  var fn = function(active, rest, a) {
        if (!active && !rest)
            return;
        if (!rest) {
            a.push(active);
        } else {
            fn(active + rest[0], rest.slice(1), a);
            fn(active, rest.slice(1), a);
        }
        return a;
    }
    return fn("", word, []);
}
