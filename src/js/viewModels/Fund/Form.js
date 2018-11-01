var _webServiceClientFund = new WebServiceClientFund();
var _selectedElement = new Fund();

function SetSelectedElement(selectedElement, sender)
{
    DisableButtonDelete();

    if (selectedElement == null)
    {
        selectedElement = new Fund();
    }
    else
    {
        EnableButtonDelete();
    }

    _selectedElement = selectedElement;

    SetAblageInformation();
}

function GetSelectedElement()
{
    return _selectedElement;
}