var _webServiceClientAblageType = new WebServiceClientAblageType();
var _webServiceClientAblage = new WebServiceClientAblage();

function OpenAblageFormular(ablage)
{
    window.open("Form.html?Id=" + ablage.id, "_self");
}