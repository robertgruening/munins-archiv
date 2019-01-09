function InitMessageBox()
{
    $("#messageBox").dialog({
        autoOpen: false,
        height: "auto",
        modal: true
    });
}

function ShowMessages(messages)
{
	$("#messageBox").empty();
	messages.forEach(function(item, index) {
		$("#messageBox").append(item);

		if ((index + 1) < messages.length)
		{
			$("#messageBox").append("<br/>");
		}
	});
    $("#messageBox").dialog("open");
}

function showMessages(messages)
{
	$("#messageBox").empty();
	messages.forEach(function(item, index) {
		$("#messageBox").append(item);

		if ((index + 1) < messages.length)
		{
			$("#messageBox").append("<br/>");
		}
	});
    $("#messageBox").dialog("open");
}

$(document).ready(function() {
	InitMessageBox();
});