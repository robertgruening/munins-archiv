var _map = null;
var _popup = null;

$(function() {
	$("#divMap").width(1000);
	$("#divMap").height(700);
	
	_popup = L.popup();
	
	_map = L.map("divMap").setView([49.47997, 10.98847], 17);
	L.tileLayer("http://localhost/Munins%20Archiv/prototypes/v2/Karten/{z}/{x}/{y}.png").addTo(_map);
	_map.on("click", onMapClick);
	
	var marker = L.marker([49.47997, 10.98847]).addTo(_map);
	marker.bindPopup("Fundstelle: <b>42</b>").openPopup();
	
	var tk25_6531 = L.polygon([
		[49.5, 10.8333333],
		[49.5, 11.0],
		[49.4, 11.0],
		[49.4, 10.8333333]
	], {
	}).addTo(_map);
	tk25_6531.bindPopup("TK25: <b>6531</b> <i>Fürth</i>").openPopup();
});

function onMapClick(e) {
    _popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(_map);
}
