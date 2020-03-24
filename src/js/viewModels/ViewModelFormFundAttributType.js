var ViewModelFormFundAttributType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new FundAttributType();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			countOfFundAttributen: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
		this._update("countOfFundAttributen", this._model.CountOfFundAttributen);
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

	//#region Anzahl von Fundattributen
	this.getCountOfFundAttributen = function () {
		return this._model.CountOfFundAttributen;
	};
	//#endregion
	//#endregion

	//#region methods
	//#endregion
};

ViewModelFormFundAttributType.prototype = new ViewModelForm();