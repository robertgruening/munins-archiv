var ViewModelExplorerOrt = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new Ort();
	};

	this._createPropertyListeners = function () {
		return {
			id: new Array(),
			bezeichnung: new Array(),
			parent: new Array(),
			path: new Array(),
			children: new Array()
		};
	};

	this._updateAllPropertyListeners = function () {
		this._update("id", this._model === null ? undefined : this._model.Id);
		this._update("bezeichnung", this._model === null ? undefined : this._model.Bezeichnung);
		this._update("parent", this._model === null ? undefined : this._model.Parent);
		this._update("path", this._model === null ? undefined : this._model.Path);
		this._update("children", this._model === null ? undefined : this._model.Children);
	};

	this._createAbstractRoot = function () {
		var abstractRoot = new Object();

		abstractRoot.Bezeichnung = "Ort";
		abstractRoot.Path = "/";
		abstractRoot.Parent = null;
		abstractRoot.Children = new Array();

		return abstractRoot;
	};
};

ViewModelExplorerOrt.prototype = new ViewModelExplorer();