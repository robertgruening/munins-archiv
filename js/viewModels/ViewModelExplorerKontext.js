var ViewModelExplorerKontext = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new Kontext();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			parent: new Array(),
			path: new Array(),
			children: new Array(),
			type: new Array(),
			lfdNummern: new Array(),
			lastCheckedDate: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model === null ? undefined : this._model.Id);
		this._update("bezeichnung", this._model === null ? undefined : this._model.Bezeichnung);
		this._update("parent", this._model === null ? undefined : this._model.Parent);
		this._update("path", this._model === null ? undefined : this._model.Path);
		this._update("children", this._model === null ? undefined : this._model.Children);
		this._update("type", this._model === null ? undefined : this._model.Type);
		this._update("lfdNummern", this._model === null ? undefined : this._model.LfdNummern);
		this._update("lastCheckedDate", this._model === null ? undefined : this._model.LastCheckedDate);
	};

	this._createAbstractRoot = function () {
		var abstractRoot = new Object();

		abstractRoot.Bezeichnung = "Kontext";
		abstractRoot.Path = "/";
		abstractRoot.Parent = null;
		abstractRoot.Children = new Array();
		abstractRoot.Type = null;
		abstractRoot.LfdNummern = new Array();
		abstractRoot.LastCheckedDate = null;

		return abstractRoot;
	};

	this.getType = function () {
		if (this._model === null) {
			return undefined;
		}

		return this._model.Type;
	};
};

ViewModelExplorerKontext.prototype = new ViewModelExplorer();
