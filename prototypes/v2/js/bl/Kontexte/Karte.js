var _map = null;
var _popup = null;

$(function() {
	$("#divMap").width(1000);
	$("#divMap").height(700);
	
	_popup = L.popup();
	
	_map = L.map("divMap").setView([49.47997, 10.98847], 11);
	_map.options.minZoom = 11;
	_map.options.maxZoom = 17;
	_map.zoomIn(17);
	L.control.scale().addTo(_map);
	L.tileLayer("/Munins%20Archiv/prototypes/v2/Karten/{z}/{x}/{y}.png").addTo(_map);
	_map.on("click", onMapClick);
	
	var marker = L.marker([49.47997, 10.98847]).addTo(_map);
	marker.bindPopup("Fundstelle: <b>42</b>").openPopup();
	
	var messtischblaetter = Array();
	for (var i = 65; i <= 66; i++)
	{
		for (var j = 28; j <= 31; j++)
		{
			messtischblaetter.push(createMesstischblatt(i, j));
		}
	}
		
	for (var i = 0; i < messtischblaetter.length; i++)
	{
		var polygon= L.polygon([
			messtischblaetter[i].nordWestEcke,
			messtischblaetter[i].nordOstEcke,
			messtischblaetter[i].suedOstEcke,
			messtischblaetter[i].suedWestEcke
		], {
		}).addTo(_map);
		polygon.bindPopup("TK25: <b>" + messtischblaetter[i].nordSuedNr.toString() + messtischblaetter[i].westOstNr.toString() + "</b> <i>" + messtischblaetter[i].name + "</i>").openPopup();	
	}
});

function onMapClick(e) {
    _popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(_map);
}

function createMesstischblatt(northSouthNr, westEastNr)
{	
	var messtischblatt = new Object();	
	messtischblatt.nordSuedNr = northSouthNr;
	messtischblatt.westOstNr = westEastNr;	
	messtischblatt.nordWestEcke = [GetNordKante(northSouthNr), GetWestKante(westEastNr)];
	messtischblatt.nordOstEcke = [GetNordKante(northSouthNr), GetOstKante(westEastNr)];
	messtischblatt.suedWestEcke = [GetSuedKante(northSouthNr), GetWestKante(westEastNr)];
	messtischblatt.suedOstEcke = [GetSuedKante(northSouthNr), GetOstKante(westEastNr)];
	messtischblatt.name = GetMesstischblattName(northSouthNr, westEastNr);
		
	return messtischblatt;
}

function GetWestKante(westEastNr)
{
	var messtischblatt_0101 = new Object();
	messtischblatt_0101.nordKante = 55 + (54 / 60);
	messtischblatt_0101.westKante = 5 + (50 / 60);
	
	var messtischblatt_Maß = new Object();
	messtischblatt_Maß.Hoehe = 6 / 60;
	messtischblatt_Maß.Breite = 10 / 60;
	
	return (messtischblatt_0101.westKante + (messtischblatt_Maß.Breite * (westEastNr - 1)));
}

function GetOstKante(westEastNr)
{
	return GetWestKante(westEastNr + 1);
}

function GetNordKante(northSouthNr)
{
	var messtischblatt_0101 = new Object();
	messtischblatt_0101.nordKante = 55 + (54 / 60);
	messtischblatt_0101.westKante = 5 + (50 / 60);
	
	var messtischblatt_Maß = new Object();
	messtischblatt_Maß.Hoehe = 6 / 60;
	messtischblatt_Maß.Breite = 10 / 60;
	
	return (messtischblatt_0101.nordKante - (messtischblatt_Maß.Hoehe * (northSouthNr - 1)));
}

function GetSuedKante(northSouthNr)
{
	return GetNordKante(northSouthNr + 1);
}

function GetMesstischblattName(northSouthNr, westEastNr)
{
	switch((northSouthNr * 100) + westEastNr)
	{
		case 6531 : 
		{
			return "Fürth";
		}
	};
	
	return "";
}
