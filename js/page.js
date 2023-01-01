$(function() {
    setSizes();

	$(window).resize(function() {
	    setSizes();
    });
});

function setSizes() {
    $("#leftSidebar").height(
	    $("body").height() -
        $("#navigation").outerHeight() -        
        $("#clipboard").outerHeight() -
        16 /* #leftSidebar.padding-top */
    );
}

function checkBezeichnung(control) {
    var tmp = $(control).val().replace(/\/+/g, "");
    $(control).val(tmp);
}

function containsUrlParameter(name)
{
    var url = window.location.search.substring(1);
    var parameters = url.split("&");

    for (var i = 0; i < parameters.length; i++)
    {
        var parameter = parameters[i].split("=");

        if (parameter[0].toLowerCase() == name.toLowerCase())
        {
            return true;
        }
    }

    return false;
}

function getUrlParameterValue(name)
{
    var url = window.location.search.substring(1);
    var parameters = url.split("&");

    for (var i = 0; i < parameters.length; i++)
    {
        var parameter = parameters[i].split("=");

        if (parameter[0] == name)
        {
            return parameter[1];
        }
    }

    return null;
}

function getFormMode()
{
	if (containsUrlParameter("id"))
	{
		return "edit";
	}

	return "create";
}

function openFormNewElement()
{
	window.open(window.location.href.replace(window.location.search, ""), "_self");
}

function getMuninsArchivBaseUrl() {
	return "https://127.0.0.1/Munins Archiv";
}

function getWebdavFundImageBaseUrl() {
    return "https://aaf:gwf@192.168.0.220:9111/remote.php/dav/files/aaf/AAF/Fundstellen/Akten";
}

function getFundImageBaseUrl() {
    return "https://192.168.0.220:9111/munins-archiv-image-service-php/image.php";
}