var _viewModelFormFundstelle = null;
var _viewModelListKontextType = null;

$(document).ready(function () {
	var viewModelFactory = new ViewModelFactory();
	_viewModelFormFundstelle = viewModelFactory.getViewModelFormFundstelle();
	_viewModelListKontextType = viewModelFactory.getViewModelListKontextType();

	InitStatusChanged();
	InitButtonNew();
	InitButtonSave();
	InitButtonDelete();
	InitButtonUndo();
	InitButtonToOverview();
	InitButtonToMap();
	InitButtonSelectLfdNummer();
	InitButtonEditGeoPoint();
	InitButtonDeleteGeoPoint();

	InitFieldId();
	InitFieldType();
	InitFieldBezeichnung();
	InitFieldPath();
	InitFieldCountOfChildren();
	InitFieldLfdNummern();
	InitGeoPoint();
});

function getPageName() {
	if (getFormMode() == "create") {
		return "FundstelleFormNew";
	}
	else if (getFormMode() == "edit") {
		return "FundstelleFormEdit";
	}
}

function loadForm() {
	console.info("loading form");

	if (getUrlParameterValue("Id")) {
		console.debug("Kontext is requested by ID", getUrlParameterValue("Id"));
		_viewModelFormFundstelle.load(getUrlParameterValue("Id"));
	}
	else if (getUrlParameterValue("Parent_Id")) {
		console.debug("creation of a new Kontext is requested with parent ID", getUrlParameterValue("Parent_Id"));
		var parent = new Kontext();
		parent.Id = getUrlParameterValue("Parent_Id");

		_viewModelFormFundstelle.setParent(parent);
		showMessageParentSet();
		_viewModelFormFundstelle.updateAllListeners();
	}
	else {
		console.debug("there is no Kontext requested");
		_viewModelFormFundstelle.updateAllListeners();
	}
}

function InitStatusChanged() {
	_viewModelFormFundstelle.register("load", new GuiClient(showMessageLoaded, showErrorMessages));
	_viewModelFormFundstelle.register("create", new GuiClient(loadCreatedElement, showErrorMessages));
	_viewModelFormFundstelle.register("save", new GuiClient(showMessageSaved, showErrorMessages));
	_viewModelFormFundstelle.register("delete", new GuiClient(showMessageDeleted, showErrorMessages));
}

function loadCreatedElement(element) {
	window.open(window.location.href.replace(window.location.search, "") + "?Id=" + element.Id, "_self");
}

//#region messages
function showMessageParentSet() {
	$showInformationMessageBox("übergeordnete Kontext gesetzt");
}

function showMessageLoaded(element) {
	showSuccessMessageBox("Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") geladen");
}

function showMessageSaved(element) {
	showSuccessMessageBox("Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gespeichert");
}

function showMessageDeleted(element) {
	showSuccessMessageBox("Kontext \"" + element.Bezeichnung + "\" (" + element.Type.Bezeichnung + ") gelöscht");
}
//#endregion

//#region form fields

//#region Id
function InitFieldId() {
	_viewModelFormFundstelle.register("id", new GuiClient(setId, showErrorMessages));
}

function setId(id) {
	if (id == null) {
		document.title = "Kontext";
		DisableButtonDelete();
	}
	else {
		document.title = "Kontext: (" + id + ")";
		EnableButtonDelete();
	}
}
//#endregion

//#region Type
function InitFieldType() {
	console.info("initialising field 'Kontext type'");

	_viewModelFormFundstelle.register("type", new GuiClient(setType, showMessagesType));

	_viewModelListKontextType.register("loadAll", new GuiClient(fillSelectionKontextType, showMessagesType));
	_viewModelListKontextType.loadAll();

	$("#selectType").change(function () {

		if ($("#selectType").val() == undefined ||
			 $("#selectType").val() == null ||
			 $("#selectType").val().length == 0)
		{
			_viewModelFormFundstelle.setType(null);
			return;
		}

		var kontextType = new KontextType();
		kontextType.Id = $("#selectType").val();
		kontextType.Bezeichnung = $("#selectType option:selected").text();

		_viewModelFormFundstelle.setType(kontextType);
	});
}

