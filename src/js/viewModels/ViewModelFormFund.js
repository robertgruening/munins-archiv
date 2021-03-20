var ViewModelFormFund = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new Fund();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			fundAttribute: new Array(),
			anzahl: new Array(),
			dimension1: new Array(),
			dimension2: new Array(),
			dimension3: new Array(),
			masse: new Array(),
			kontext: new Array(),
			ablage: new Array(),
			fileName: new Array(),
			folderName: new Array(),
			rating: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
		this._update("fundAttribute", this._model.FundAttribute);
		this._update("anzahl", this._model.Anzahl);
		this._update("dimension1", this._model.Dimension1);
		this._update("dimension2", this._model.Dimension2);
		this._update("dimension3", this._model.Dimension3);
		this._update("masse", this._model.Masse);
		this._update("kontext", this._model.Kontext);
		this._update("ablage", this._model.Ablage);
		this._update("fileName", this._model.FileName);
		this._update("folderName", this._model.FolderName);
		this._update("rating", this._model.Rating);
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

	//#region Fundattribute
	this.addFundAttribut = function (fundAttribut) {
		this._model.FundAttribute.push(fundAttribut);
		this._update("dataChanged");
		this._update("fundAttribute", this._model.FundAttribute);
	};

	this.removeFundAttribut = function (fundAttribut) {
		for (i = 0; i < this._model.FundAttribute.length; i++) {
			if (this._model.FundAttribute[i].Id == fundAttribut.Id) {
				this._model.FundAttribute.splice(i, 1);
				break;
			}
		}
		this._update("dataChanged");
		this._update("fundAttribute", this._model.FundAttribute);
	};
	//#endregion

	//#region Anzahl
	this.getAnzahl = function () {
		return this._model.Anzahl;
	};

	this.setAnzahl = function (anzahl) {
		this._model.Anzahl = anzahl;
		this._update("dataChanged");
	};
	//#endregion

	//#region Dimension1
	this.getDimension1 = function () {
		return this._model.Dimension1;
	};

	this.setDimension1 = function (dimension1) {
		this._model.Dimension1 = dimension1;
		this._update("dataChanged");
	};
	//#endregion

	//#region Dimension2
	this.getDimension2 = function () {
		return this._model.Dimension2;
	};

	this.setDimension2 = function (dimension2) {
		this._model.Dimension2 = dimension2;
		this._update("dataChanged");
	};
	//#endregion

	//#region Dimension3
	this.getDimension3 = function () {
		return this._model.Dimension3;
	};

	this.setDimension3 = function (dimension3) {
		this._model.Dimension3 = dimension3;
		this._update("dataChanged");
	};
	//#endregion

	//#region Masse
	this.getMasse = function () {
		return this._model.Masse;
	};

	this.setMasse = function (masse) {
		this._model.Masse = masse;
		this._update("dataChanged");
	};
	//#endregion

	//#region Ablage
	this.getAblage = function () {
		return this._model.Ablage;
	};

	this.setAblage = function (ablage) {
		this._model.Ablage = ablage;
		this._update("dataChanged");
		this._update("ablage", this._model.Ablage);
	};
	//#endregion

	//#region Kontext
	this.getKontext = function () {
		return this._model.Kontext;
	};

	this.setKontext = function (kontext) {
		this._model.Kontext = kontext;
		this._update("dataChanged");
		this._update("kontext", this._model.Kontext);
	};
	//#endregion

	//#region FileName
	this.getFileName = function () {
		return this._model.FileName;
	};

	this.setFileName = function (fileName) {
		this._model.FileName = fileName;
		this._update("dataChanged");
	};
	//#endregion

	//#region FolderName
	this.getFolderName = function () {
		return this._model.FolderName;
	};

	this.setFolderName = function (folderName) {
		this._model.FolderName = folderName;
		this._update("dataChanged");
	};
	//#endregion

	//#region Bewertung
	this.getRating = function () {
		return this._model.Rating;
	};

	this.setRating = function (rating) {
		this._model.Rating = rating;
		this._update("dataChanged");
	};
	//#endregion
	//#endregion

	//#region methods
	//#endregion
};

ViewModelFormFund.prototype = new ViewModelForm();