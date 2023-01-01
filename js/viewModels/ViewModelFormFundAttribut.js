var ViewModelFormFundAttribut = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new FundAttribut();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			type: new Array(),
			parent: new Array(),
			children: new Array(),
			path: new Array(),
			countOfFunde: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model.Id);
		this._update("bezeichnung", this._model.Bezeichnung);
		this._update("type", this._model.Type);
		this._update("parent", this._model.Parent);
		this._update("children", this._model.Children);
		this._update("path", this._model.Path);
		this._update("countOfFunde", this._model.CountOfFunde);
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
	//#endregion

	//#region methods
	//#endregion
};

ViewModelFormFundAttribut.prototype = new ViewModelForm();