function fillSelectionKontextType(kontextTypes) {
	console.info("setting values of field 'Kontext type'");
	console.debug("values of 'Kontext type'", kontextTypes);
	$("#selectType").empty();
	$("#selectType").append("<option value='' >Bitte wählen</option>");

	kontextTypes.forEach(kontextType => {
		if (kontextType.Bezeichnung == "Fundstelle")
		{
			$("#selectType").append("<option value=" + kontextType.Id + " text=\"" + kontextType.Bezeichnung + "\">" + kontextType.Bezeichnung + "</option>");
		}
	});

	loadForm();
}

function setType(type) {
	console.info("setting value of 'type'");
	console.debug("type is ", type);
	$("#selectType option[value='" + type.Id + "']").attr("selected","selected");
}

function showMessagesType(messages) {
	$("#divType .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Bezeichnung
function InitFieldBezeichnung() {
	_viewModelFormFundstelle.register("bezeichnung", new GuiClient(setBezeichnung, showMessagesBezeichnung));
	$("#textboxBezeichnung").change(function () {
		_viewModelFormFundstelle.setBezeichnung($("#textboxBezeichnung").val())
	});
}

function setBezeichnung(bezeichnung) {
	console.log("setting value of 'Bezeichnung' to " + bezeichnung);
	$("#textboxBezeichnung").val(bezeichnung);
}

function showMessagesBezeichnung(messages) {
	$("#divBezeichnung .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region Path
function InitFieldPath() {
	_viewModelFormFundstelle.register("path", new GuiClient(setPath, null));
}

function setPath(path) {
	console.info("setting value of 'Path'");
	console.debug("'Path' is", path);
	$("#labelPath").text(path);
}
//#endregion

//#region Anzahl von Children
function InitFieldCountOfChildren() {
	_viewModelFormFundstelle.register("children", new GuiClient(setCountOfChildren, null));
}

function setCountOfChildren(children) {
	console.info("setting value of 'count of children'");
	console.debug("children are ", children);
	$("#labelCountOfChildren").text(children.length);
}
//#endregion

//#region LfD-Nummern
function InitFieldLfdNummern() {
	_viewModelFormFundstelle.register("lfdNummern", new GuiClient(setLfdNummern, showMessagesLfdNummern));
}

function InitButtonSelectLfdNummer() {
	$("#buttonSelectLfdNummer").click(ShowFormSelectLfdNummer);
}

function ShowFormSelectLfdNummer() {
	$("#dialogSelectLfdNummer").dialog({
		height: "auto",
		title: "Lfd-Nummer auswählen",
		modal: true,
		buttons: {
			"Auswählen": function () {
				_viewModelFormFundstelle.addLfdNummer(GetSelectedLfdNummerNode());
				$(this).dialog("close");
			},
			"Abbrechen": function () {
				$(this).dialog("close");
			}
		}
	});
	_webServiceClientLfdNummer.LoadAll("listSelect.loaded");
	$("#dialogSelectLfdNummer").dialog("open");
}

function setLfdNummern(lfdNummern) {
	console.info("setting value of 'LfdNummern'");
	console.debug("LfdNummern are ", lfdNummern);

	$("#divLfdNummern div #divList").empty();

	if (lfdNummern.length == 0) {
		return;
	}

	$("#divLfdNummern div #divList").append($("<ul>"));

	lfdNummern.forEach(lfdNummer => {
		var li = $("<li>");

		var linkButtonDelete = $("<a>");
		linkButtonDelete.attr("title", "löschen");
		linkButtonDelete.attr("class", "ui-button risky-action");
		linkButtonDelete.attr("href", "javascript:removeLfdNummer(" + lfdNummer.Id + ");");

		var icon = $("<i>");
		icon.attr("class", "fas fa-trash-alt");
		linkButtonDelete.append(icon);
		li.append(linkButtonDelete);

		li.append("&nbsp;");

		var labelLfdNummer = $("<label>");
		labelLfdNummer.text(lfdNummer.Bezeichnung);
		li.append(labelLfdNummer);

		$("#divLfdNummern div #divList ul").append(li);
	});
}

function removeLfdNummer(lfdNummerId) {
	var lfdNummer = new Object();
	lfdNummer.Id = lfdNummerId;

	_viewModelFormFundstelle.removeLfdNummer(lfdNummer);
}

function showMessagesLfdNummern(messages) {
	$("#divLfdNummern .fieldValue div[name=messages]").text(messages);
}
//#endregion

//#region GeoPoint
var _map = null;
var _marker = null;
var _isGeoPointInEditMode = false;

function InitGeoPoint() {
	_map = L.map("divMap").setView([51.163375, 10.447683333333], 5);
	_map.options.minZoom = 5;
	_map.options.maxZoom = 17;
	L.control.scale().addTo(_map);
	L.tileLayer("/openstreetmap/mapTiles/{z}/{x}/{y}.png").addTo(_map);

	_viewModelFormFundstelle.register("geoPoint", new GuiClient(setGeoPointMarker, showErrorMessages));
}

function onMapClick(e) {
	_viewModelFormFundstelle.setGeoPoint({
		Latitude: e.latlng.lat,
		Longitude: e.latlng.lng
	});
}

function setGeoPointMarker(geoPoint) {
	console.info("setting value of 'geoPoint'");
	
	if (geoPoint == null)
	{
		if (_marker != null)
		{
			_marker.remove();
			_marker = null;
		}
		
		return;
	}
	
	if (_marker == null)
	{
		_marker = L.marker([geoPoint.Latitude, geoPoint.Longitude]);
		_marker.addTo(_map);

		if (!_isGeoPointInEditMode)
		{
			_map.setView([geoPoint.Latitude, geoPoint.Longitude], 17);
		}
	}
	
	refreshMapMarkerStatusIcon();
	_marker.setLatLng({
		lat: geoPoint.Latitude,
		lng: geoPoint.Longitude
	});
	
	_map.setView([geoPoint.Latitude, geoPoint.Longitude]);
}

function refreshMapMarkerStatusIcon()
{
	if (_marker == null)
	{
		return;
	}
	
	
	var iconFile = _isGeoPointInEditMode ? "marker-icon.png" : "marker-icon__disabled.png"
	var icon = L.icon({
		iconUrl : "/Munins Archiv/src/images/map/" + iconFile,
		iconSize: [25, 41],
		iconAnchor: [13, 41],
		popupAnchor: [0, -41]
	});
	
	_marker.setIcon(icon);
}

function InitButtonEditGeoPoint() {
	EnableButtonEditGeoPoint();
	_viewModelFormFundstelle.register("load", new GuiClient(EnableButtonEditGeoPoint, showErrorMessages));
	_viewModelFormFundstelle.register("create", new GuiClient(EnableButtonEditGeoPoint, showErrorMessages));
	_viewModelFormFundstelle.register("save", new GuiClient(EnableButtonEditGeoPoint, showErrorMessages));
	_viewModelFormFundstelle.register("dataResetted", new GuiClient(EnableButtonEditGeoPoint, showErrorMessages));
}

function EnableButtonEditGeoPoint() {
	_isGeoPointInEditMode = false;
	refreshMapMarkerStatusIcon();

	if (_map != null)
	{
		_map.off("click");
	}
	
	$("#buttonEditGeoPoint").off("click");
	$("#buttonEditGeoPoint").click(function () {
		if (_map != null)
		{
			_isGeoPointInEditMode = true;
			refreshMapMarkerStatusIcon();			
			_map.off("click");
			_map.on("click", onMapClick);
		}

		DisableButtonEditGeoPoint();
	});
	$("#buttonEditGeoPoint").removeClass("disabled");
	$("#buttonEditGeoPoint").prop("disabled", false);
}

function DisableButtonEditGeoPoint() {
	$("#buttonEditGeoPoint").off("click");
	$("#buttonEditGeoPoint").addClass("disabled");
	$("#buttonEditGeoPoint").prop("disabled", true);
}

function InitButtonDeleteGeoPoint() {
	DisableButtonDeleteGeoPoint();
	_viewModelFormFundstelle.register("geoPoint", new GuiClient(EnableButtonDeleteGeoPoint, showErrorMessages));
}

function EnableButtonDeleteGeoPoint(geoPoint) {
	if (geoPoint == null ||
		 geoPoint.Latitude == null ||
		 geoPoint.Longitude == null)
	{
		DisableButtonDeleteGeoPoint();
		return;
	}
		
	$("#buttonDeleteGeoPoint").off("click");
	$("#buttonDeleteGeoPoint").click(function () {
		_viewModelFormFundstelle.clearGeoPoint();
	});
	$("#buttonDeleteGeoPoint").removeClass("disabled");
	$("#buttonDeleteGeoPoint").prop("disabled", false);
}

function DisableButtonDeleteGeoPoint() {
	$("#buttonDeleteGeoPoint").off("click");
	$("#buttonDeleteGeoPoint").addClass("disabled");
	$("#buttonDeleteGeoPoint").prop("disabled", true);
}
//#endregion
//#endregion

//#region form actions
//#region new
function InitButtonNew() {
	EnableButtonNew();
}

function EnableButtonNew() {
	$("#buttonNew").off("click");
	$("#buttonNew").click(openFormNewElement);
	$("#buttonNew").removeClass("disabled");
	$("#buttonNew").prop("disabled", false);
}

function DisableButtonNew() {
	$("#buttonNew").off("click");
	$("#buttonNew").addClass("disabled");
	$("#buttonNew").prop("disabled", true);
}
//#endregion

//#region save
function InitButtonSave() {
	DisableButtonSave();
	_viewModelFormFundstelle.register("dataChanged", new GuiClient(EnableButtonSave, showErrorMessages));
	_viewModelFormFundstelle.register("dataResetted", new GuiClient(DisableButtonSave, showErrorMessages));
}

function EnableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").click(function ()
	{
		ResetPropertiesMessages();
		_viewModelFormFundstelle.save();
	});
	$("#buttonSave").removeClass("disabled");
	$("#buttonSave").prop("disabled", false);
}

function DisableButtonSave() {
	$("#buttonSave").off("click");
	$("#buttonSave").addClass("disabled");
	$("#buttonSave").prop("disabled", true);
}
//#endregion

//#region delete
function InitButtonDelete() {
	DisableButtonDelete();
}

function EnableButtonDelete() {
	$("#buttonDelete").off("click");
	$("#buttonDelete").click(ShowDialogDelete);
	$("#buttonDelete").removeClass("disabled");
	$("#buttonDelete").prop("disabled", false);
}

function DisableButtonDelete() {
	$("#buttonDelete").off("click");
	$("#buttonDelete").addClass("disabled");
	$("#buttonDelete").prop("disabled", true);
}

function ShowDialogDelete() {
	$("#dialogDelete").empty();
	$("#dialogDelete").append(
		$("<p>").append("Möchten Sie diese Kontext löschen?")
	);
	$("#dialogDelete").dialog({
		height: "auto",
		modal: true,
		buttons: {
			"Löschen": function () {
				_viewModelFormFundstelle.delete();

				$(this).dialog("close");
			},
			"Abbrechen": function () {
				$(this).dialog("close");
			}
		}
	});

	$("#DialogDelete").dialog("open");
}
//#endregion

//#region undo
function InitButtonUndo() {
	DisableButtonUndo();
	_viewModelFormFundstelle.register("dataChanged", new GuiClient(EnableButtonUndo, showErrorMessages));
	_viewModelFormFundstelle.register("dataResetted", new GuiClient(DisableButtonUndo, showErrorMessages));
	_viewModelFormFundstelle.register("dataResetted", new GuiClient(ResetPropertiesMessages, showErrorMessages));
}

function EnableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").click(function () {
		console.log("button 'undo' clicked");
		_viewModelFormFundstelle.undoAllChanges();
	});
	$("#buttonUndo").removeClass("disabled");
	$("#buttonUndo").prop("disabled", false);
}

