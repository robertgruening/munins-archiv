var ViewModelList = function (webServiceClient) {
	//#region variables
	this._models = new Array();
	this._selectedItem = null;
	this._webServiceClient = webServiceClient;
	this._listeners = {
		loadAll: new Array(),
		create: new Array(),
		save: new Array(),
		delete: new Array(),
		dataChanged: new Array(),
		itemSelected : new Array(),
		selectionCleared : new Array()
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

	/**
	 * Gets the selected item.
	 * @public
	 */
	this.getSelectedItem = function () {
		return this._selectedItem;
	};

	/**
	 * Clears the selection of an item.
	 * @public
	 */
	this.clearSelection = function () {
		this._selectedItem = null;
		this._update("selectionCleared");
	};

	/**
	 * Sets the given item as selected. If the item is already selected it becomes unselected.
	 * @param {model} item The item that is to be set as selected.
	 * @public
	 */
	this.selectItem = function (item) {
		if (item == undefined ||
			item == null) {
			console.log("ERROR: Item to be set as selected is not set!");
			this._update("selectionCleared");
			return;
		}

		if (this._selectedItem != null &&
			item.Id == this._selectedItem.Id)
		{
			console.log("DEBUG: The selected item is already selected. Selection will be cleared.");
			this.clearSelection();
			return;
		}

		for (var i = 0; i < this._models.length; i++) {
			if (this._models[i].Id == item.Id) {
				console.log("DEBUG: Item to be set as selected is in the list.");
				this._selectedItem = this._models[i];
				var args = {
					SelectedItem : this._selectedItem,
					Index : i
				};
				this._update("itemSelected", args);
				break;
			}
		}
	};

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
		this.clearSelection();
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
		this.clearSelection();
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
		this.clearSelection();
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
		this.clearSelection();
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
				this._update("dataChanged", this._models);
				this._fail("loadAll", messages);
				break;
			}
			case "create": {
				this._fail("create", messages);
				break;
			}
			case "save": {
				this._fail("save", messages);
				break;
			}
			case "delete": {
				this._fail("delete", messages);
				break;
			}
		}
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