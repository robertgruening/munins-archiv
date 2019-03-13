var _webServiceClientFundAttribut = new WebServiceClientFundAttribut();
_webServiceClientFundAttribut.init();

var _selectedFundAttribut = null;

function SetSelectedFundAttribut(selectedFundAttribut, sender)
{
    _selectedFundAttribut = selectedFundAttribut;
}

function GetSelectedFundAttribut()
{
    return _selectedFundAttribut;
}