var _webServiceClientAblage = new WebServiceClientAblage();
var _webServiceClientAblageType = new WebServiceClientAblageType();
var _elementsToBeRefreshed = new Array();
var _selectedElement = null;

function SetSelectedElement(selectedElement)
{
    _selectedElement = selectedElement;
}

function GetSelectedElement()
{
    return _selectedElement;
}