var _webServiceClientAblage = new WebServiceClientAblage();
var _webServiceClientAblageType = new WebServiceClientAblageType();
var _selectedElement = null;
var _selectedParentElement = null;

function SetSelectedElement(selectedElement, sender)
{
    if (sender == undefined ||
        sender.indexOf("treeMove") >= 0)
    {
        return;
    }

    DisableCreateButton();
    DisableEditButton();
    DisableMoveButton();
    DisableDeleteButton();	

    console.log(selectedElement);

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

function SetSelectedParentElement(selectedParentElement, sender)
{
    if (sender == undefined ||
        sender.indexOf("treeMove") == -1)
    {
        return;
    }

    _selectedParentElement = selectedParentElement;
}

function GetSelectedParentElement()
{
    return _selectedParentElement;
}