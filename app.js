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

    // SECTION Logging in ---------------------------------------------------------
    // ANCHOR already signed in or signed out
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // user is signed in
            $("#loggedin-false").hide();
            $("#loggedin-true").show();
            $("#login-screen").hide();
            $("#signup-screen").hide();
            $("#matchmaking-screen").show();
            $("#prompt").html("Create or join game");

            var user = firebase.auth().currentUser;
            var email_id = user.email;
            console.log(email_id);
            $("#loggedin-message").html("Welcome, " + email_id);

        } else {
            // user is signed out
            initializeGame();
        }
    })

    // ANCHOR  Initialize Game
    initializeGame();
    function initializeGame() {
        $("#matchmaking-screen").hide();
        $("#login-screen").hide();
        $("#signup-screen").hide();
        $("#rps-screen").hide();
        // $("#chat-screen").show();
        $("#loggedin-true").hide();
        $("#loggedin-false").show();
        $("#prompt").html("Please Log In");
    }

    // ANCHOR SIGN UP
    $("#signup-btn").on('click', function(){
        $("#signup-screen").show();
    })
    $("#submit-signup").on('click', function() {
        event.preventDefault();
        signup();
    })
    function signup() {
        var displayName = $("#signup-displayName").val();
        var email = $("#signup-email").val();
        var password = $("#signup-password").val();

        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("Error: " + errorMessage);
            // ...
          });
    }

    // ANCHOR LOGIN
    $("#login-btn").on('click', function(){
        $("#login-screen").show();
    })
    $("#submit-login").on('click', function() {
        event.preventDefault();
        login();
    })
    function login() {
        var email = $("#login-email").val();
        var password = $("#login-password").val();

        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert("Error: " + errorMessage);
            // ...
          });
    }

    // ANCHOR Log Out
    $("#logout-btn").on('click', function() {
        logout();
    })
    function logout() {
        firebase.auth().signOut();
    }
    // -----------------------------------------------------------------------------




    // SECTION chat -----------------------------------------------------------------
    $("#chat-submit").on("click", function() {
        event.preventDefault();
        chatMessage();
    })
    function chatMessage() {
        ref = database.ref("/chat");
        messageField = $("#message-field").val();

        ref.push().set({
            name: firebase.auth().currentUser.email,
            message: messageField
        });
        $("#message-field").val("");
    }

    database.ref("/chat").on("child_added", function(snapshot) {
        var message = snapshot.val();
        var row = $("<div class='row mb-1 pb-1 border-bottom'>");
        $(row).append(
            "<strong class='ml-3'>" + message.name + "_",
            message.message
        );
        $("#chat-display").append(row);
    })
    // -------------------------------------------------------------------------------------



    // SECTION matchmaking -----------------------------------------------------------------
    // ANCHOR create game
    $("#create-btn").on('click', function() {
        createGame();
    })

    function createGame() {
        var user = firebase.auth().currentUser;
        var currentGame = {
            creator: {uid: user.uid, displayName: user.email},
            state: STATE.OPEN
        };

        database.ref("/games").push().set({currentGame});
    }

    function joinGame(key) {
        var user = firebase.auth().currentUser;
        var gameRef = database.ref("/games").child(key);
        gameRef.transaction(function(game) {
            if (!game.joiner) {
                game.state = STATE.JOINED;
                game.joiner = {uid: user.uid, displayName: user.email}
            }
            return game;
        })
    }

    // Open Games
    var openGames = database.ref("/games").orderBychild("state").equalTo(STATE.OPEN);
    openGames.on("child_added", function(snapshot) {
        var data = snapshot.val();

        // ignore own games
        if (data.creator.uid != firebase.auth().currentUser.uid) {
            addJoinGameBtn(snapshot.key, data);
        }
    })

    // Remove game
    openGames.on("child_removed", function(snapshot) {
        var item = $("#" + snapshot.key);
        if (item) {
            item.remove();
        }
    })

    // database.ref("/games").on("child_added", function(childSnapshot) {

    //     $("#available-games").append(
    //         "<button class='btn btn-success game-btn' id='" + childSnapshot.val().userSearching + "'>" + childSnapshot.val().userSearching
    //     );
    // })

    //     $(".game-btn").on('click', function() {

    //     })
    // -----------------------------------------------------------------------------
    

// END of .ready
})