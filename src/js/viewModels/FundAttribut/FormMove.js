var _webServiceClientFundAttributParent = new WebServiceClientFundAttribut();
_webServiceClientFundAttributParent.init();

var _selectedParentElement = null;

function SetSelectedParentElement(selectedParentElement, sender)
{
    _selectedParentElement = selectedParentElement;
}

function GetSelectedParentElement()
{
    return _selectedParentElement;
}