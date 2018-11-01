var _webServiceClientAblage = new WebServiceClientAblage();
var _selectedAblage = null;

function SetSelectedAblage(selectedAblage, sender)
{
    _selectedAblage = selectedAblage;
}

function GetSelectedAblage()
{
    return _selectedAblage;
}