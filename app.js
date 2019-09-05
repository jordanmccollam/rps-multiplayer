// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCS-DyyVyvbmNBYjIokQctDSc9o35hrZS8",
    authDomain: "rps-multiplayer-8ef51.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-8ef51.firebaseio.com",
    projectId: "rps-multiplayer-8ef51",
    storageBucket: "rps-multiplayer-8ef51.appspot.com",
    messagingSenderId: "345409601469",
    appId: "1:345409601469:web:64b5aad105f02de0965cd4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var database = firebase.database();

$(document).ready(function(){

    $("#submit").on('click', function(){
        // Save players to database
        var username = $("#username").val();

        database.ref().push({
            player: username
        })
    })

    // push players to an array
    database.ref().on("child_added", function(childSnapshot){
        
    })

// END of .ready
})