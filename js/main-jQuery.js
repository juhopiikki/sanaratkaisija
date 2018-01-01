var words = [];
var mode1 = true;

var searchterm1 = "";
var searchterm2 = "";

$(document).ready(function() {

  var list1 = [];
  var finnishWords = [];
  var combinations = [];
  $("#info2").hide();

  $.ajax({
    type: "GET" ,
    url: "../js/wordlist.xml" ,
    dataType: "xml" ,
    success: function(xml) {
      $(xml).find('s').each(function(){
        finnishWords.push($(this).text());
      });
      setExample1();
    }
  });

  $("#calculate").click(function() {
    var word = $("#letters").val();
    var words2 = [];

    if(mode1) {
      searchterm1 = word;
      var dontCalculateAll = $("#dontCalculateAll").is(":checked");
      // test for heroku ...

      if(word.length < 11) {

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

        var filteredWords = [];

        if(dontCalculateAll) {
          filteredWords = finnishWords.filter(i => i.length == word.length);
        } else {
          filteredWords = finnishWords.filter(i => i.length <= word.length);
        }

        $("#wordlist1").empty();
        for(i = 0; i < uniqueWords.length; i++) {
          if(filteredWords.indexOf(uniqueWords[i]) > 0) {
            var li = document.createElement('li');
            $("#wordlist1").append(li);
            li.innerHTML = li.innerHTML + "<h5>"
            + uniqueWords[i].charAt(0).toUpperCase()
            + uniqueWords[i].slice(1)
            + "</h5>";
          }
        }

        if( $("#wordlist1").has("li").length === 0) {
          var li = document.createElement('li');
          $("#wordlist1").append(li);
          li.innerHTML = li.innerHTML + "<h5>" + "Yhtään sanaa ei löytynyt.."
          + "</h5>";
        }
      } else {
        $("#wordlist1").empty();
        var li = document.createElement('li');
        $("#wordlist1").append(li);
        li.innerHTML = li.innerHTML + "<h5>" + "Syötit liian monta kirjainta"
        + "</h5>";
      }
    } else {
      searchterm2 = word;
      var wordlength = word.length;

      if(wordlength < 20) {

        if(dontCalculateAll) {
          words2.push(getCombinations1(word));
        } else {
          for(var i = 0; i < combinations.length; i++) {
            var test2 = getCombinations1(combinations[i]);
            words2.push(test2);
          }
        }

        words2 = finnishWords.filter(i => i.length == word.length);
        var uniqueWords = [];

        loop1:
          for(i = 0; i < words2.length; i++) {
        loop2:
            for(j = 0; j < wordlength; j++) {
              if(word[j] != "*" &&  word[j] != words2[i][j]) {
                continue loop1;
              }
            }
            // jos päästy sanan loppuun
            uniqueWords.push(words2[i]);
          }

        $("#wordlist2").empty();
        for(i = 0; i < uniqueWords.length; i++) {
          var li = document.createElement('li');
          $("#wordlist2").append(li);
          li.innerHTML = li.innerHTML + "<h5>"
          + uniqueWords[i].charAt(0).toUpperCase()
          + uniqueWords[i].slice(1)
          + "</h5>";
        }

        if( $("#wordlist2").has("li").length === 0) {
          var li = document.createElement('li');
          $("#wordlist2").append(li);
          li.innerHTML = li.innerHTML + "<h5>" + "Yhtään sanaa ei löytynyt.."
          + "</h5>";
        }
      } else {
        $("#wordlist2").empty();
        var li = document.createElement('li');
        $("#wordlist2").append(li);
        li.innerHTML = li.innerHTML + "<h5>" + "Syötit liian monta kirjainta"
        + "</h5>";
      }
    }

  });

  // enter painallus inputin sisällä
  $("#letters").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#calculate").click();
    }
  });

  // jos painaa mode1 nappulaa
  $("#mode1").click( function() {
    if(!mode1) {
      $("#mode1").removeClass("btn-light");
      $("#mode1").addClass("btn-info");

      $("#mode2").removeClass("btn-info");
      $("#mode2").addClass("btn-light");

      $("#calculateAllLetters").show();
      $("#wordlist1").show();
      $("#wordlist2").hide();
      $("#letters").val(searchterm1);

      $("#info1").show();
      $("#info2").hide();

      mode1 = true;

      setExample1();
    }
  });

  // jos painaa mode2 nappulaa
  $("#mode2").click( function() {
    if(mode1) {
      $("#mode2").removeClass("btn-light");
      $("#mode2").addClass("btn-info");

      $("#mode1").removeClass("btn-info");
      $("#mode1").addClass("btn-light");

      $("#calculateAllLetters").hide();
      $("#wordlist1").hide();
      $("#wordlist2").show();
      $("#letters").val(searchterm2);

      $("#info1").hide();
      $("#info2").show();

      mode1 = false;

      setExample2();
    }

  });

  // kun siirrytään modeen 1
  function setExample1() {
    if(searchterm1 === "") {
      $("#letters").val("mkisou");
      $("#calculate").click();
    } else {
      $("#letters").val(searchterm1);
    }
  }

  // kun siirrytään modeen 2
  function setExample2() {
    if(searchterm2 === "") {
      $("#letters").val("a**o");
      $("#calculate").click();
    } else {
      $("#letters").val(searchterm2);
    }
  }

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
