var _webServiceClientOrtParent = new WebServiceClientOrt();
var _selectedParentElement = null;

function SetSelectedParentElement(selectedParentElement, sender)
{
    _selectedParentElement = selectedParentElement;
}

function GetSelectedParentElement()
{
    return _selectedParentElement;
}