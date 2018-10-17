var _webServiceClientOrt = new WebServiceClientOrt();
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
    else if (selectedElement.Type == null)
    {
        EnableCreateButton();
    }
    else
    {
        EnableCreateButton();
        EnableEditButton();
        EnableMoveButton();
        EnableDeleteButton();
    }

    _selectedElement = selectedElement;
}

function GetSelectedElement()
{
    return _selectedElement;
}