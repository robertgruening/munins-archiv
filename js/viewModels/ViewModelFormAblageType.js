var ViewModelFormAblageType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new AblageType();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			countOfAblagen: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
		this._update("countOfAblagen", this._model.CountOfAblagen);
	};

	//#region properties
	//#region Bezeichnung
	this.getBezeichnung = function () {
		return this._model.Bezeichnung;
	};

	this.setBezeichnung = function (bezeichnung) {
		console.log("'Bezeichnung' changed to '" + bezeichnung + "'");
		this._model.Bezeichnung = bezeichnung;
		this._update("dataChanged");
	};
	//#endregion

	//#region Anzahl von Ablagen
	this.getCountOfAblagen = function () {
		return this._model.CountOfAblagen;
	};
	//#endregion
	//#endregion

	//#region methods
	//#endregion
};

ViewModelFormAblageType.prototype = new ViewModelForm();