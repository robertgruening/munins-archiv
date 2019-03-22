var ViewModelFormAblageType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new AblageType();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
	};

	//#region properties
	//#region Bezeichnung
	this.getBezeichnung = function () {
		return this._model.Bezeichnung;
	};

	this.setBezeichnung = function (bezeichnung) {
		this._model.Bezeichnung = bezeichnung;
		this._update("dataChanged");
	};
	//#endregion
	//#endregion

	//#region methods
	//#endregion
};

ViewModelFormAblageType.prototype = new ViewModelForm();