var _webServiceClientKontext = new WebServiceClientKontext();
var _selectedElement = null;

function SetSelectedElement(selectedElement, sender)
{
    DisableCreateButton();
    DisableEditButton();
    DisableMoveButton();
    DisableDeleteButton();

    if (selectedElement == null)
    {
    }
    else if (selectedElement.Type == null ||
        selectedElement.Type == "Fundstelle" ||
        selectedElement.Type == "Begehungsfläche")
    {
        EnableCreateButton();
    }
    else
    {
        EnableEditButton();
        EnableDeleteButton();
    }

    _selectedElement = selectedElement;
}

function GetSelectedElement()
{
    return _selectedElement;
}