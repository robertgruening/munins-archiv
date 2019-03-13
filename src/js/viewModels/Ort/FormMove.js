var _webServiceClientOrtParent = new WebServiceClientOrt();
_webServiceClientOrtParent.init();

var _selectedParentElement = null;

function SetSelectedParentElement(selectedParentElement, sender)
{
    _selectedParentElement = selectedParentElement;
}

function GetSelectedParentElement()
{
    return _selectedParentElement;
}