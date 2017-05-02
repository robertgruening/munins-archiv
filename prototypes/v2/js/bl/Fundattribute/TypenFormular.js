$(function() {
	$("#sortable").hide();
});

function CreateNewFundattributtyp() {
	$("#tableFundattributtypen").append(
		"<tr>" +
			"<td>" + $("#tableFundattributtypen tr").length + "</td>" +
			"<td><input type=text /></td>" +
			"<td></td>" +
			"<td><input type=button value=Speichern /></td>" +
			"<td></td>" +
		"</tr>"
	);
}

function ShowDialogChangeFundattributtypSorting() {
	$("#sortable").sortable({
      placeholder: "ui-state-highlight"
    });
    $("#sortable").disableSelection();
    
    $("#sortable").show();
    
	$("#dialogChangeFundattributtypSorting").dialog({
      resizable: true,
      height: "auto",
      width: "auto",
      modal: true,
      buttons: {
        "Speichern": function() {
          $( this ).dialog( "close" );
        },
        "Abbrechen": function() {
          $( this ).dialog( "close" );
        }
      }
    });
}
