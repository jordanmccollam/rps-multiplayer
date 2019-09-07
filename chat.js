$(document).ready(function() {

    var database = firebase.database();

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
        var row = $("<div class='row mb-1 pb-1 ml-3 border-bottom' id='" + snapshot.key + "'>");
        $(row).append(
            "<strong>" + message.name + "_",
            message.message
        );
        $("#chat-display").append(row);
    })

    database.ref("/chat").on("child_removed", function(snapshot) {
        var item = $("#" + snapshot.key);
        if (item) {
            item.remove();
        }
    })
    // -------------------------------------------------------------------------------------
})