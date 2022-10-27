var ViewModelFormOrtType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new OrtType();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			countOfOrten: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
		this._update("countOfOrten", this._model.CountOfOrten);
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

	//#region Anzahl von Orten
	this.getCountOfOrten = function () {
		return this._model.CountOfOrten;
	};
	//#endregion
	//#endregion

	//#region methods
	//#endregion
};

ViewModelFormOrtType.prototype = new ViewModelForm();