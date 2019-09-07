$(document).ready(function(){

    var database = firebase.database();

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
// END of .ready
})