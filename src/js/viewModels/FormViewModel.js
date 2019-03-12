var FormViewModel = function (webServiceClient) {
	this._createModel = function () {
		return null;
	};

	this._createPropertyListeners = function () {
		return new Array();
	};

	//#region variables
	this._model = null;
	this._webServiceClient = webServiceClient;
	this._listeners = {
		actions: {
			dataChanged: new Array(),
			dataResetted: new Array(),
			load: new Array(),
			create: new Array(),
			save: new Array(),
			delete: new Array()
		},
		properties: new Array()
	};
	//#endregion

	//#region methods
	//#region web service methods
	this.load = function (id) {
		var model = new Object();
		model.Id = id;
		this._webServiceClient.Load(model, "load");
	};

	this.create = function () {
		this._webServiceClient.Create(this._model, "create");
	};

	this.save = function () {
		if (this._model.Id == null) {
			this.create();
		}
		else {
			this._webServiceClient.Save(this._model, "save");
		}
	};

	this.delete = function () {
		this._webServiceClient.Delete(this._model, "delete");
	};

	this.undoAllChanges = function () {
		if (this._model.Id == undefined) {
			this._model = this._createModel();
			this._updateAllPropertyListeners();
			this._update("dataResetted");
		}
		else {
			this._webServiceClient.Load(this._model, "load");
		}
	};
	//#endregion

	//#region observer methods
	this._registerToWebServiceClientFund = function () {
		this._webServiceClient.Register("load", this);
		this._webServiceClient.Register("create", this);
		this._webServiceClient.Register("save", this);
		this._webServiceClient.Register("delete", this);
	};

	this.Update = function (data, sender) {
		switch (sender) {
			case "load": {
				this._model = data;
				this._updateAllPropertyListeners();
				this._update("dataResetted");
				this._update("load");
				break;
			}
			case "create": {
				this._model = data;
				this._updateAllPropertyListeners();
				this._update("dataResetted");
				this._update("create");
				break;
			}
			case "save": {
				this._model = data;
				this._updateAllPropertyListeners();
				this._update("dataResetted");
				this._update("save");
				break;
			}
			case "delete": {
				this._model = this._createModel();
				this._updateAllPropertyListeners();
				this._update("dataResetted");
				this._update("delete");
				break;
			}
		}
	};

	// TODO: to review, überdenken, siehe Nutzung im Formular
	this.updateAllListeners = function () {
		this._updateAllPropertyListeners();
	};

	this._updateAllPropertyListeners = function () {
	};

	this.Fail = function (messages, sender) {
		switch (sender) {
			case "load": {
				this._failLoad(messages);
				break;
			}
			case "create": {
				this._failCreate(messages);
				break;
			}
			case "save": {
				this._failSave(messages);
				break;
			}
			case "delete": {
				this._failDelete(messages);
				break;
			}
		}
	};

	this._failLoad = function (messages) {
		this._fail("load", messages);
	};

	this._failCreate = function (messages) {
		var properties = Object.keys(this._listeners.properties);

		for (var i = 0; i < messages.length; i++) {
			for (var j = 0; j < properties.length; j++) {
				if (messages[i].toLowerCase().startsWith(properties[j].toLowerCase())) {
					this._fail(properties[j], messages);
					break;
				}
			}
		}
		this._fail("create", messages);
	};

	this._failSave = function (messages) {
		this._fail("save", messages);
	};

	this._failDelete = function (messages) {
		this._fail("delete", messages);
	};
	//#endregion

	//#region observable subject methods
	this.register = function (eventName, listener) {
		if (listener == undefined ||
			listener == null) {
			return;
		}

		if (this._isActionListener(eventName)) {
			this._listeners.actions[eventName].push(listener);
		}
		else if (this._isPropertyListener(eventName)) {
			this._listeners.properties[eventName].push(listener);
		}
	};

	this._update = function (eventName, data) {
		if (this._isActionListener(eventName)) {
			this._listeners.actions[eventName].forEach(function (item) {
				item.Update(data);
			});
		}
		else if (this._isPropertyListener(eventName)) {
			this._listeners.properties[eventName].forEach(function (item) {
				item.Update(data);
			});
		}
	};

	this._fail = function (eventName, messages) {
		if (this._isActionListener(eventName)) {
			this._listeners.actions[eventName].forEach(function (item) {
				item.Fail(messages);
			});
		}
		else if (this._isPropertyListener(eventName)) {
			this._listeners.properties[eventName].forEach(function (item) {
				item.Fail(messages);
			});
		}
	};

	this._isActionListener = function (eventName) {
		var actionListenerNames = Object.keys(this._listeners.actions);

		for (var i = 0; i < actionListenerNames.length; i++) {
			if (actionListenerNames[i] === eventName) {
				return true;
			}
		};

		return false;
	};

	this._isPropertyListener = function (eventName) {
		var propertyListenerNames = Object.keys(this._listeners.properties);

		for (var i = 0; i < propertyListenerNames.length; i++) {
			if (propertyListenerNames[i] === eventName) {
				return true;
			}
		};

		return false;
	};
	//#endregion
	//#endregion

	//#region init
	this._initModel = function () {
		this._model = this._createModel();
	};

	this._initPropertyListeners = function () {
		this._listeners.properties = this._createPropertyListeners();
	};

	this.init = function () {
		this._initModel();
		this._initPropertyListeners();
		this._registerToWebServiceClientFund();
	};
	//#endregion
};