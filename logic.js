var calculateTime = function(setTime, currentTime){

  var currentMSec = currentTime.getMinutes()*60 + currentTime.getSeconds();
  var createMSec = setTime.getMinutes()*60 + setTime.getSeconds();

  var currentHMin = currentTime.getHours()*60 + currentTime.getMinutes();
  var createHMin = setTime.getHours()*60 + setTime.getMinutes();
  
  if( currentHMin - createHMin >= 60 ){
    return parseInt((currentHMin - createHMin)/60, 10).toString() + " hours ago"; 
  } else if( currentMSec - createMSec >= 60 ){
    return parseInt((currentMSec - createMSec)/60, 10).toString() + " minutes ago";
  } else{
    return (currentMSec - createMSec).toString() + " seconds ago";
  }
}

var createNewTweet = function( tweetObj, parentsTag ){
    var $box = $('<div class=\'box\'></div>')
    var $user = $('<span class=\'TotalUser\'></span>');
    var $contain = $('<div class=\'cont\'></div>');
    var $time = $("<div id=\'" + tweetObj.serial + "\' class=\'time\'></div>");

    $user.text('@' + tweetObj.user);
    $contain.text('> ' + tweetObj.message);
    $time.text(calculateTime(tweetObj.created_at, new Date()));
    
    parentsTag.prepend($box);
    $box.append($user);
    $box.append($contain);
    $box.append($time);
}

var userTimeline = function(idx){
  $('.TotalUser').click(function(ele){
    var target = ele.target.outerText;
    var targetArray = streams.home;
    target = target.substr(1,target.length - 1);

    $('#main').text(''); //screen clear

    for( var i = 0; i < idx; i++ ){
      if( targetArray[i].user === target ){
        var tarTweet = streams.home[i];
        createNewTweet(tarTweet, $('#main'));
      }
    }

  });
}

var timeAgo = function(){
  for( var i = 0; i < streams.home.length; i++){
      var target = streams.home[i];
      var selector = '#' + (target.serial).toString();
      $(selector).text(calculateTime(target.created_at, new Date()));  
    } 
}

var timeLoop = function(){
  timeAgo();
  setTimeout(timeLoop,10000);
};

$(document).ready(function(){
 
  var $body = $('#main');
  var index = streams.home.length;
  var history = index;
  var end = 0;

  while(index > end){
    var tweet = streams.home[end];
    createNewTweet(tweet, $body);
    
    end += 1;
  }

  $('.title').click(function(){
    location.reload();
  })

  $('#refresh').click(function(){
    index = streams.home.length-1;
    end = history;
    history = index;
    while(index > end){
      var newTweet = streams.home[end];
      createNewTweet(newTweet, $body);
      end += 1;  
    }

    timeAgo();

    userTimeline(index);
  });

  $('.btn_submit').click(function(){

    if( ($('.id_input_box').val() === '') || ($('#tweetBox').val() === '') ){
      alert("Input ID and CONTENTS");
      return -1;
    }

    var newTweet = {};
    newTweet.user = $('.id_input_box').val();
    newTweet.message = $('#tweetBox').val();
    newTweet.created_at = new Date();
    newTweet.serial = cnt++;

    streams.users[newTweet.user] = [];
    addTweet(newTweet);

    index = streams.home.indexOf(newTweet);
    end = history;
    history = index+1;
    while(index >= end){
      var refreshTweet = streams.home[end];
      createNewTweet(refreshTweet, $body);
      end += 1;  
    }

    $('.id_input_box').val('');
    $('#tweetBox').val('');


    timeAgo();

    index = streams.home.length;
    userTimeline(index);
  });

  timeLoop();

  userTimeline(index);

});