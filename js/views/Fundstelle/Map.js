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
	_map.options.maxZoom = 17;
	L.control.scale().addTo(_map);
	L.tileLayer("/openstreetmap/mapTiles/{z}/{x}/{y}.png").addTo(_map);

	_viewModelExplorerKontext.register("children", new GuiClient(setGeoPointMarkers, showErrorMessages));
}

function setGeoPointMarkers(children) {
	console.info("setting value of 'children'");

	var countOfChildrenWithGeoPoint = 0;
	var countOfChildrenWithoutGeoPoint = 0;
	
	if (children == null)
	{
		$("#labelCountOfChildrenWithGeoPoint").text(countOfChildrenWithGeoPoint);
		$("#labelCountOfChildrenWithoutGeoPoint").text(countOfChildrenWithoutGeoPoint);
		return;
	}	
	
	for (var i = 0; i < children.length; i++)
	{
		if (children[i].GeoPoint != null &&
			 children[i].GeoPoint.Latitude != null &&
			 children[i].GeoPoint.Longitude != null)
		{
			countOfChildrenWithGeoPoint++;

			var icon = L.icon({
				iconUrl : "/munins-archiv/images/map/marker-icon.png",
				iconSize: [25, 41],
    			iconAnchor: [13, 41],
				popupAnchor: [0, -41]
			});
			
			var marker = L.marker([children[i].GeoPoint.Latitude, children[i].GeoPoint.Longitude]);
			marker.bindPopup("Fundstelle: <a href='/munins-archiv/pages/Fundstelle/Form.html?Id=" + children[i].Id + "' target=_blank>" + children[i].Bezeichnung + "</a>");
			marker.title = "Fundstelle: " + children[i].Bezeichnung;
			marker.alt = "Fundstelle: " + children[i].Bezeichnung;
			marker.setIcon(icon);
			marker.addTo(_map);
		}
		else
		{
			countOfChildrenWithoutGeoPoint++;
		}
	}
	
	$("#labelCountOfChildrenWithGeoPoint").text(countOfChildrenWithGeoPoint);
	$("#labelCountOfChildrenWithoutGeoPoint").text(countOfChildrenWithoutGeoPoint);	
}
//#endregion
