var ViewModelSearchResultList = function (webServiceClient) {
	//#region variables
	this._models = new Array();
	this._selectedItem = null;
	this._webServiceClient = webServiceClient;
	this._listeners = {
		search: new Array(),
		dataChanged: new Array(),
		itemSelected : new Array(),
		selectionCleared : new Array()
	};
	//#endregion

	//#region methods
	//#region web service methods
	this.search = function (searchConditions, pageIndexElementId) {
		this._webServiceClient.search(searchConditions, pageIndexElementId, "search");
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
			console.error("Item to be set as selected is not set!");
			this._update("selectionCleared");
			return;
		}

		if (this._selectedItem != null &&
			item.Id == this._selectedItem.Id)
		{
			console.debug("The selected item is already selected. Selection will be cleared.");
			this.clearSelection();
			return;
		}

		for (var i = 0; i < this._models.length; i++) {
			if (this._models[i].Id == item.Id) {
				console.debug("Item to be set as selected is in the list.");
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
		this._webServiceClient.Register("search", this);
	};

	/**
	 * Implements the Update() method of the observer interface.
	 * @public
	 * @param {Array<Object> | Object} data - Depending on the listener an array of elements or one element is expected. 
	 * @param {string} listener - Name of the listener. 
	 */
	this.Update = function (data, listener) {
		switch (listener) {
			case "search": {
				this._showSearchResult(data);
				break;
			}
		}
	};

	this._showSearchResult = function(elements) {
		this._models = elements;
		this._update("dataChanged", this._models);
		this.clearSelection();
		this._update("search", this._models);
	}

	/**
	 * Implements the Fail() method of the observer interface.
	 * @public
	 * @param {Array<string>} messages - Array of message strings. 
	 * @param {string} listener - Name of the listener. 
	 */
	this.Fail = function (messages, listener) {
		switch (listener) {
			case "search": {
				this._update("dataChanged", this._models);
				this._fail("search", messages);
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