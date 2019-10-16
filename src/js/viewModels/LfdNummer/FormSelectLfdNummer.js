var _webServiceClientLfdNummer = new WebServiceClientLfdNummer();
_webServiceClientLfdNummer.init();

var _selectedLfdNummer = null;

function SetSelectedLfdNummerNode(selectedLfdNummer, sender)
{
    _selectedLfdNummer = selectedLfdNummer;
}

function GetSelectedLfdNummerNode()
{
	return _selectedLfdNummer;
}

function GetAbstractLfdNummerNode()
{
	return CreateAbstractLfdNummerNode();
}

function CreateAbstractLfdNummerNode()
{
	var node = new Object();
	node.id = -1;
	node.text = "Lfd-Nummer";
	node.children = true;
	node.icon = IconConfig.getCssClasses("Root");
	node.state = new Object();

	return node;
}

function CreateFundLfdNummerNode(lfdNummer)
{
	var node = new Object();
	node.id = lfdNummer.Id;
	node.text = lfdNummer.Bezeichnung;
	node.original = lfdNummer;
	node.children = true;
	node.icon = IconConfig.getCssClasses("LfD-Nummer");
	node.BaseType = "Lfd-Nummer";

	return node;
}