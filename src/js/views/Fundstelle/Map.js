var _viewModelExplorerKontext = null;

$(document).ready(function() {
	var viewModelFactory = new ViewModelFactory();
	_viewModelExplorerKontext = viewModelFactory.getViewModelExplorerKontext();

	InitMap();

	_viewModelExplorerKontext.load();
});

function getPageName() {
	return "FundstelleMap";
}

//#region map
var _map = null;

function InitMap()
{
	_map = L.map("divMap").setView([51.163375, 10.447683333333], 5);
	_map.options.minZoom = 5;
	_map.options.maxZoom = 13;
	L.control.scale().addTo(_map);
	L.tileLayer("/Munins Archiv/src/api/Services/mapTiles/{z}/{x}/{y}.png").addTo(_map);

	_viewModelExplorerKontext.register("children", new GuiClient(setGeoPointMarkers, showErrorMessages));
}

function setGeoPointMarkers(children) {
	console.info("setting value of 'children'");
	
	if (children == null)
	{		
		return;
	}
	
	for (var i = 0; i < children.length; i++)
	{
		if (children[i].GeoPoint != null &&
			 children[i].GeoPoint.Latitude != null &&
			 children[i].GeoPoint.Longitude != null)
		{
			var marker = L.marker([children[i].GeoPoint.Latitude, children[i].GeoPoint.Longitude]);
			marker.bindPopup("Fundstelle: <a href='/Munins Archiv/src/pages/Fundstelle/Form.html?Id=" + children[i].Id + "' target=_blank>" + children[i].Bezeichnung + "</a>");
			marker.addTo(_map);
		}
	}
}
//#endregion
