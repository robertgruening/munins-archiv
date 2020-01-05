var _webServiceClientOrt = new WebServiceClientOrt();
_webServiceClientOrt.init();

var _selectedOrt = null;

function SetSelectedOrt(selectedOrt, sender)
{
    _selectedOrt = selectedOrt;
}

function GetSelectedOrt()
{
    return _selectedOrt;
}