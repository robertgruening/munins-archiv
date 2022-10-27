var ViewModelFormLfdNummer = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new LfdNummer();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			countOfKontexte: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
		this._update("countOfKontexte", this._model.CountOfKontexte);
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

	//#region Anzahl an Kontexten
	this.getCountOfKontexte = function () {
		return this._model.CountOfKontexte;
	};
	//#endregion
	//#endregion

	//#region methods
	//#endregion
};

ViewModelFormLfdNummer.prototype = new ViewModelForm();