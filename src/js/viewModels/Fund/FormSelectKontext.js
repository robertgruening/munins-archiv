var _webServiceClientKontext = new WebServiceClientKontext();
_webServiceClientKontext.init();

var _selectedKontext = null;

function SetSelectedKontext(selectedKontext, sender)
{
    _selectedKontext = selectedKontext;
}

function GetSelectedKontext()
{
    return _selectedKontext;
}