function DisableButtonUndo() {
	$("#buttonUndo").off("click");
	$("#buttonUndo").addClass("disabled");
	$("#buttonUndo").prop("disabled", true);
}

function ResetPropertiesMessages() {
	$(".fieldValue div[name=messages]").empty();
}
//#endregion

//#region open overview
function InitButtonToOverview() {
	EnableButtonToOverview();
	_viewModelFormFundstelle.register("parent", new GuiClient(EnableButtonToOverview, showErrorMessages));
}

function EnableButtonToOverview(parent) {
	if (parent === undefined ||
		parent === null ||
		parent.Id === undefined)
	{
		$("#buttonToOverview").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html", "_self");
	}
	else {
		$("#buttonToOverview").attr("href", "/Munins Archiv/src/pages/Kontext/Explorer.html?Id=" + parent.Id, "_self");
	}

	$("#buttonToOverview").removeClass("disabled");
	$("#buttonToOverview").prop("disabled", false);
}

function DisableButtonToOverview() {
	$("#buttonToOverview").removeAttr("href");
	$("#buttonToOverview").addClass("disabled");
	$("#buttonToOverview").prop("disabled", true);
}
//#endregion

//#region open map
function InitButtonToMap() {
	$("#buttonToMap").attr("href", "/Munins Archiv/src/pages/Fundstelle/Map.html", "_self");
}
//#endregon
//#endregion
