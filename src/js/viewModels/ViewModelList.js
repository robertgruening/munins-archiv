var ViewModelList = function (webServiceClient) {
	//#region variables
	this._models = new Array();
	this._webServiceClient = webServiceClient;
	this._listeners = {
		loadAll: new Array(),
		delete: new Array()
	};
	//#endregion

	//#region methods
	//#region web service methods
	this.loadAll = function () {
		this._webServiceClient.LoadAll("loadAll");
	};

	this.delete = function (elementToBeDeleted) {
		this._webServiceClient.Delete(elementToBeDeleted, "delete");
	};
	//#endregion

	//#region observer methods
	this._registerToWebServiceClient = function () {
		this._webServiceClient.Register("loadAll", this);
		this._webServiceClient.Register("delete", this);
	};

	this.Update = function (data, sender) {
		switch (sender) {
			case "loadAll": {
				this._models = data;
				this._update("loadAll", data);
				break;
			}
			case "delete": {
				this._update("delete", data);
				this.loadAll();
				break;
			}
		}
	};

	this.Fail = function (messages, sender) {
		switch (sender) {
			case "loadAll": {
				this._failLoadAll(messages);
				break;
			}
		}
	};

	this._failLoadAll = function (messages) {
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

		this._listeners.actions[eventName].forEach(function (item) {
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