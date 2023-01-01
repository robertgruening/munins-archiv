var ViewModelFormAblage = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new Ablage();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			type: new Array(),
			parent: new Array(),
			children: new Array(),
			path: new Array(),
			funde: new Array(),
			guid: new Array(),
			kontexte: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
		this._update("type", this._model.Type);
		this._update("parent", this._model.Parent);
		this._update("children", this._model.Children);
		this._update("path", this._model.Path);
		this._update("funde", this._model.Funde);
		this._update("guid", this._model.Guid);
		this._update("kontexte", this._model.Kontexte);
	};

	//#region properties
	//#region Id
	this.getId = function () {
		return this._model.Id;
	};
	//#endregion

	//#region Bezeichnung
	this.getBezeichnung = function () {
		return this._model.Bezeichnung;
	};

	this.setBezeichnung = function (bezeichnung) {
		this._model.Bezeichnung = bezeichnung;
		this._update("dataChanged");
	};
	//#endregion

	//#region Type
	this.getType = function () {
		return this._model.Type;
	};

	this.setType = function (type) {
		this._model.Type = type;
		this._update("dataChanged");
	};
	//#endregion

	//#region Parent
	this.getParent = function () {
		return this._model.Parent;
	};

	this.setParent = function (parent) {
		this._model.Parent = parent;
		this._update("dataChanged");
	};
	//#endregion

	//#region Children
	this.addChild = function (child) {
		this._model.Children.push(child);
		this._update("dataChanged");
		this._update("children", this._model.Children);
	};

	this.removeChild = function (child) {
		for (i = 0; i < this._model.Children.length; i++) {
			if (this._model.Children[i].Id == child.Id) {
				this._model.Children.splice(i, 1);
				break;
			}
		}
		this._update("dataChanged");
		this._update("children", this._model.Children);
	};
	//#endregion

	//#region Path
	this.getPath = function () {
		return this._model.Path;
	};
	//#endregion

	//#region Funde
	this.addFund = function (fund) {
		this._model.Funde.push(fund);
		this._update("dataChanged");
		this._update("funde", this._model.Funde);
	};

	this.removeFund = function (fund) {
		for (i = 0; i < this._model.Funde.length; i++) {
			if (this._model.Funde[i].Id == fund.Id) {
				this._model.Funde.splice(i, 1);
				break;
			}
		}
		this._update("dataChanged");
		this._update("funde", this._model.Funde);
	};
	//#endregion

	//#region GUID
	this.getGuid = function () {
		return this._model.Guid;
	};
	//#endregion

	//#region Kontexte
	this.getKontexte = function () {
		return this._model.Kontexte;
	};
	//#endregion
	//#endregion

	//#region methods
	//#region web service methods
	this.loadByGuid = function (guid) {
		var model = new Object();
		model.Guid = guid;
		this._webServiceClient.LoadByGuid(model, "load");
	};
	//#endregion
	//#endregion
};

ViewModelFormAblage.prototype = new ViewModelForm();
