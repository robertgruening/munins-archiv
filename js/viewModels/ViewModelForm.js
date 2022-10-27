var ViewModelForm = function (webServiceClient) {
	this._createModel = function () {
		return null;
	};

	this._createPropertyListeners = function () {
		return new Array();
	};

	this._updateAllPropertyListeners = function () {
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
	this._registerToWebServiceClient = function () {
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
				this._update("dataResetted", this._model);
				this._update("load", this._model);
				break;
			}
			case "create": {
				this._model = data;
				this._updateAllPropertyListeners();
				this._update("dataResetted", this._model);
				this._update("create", this._model);
				break;
			}
			case "save": {
				this._model = data;
				this._updateAllPropertyListeners();
				this._update("dataResetted", this._model);
				this._update("save", this._model);
				break;
			}
			case "delete": {
				this._model = this._createModel();
				this._updateAllPropertyListeners();
				this._update("dataResetted", this._model);
				this._update("delete", data);
				break;
			}
		}
	};

	// TODO: to review, überdenken, siehe Nutzung im Formular
	this.updateAllListeners = function () {
		this._updateAllPropertyListeners();
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

	this._getPropertyNameAsInMessage = function (propertyName) {
		switch (propertyName) {
			case "type" : {
				return "Typ";
			}
			case "category" : {
				return "Kategorie";
			}
			default : {
				return propertyName;
			}
		}
	};

	this._failCreate = function (messages) {
		var properties = Object.keys(this._listeners.properties);

		properties.forEach(property => {
			var messagesForOneProperty = new Array();

			messages.forEach(message => {
				if (message.toLowerCase().startsWith(this._getPropertyNameAsInMessage(property).toLowerCase())) {
					messagesForOneProperty.push(message);
				}
			});

			if (messagesForOneProperty.length > 0) {
				this._fail(property, messagesForOneProperty);
			}
		});

		var messagesForNoProperty = new Array();

		messages.forEach(message => {
			var isAboutProperty = false;

			for (var i = 0; i < properties.length; i++) {
				if (message.toLowerCase().startsWith(this._getPropertyNameAsInMessage(properties[i]).toLowerCase())) {
					isAboutProperty = true;
					break;
				}
			}

			if (!isAboutProperty) {
				messagesForNoProperty.push(message);
			}
		});

		if (messagesForNoProperty.length > 0) {
			this._fail("create", messagesForNoProperty);
		}
	};

	this._failSave = function (messages) {
		var properties = Object.keys(this._listeners.properties);

		properties.forEach(property => {
			var messagesForOneProperty = new Array();

			messages.forEach(message => {
				if (message.toLowerCase().startsWith(this._getPropertyNameAsInMessage(property).toLowerCase())) {
					messagesForOneProperty.push(message);
				}
			});

			if (messagesForOneProperty.length > 0) {
				this._fail(property, messagesForOneProperty);
			}
		});

		var messagesForNoProperty = new Array();

		messages.forEach(message => {
			var isAboutProperty = false;

			for (var i = 0; i < properties.length; i++) {
				if (message.toLowerCase().startsWith(this._getPropertyNameAsInMessage(properties[i]).toLowerCase())) {
					isAboutProperty = true;
					break;
				}
			}

			if (!isAboutProperty) {
				messagesForNoProperty.push(message);
			}
		});

		if (messagesForNoProperty.length > 0) {
			this._fail("save", messagesForNoProperty);
		}
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
			this._registerToWebServiceClient();
		};
		//#endregion
	};
