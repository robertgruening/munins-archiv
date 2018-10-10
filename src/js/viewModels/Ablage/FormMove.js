var _webServiceClientAblageParent = new WebServiceClientAblage();
var _selectedParentElement = null;

function SetSelectedParentElement(selectedParentElement, sender)
{
    _selectedParentElement = selectedParentElement;
}

function GetSelectedParentElement()
{
    return _selectedParentElement;
}