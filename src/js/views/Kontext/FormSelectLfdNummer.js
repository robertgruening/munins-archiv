$(document).ready(function() {
    _webServiceClientLfdNummer.Register("loadAll", new GuiClient(FillSelectWithLfdNummer));
	// _webServiceClientLfdNummer.LoadAll("listSelect.loaded");
});

function FillSelectWithLfdNummer(lfdNummern, sender)
{
	console.info("filling autocomplete textbox");
	console.debug("LfD-Nummern", lfdNummern);

	if (sender == undefined ||
		sender != "listSelect.loaded")
	{
		return;
	}

	var autoCompleteItems = new Array();

	lfdNummern.forEach(lfdNummer => {
		var autoCompleteItem = new Object();
		autoCompleteItem.label = lfdNummer.Bezeichnung;
		autoCompleteItem.value = lfdNummer;
		autoCompleteItems.push(autoCompleteItem);
	});

	$( "#selectLfdNummer" ).autocomplete({
		minLength: 0,
		source: autoCompleteItems,
		focus: function(event, ui) {
			console.debug("event", event);
			console.debug("ui", ui);
			$("#selectLfdNummer").val(ui.item.label);
			return false;
		},
		select: function(event, ui) {
			console.debug("event", event);
			console.debug("ui", ui);
			$("#selectLfdNummer").val(ui.item.label);
			SetSelectedLfdNummerNode(ui.item.value);
			return false;
		}
	})
	.autocomplete("instance")._renderItem = function(ul, item) {
		console.debug("item", item);
		return $("<li>")
		.append("<div>" + item.label + "</div>")
		.appendTo(ul);
	};
}