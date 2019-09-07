$(document).ready(function() {

    ref = firebase.database().ref("/games");

    // SECTION matchmaking -----------------------------------------------------------------
    // ANCHOR create game
    $("#create-btn").on('click', function() {
        createGame();
    })
    function createGame() {
        var user = firebase.auth().currentUser;
        var currentGame = {
            creator: {uid: user.uid, displayName: user.email},
            state: "STATE.OPEN"
        };

        ref.push().set({currentGame});
    }

    // ANCHOR Join game
    function joinGame(key) {
        var user = firebase.auth().currentUser;
        var gameRef = ref.child(key + "/currentGame");
        gameRef.transaction(function(game) {
            if (!game.joiner) {
                game.state = "STATE.JOINED";
                game.joiner = {uid: user.uid, displayName: user.email};
                game.creatorWins = 0;
                game.joinerWins = 0;
                game.ties = 0;
                game.currentTurn = "";
                game.player1 = "";
                game.player2 = "";
            }
            return game;
        })
    }

    // ANCHOR Open Games
    var openGames = ref.orderByChild("currentGame/state").equalTo("STATE.OPEN");
    openGames.on("child_added", function(snapshot) {
        var data = snapshot.val();

        // ignore own games
        if (data.currentGame.creator.uid != firebase.auth().currentUser.uid) {
            $("#available-games").append(
                "<p id='" + snapshot.key + "'>" + "<button class='btn btn-success game-btn'>" + "JOIN: " + data.currentGame.creator.displayName
            );
        } else {
            $("#available-games").append(
                "<p id='" + snapshot.key + "'>" + "<button class='btn btn-danger " + snapshot.key + "'>" + "Cancel Game"
            );
        }

        $(".game-btn").on("click", function() {
            joinGame(snapshot.key);
            watchGame(snapshot.key)
        })
        $("." + snapshot.key).on("click", function() {
            firebase.database().ref("/games/" + snapshot.key).remove();
        })
    })

    // Remove game
    openGames.on("child_removed", function(snapshot) {
        var item = $("#" + snapshot.key);
        if (item) {
            item.remove();
        }
    })

    function watchGame(key) {
        var gameRef = ref.child(key).child("currentGame");
        gameRef.on("value", function(snapshot) {
            var game = snapshot.val();
            switch (game.state) {
                case "STATE.JOINED": setupGame(key); break;
                case "STATE.FIRSTTURN": firstTurn(key); break;
                case "STATE.NEXTTURN": nextTurn(key); break;
                case "STATE.COMPARE": determineWinner(key); break;
                case "STATE.COMPLETED": complete(key); break; 
            }
        })
    }
    // -----------------------------------------------------------------------------



    // SECTION Game logic ----------------------------------------------------------

    var initialCreatorWins = 0;
    var creatorWins = initialCreatorWins;
    var initialJoinerWins = 0;
    var joinerWins = initialJoinerWins;
    var initialTies = 0;
    var ties = initialTies;

    function setupGame(key) {
        $("#matchmaking-screen").hide();
        $("#rps-screen").show();
        creatorWins = initialCreatorWins;
        joinerWins = initialJoinerWins;
        ties = initialTies;

        var gameRef = ref.child(key).child("currentGame");

        gameRef.update({
            currentTurn: "creator",
            state: "STATE.FIRSTTURN"
        })
    }

    function firstTurn(key) {
        // change prompt
        var gameRef = ref.child(key).child("currentGame");
        gameRef.on("value", function(snapshot) {
            var joiner = snapshot.val().joiner.displayName;
            $("#prompt").html(joiner + "'s turn");
        })

        // Users Select RPS
        $("#rock").on("click", function() {
            gameRef.transaction(function(game) {
                if(game.currentTurn === "creator" && game.player1 === "") {
                    game.player1 = "rock"
                    game.currentTurn = "joiner"
                    game.state = "STATE.NEXTTURN"
                }
                return game;
            })
        })
        $("#paper").on("click", function() {
            gameRef.transaction(function(game) {
                if(game.currentTurn === "creator" && game.player1 === "") {
                    game.player1 = "paper"
                    game.currentTurn = "joiner"
                    game.state = "STATE.NEXTTURN"
                }
                return game;
            })
        })
        $("#scissors").on("click", function() {
            gameRef.transaction(function(game) {
                if(game.currentTurn === "creator" && game.player1 === "") {
                    game.player1 = "scissors"
                    game.currentTurn = "joiner"
                    game.state = "STATE.NEXTTURN"
                }
                return game;
            })
        })
    }

    // Player 2s turn
    function nextTurn(key) {
        // change prompt
        var gameRef = ref.child(key).child("currentGame");
        gameRef.on("value", function(snapshot) {
            var joiner = snapshot.val().joiner.displayName;
            $("#prompt").html(joiner + "'s turn");
        })

        // Users Select RPS
        $("#rock").on("click", function() {
            gameRef.transaction(function(game) {
                if (game.currentTurn === "joiner" && game.player2 === "") {
                    game.player2 = "rock"
                    game.currentTurn = "creator"
                    game.state = "STATE.COMPARE"
                }
                return game;
            })
        })
        $("#paper").on("click", function() {
            gameRef.transaction(function(game) {
                if (game.currentTurn === "joiner" && game.player2 === "") {
                    game.player2 = "paper"
                    game.currentTurn = "creator"
                    game.state = "STATE.COMPARE"
                }
                return game;
            })
        })
        $("#scissors").on("click", function() {
            gameRef.transaction(function(game) {
                if (game.currentTurn === "joiner" && game.player2 === "") {
                    game.player2 = "scissors"
                    game.currentTurn = "creator"
                    game.state = "STATE.COMPARE"
                }
                return game;
            })
        })
    }

    // Determine Winner
    function determineWinner(key) {
        var gameRef = ref.child(key).child("currentGame")

        gameRef.once("value").then(function(snapshot) {
            if (snapshot.val().player1 !== "") {
                // TIES
                if (snapshot.val().player1 == "rock" && snapshot.val().player2 == "rock" || snapshot.val().player1 == "paper" && snapshot.val().player2 == "paper" || snapshot.val().player1 == "scissors" && snapshot.val().player2 == "scissors") {
                    alert("Tie!")
                    ties++;
                }
                // Player 1 wins
                else if (snapshot.val().player1 == "rock" && snapshot.val().player2 == "scissors" || snapshot.val().player1 == "paper" && snapshot.val().player2 == "rock" || snapshot.val().player1 == "scissors" && snapshot.val().player2 == "paper") {
                    creatorWins++;
                    alert(snapshot.val().creator.displayName + " wins!");
                }
                // Player 1 loses
                else if (snapshot.val().player2 == "rock" && snapshot.val().player1 == "scissors" || snapshot.val().player2 == "paper" && snapshot.val().player1 == "rock" || snapshot.val().player2 == "scissors" && snapshot.val().player1 == "paper") {
                    joinerWins++;
                    alert(snapshot.val().joiner.displayName + " wins!");
                }

                    gameRef.update({
                        ties: ties,
                        creatorWins: creatorWins,
                        joinerWins: joinerWins,
                        player1: "",
                        player2: "",
                        currentTurn: "creator",
                        // state: "STATE.FIRSTTURN"
                        state: "STATE.COMPLETED"
                    })
            }
        })
    }

    // game over 
    function complete(key) {
        firebase.database().ref("/games/" + key).remove().then(function() {
            console.log("remove succeeded")
        });
        document.location.reload();
    }
    // -----------------------------------------------------------------------------
})