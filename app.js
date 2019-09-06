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
        $("#chat-screen").hide();
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

    // ANCHOR create game
    $("#create-btn").on('click', function() {
        createGame();
    })
    function createGame() {
        var user = firebase.auth().currentUser.email;

        database.ref("/game").push({
            userSearching: user
        })
    }

    database.ref("/game").on("child_added", function(childSnapshot) {

        $("#available-games").append(
            "<button class='btn btn-success game-btn' id='" + childSnapshot.val().userSearching + "'>" + firebase.auth().currentUser.email
        );
    })

        $(".game-btn").on('click', function() {
            
        })

    

// END of .ready
})