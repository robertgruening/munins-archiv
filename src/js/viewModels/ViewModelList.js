var ViewModelList = function (webServiceClient) {
	//#region variables
	this._models = new Array();
	this._webServiceClient = webServiceClient;
	this._listeners = {
		loadAll: new Array(),
		create: new Array(),
		save: new Array(),
		delete: new Array(),
		dataChanged: new Array()
	};
	//#endregion

	//#region methods
	//#region web service methods
	this.loadAll = function () {
		this._webServiceClient.LoadAll("loadAll");
	};

	this.create = function (elementToBeCreated) {
		this._webServiceClient.Create(elementToBeCreated, "create");
	};

	this.save = function (elementToBeSaved) {
		this._webServiceClient.Save(elementToBeSaved, "save");
	};

	this.delete = function (elementToBeDeleted) {
		this._webServiceClient.Delete(elementToBeDeleted, "delete");
	};
	//#endregion

	//#region observer methods
	/**
	 * Registers this instance as listener to the events offered by the WebServiceClient.
	 * @private
	 */
	this._registerToWebServiceClient = function () {
		this._webServiceClient.Register("loadAll", this);
		this._webServiceClient.Register("create", this);
		this._webServiceClient.Register("save", this);
		this._webServiceClient.Register("delete", this);
	};

	/**
	 * Implements the Update() method of the observer interface.
	 * @public
	 * @param {Array<Object> | Object} data - Depending on the listener an array of elements or one element is expected. 
	 * @param {string} listener - Name of the listener. 
	 */
	this.Update = function (data, listener) {
		switch (listener) {
			case "loadAll": {
				this._loadAllElements(data);
				break;
			}
			case "create": {
				this._addElement(data);
				break;
			}
			case "save": {
				this._saveElement(data);
				break;
			}
			case "delete": {
				this._deleteElement(data);
				break;
			}
		}
	};

	this._loadAllElements = function(elements) {
		this._models = elements;
		this._update("dataChanged", this._models);
		this._update("loadAll", this._models);
	}

	this._addElement = function(element) {

		// #region workaround for jsGrid
		var foundAndUpdated = false;

		for (var i = 0; i < this._models.length; i++)
		{
			if (this._models[i].Bezeichnung == element.Bezeichnung)
			{
				this._models[i] = element;
				foundAndUpdated = true;
				break;
			}
		}
		// #endregion

		if (!foundAndUpdated) {
			this._models.push(element);
		}

		this._update("dataChanged", this._models);
		this._update("create", element);
	};

	this._saveElement = function(element) {
		
		for (var i = 0; i < this._models.length; i++)
		{
			if (this._models[i].Id == element.Id)
			{
				this._models[i] = element;
				break;
			}
		}

		this._update("dataChanged", this._models);
		this._update("save", element);
	};

	this._deleteElement = function(element) {
		
		for (var i = 0; i < this._models.length; i++)
		{
			if (this._models[i].Id == element.Id)
			{
				this._models.splice(i, 1);
				break;
			}
		}

		this._update("dataChanged", this._models);
		this._update("delete", element);
	};

	/**
	 * Implements the Fail() method of the observer interface.
	 * @public
	 * @param {Array<string>} messages - Array of message strings. 
	 * @param {string} listener - Name of the listener. 
	 */
	this.Fail = function (messages, listener) {
		switch (listener) {
			case "loadAll": {
				this._failLoadAll(messages);
				break;
			}
			case "create": {
				this._update("dataChanged", this._models);
				this._fail("create", messages);
				break;
			}
			case "save": {
				this._update("dataChanged", this._models);
				this._fail("save", messages);
				break;
			}
			case "delete": {
				this._update("dataChanged", this._models);
				this._fail("delete", messages);
				break;
			}
		}
	};

	this._failLoadAll = function (messages) {
		this._update("dataChanged", this._models);
		this._fail("loadAll", messages);
	};
	//#endregion

	//#region observable subject methods
	this.register = function (eventName, listener) {
		if (listener == undefined ||
			listener == null ||
			this._listeners[eventName] == undefined) {
			return;
		}

		this._listeners[eventName].push(listener);
	};

	this._update = function (eventName, data) {
		if (this._listeners[eventName] == undefined) {
			return;
		}

		this._listeners[eventName].forEach(function (item) {
			item.Update(data);
		});
	};

	this._fail = function (eventName, messages) {
		if (this._listeners[eventName] == undefined) {
			return;
		}

		this._listeners[eventName].forEach(function (item) {
			item.Fail(messages);
		});
	};
	//#endregion
	//#endregion

	//#region init
	this.init = function () {
		this._registerToWebServiceClient();
	};
	//#endregion
};