var ViewModelSearchResultList = function (webServiceClient) {
	//#region variables
	this._searchConditions = new Array();
	this._sortingConditions = new Array();
	this._models = new Array();
	this._currentPagerIndexElement = null;
	this._nextPagerIndexElement = null;
	this._count = 0;
	this._selectedItem = null;
	this._webServiceClient = webServiceClient;
	this._listeners = {
		actions: {
			search: new Array(),
			dataChanged: new Array(),
			itemSelected : new Array(),
			selectionCleared : new Array()
		},
		properties: {
			count: new Array()
		}
	};
	//#endregion

	//#region methods
	//#region web service methods
	this.search = function (searchConditions) {
		this._searchConditions = searchConditions;
		this._webServiceClient.search(searchConditions, null, null, "search");
	};

	this.goToFirstPage = function() {
		this._webServiceClient.search(this._searchConditions, null, null, "search");
	}

	this.goToPreviousPage = function() {
		pagingConditions = new Array();
		pagingConditions.push({ "key" : "pageIndexElementId", "value" : this._currentPagerIndexElement == null ? null : this._currentPagerIndexElement.Id });
		pagingConditions.push({ "key" : "pagingDirection", "value" : "backward" });

		this._webServiceClient.search(this._searchConditions, pagingConditions, null, "search");
	}

	this.goToNextPage = function() {
		pagingConditions = new Array();
		pagingConditions.push({ "key" : "pageIndexElementId", "value" : this._nextPagerIndexElement == null ? null : this._nextPagerIndexElement.Id });
		pagingConditions.push({ "key" : "pagingDirection", "value" : "forward" });

		this._webServiceClient.search(this._searchConditions, pagingConditions, null, "search");
	}

	this.goToLastPage = function() {
		pagingConditions = new Array();
		pagingConditions.push({ "key" : "pagingDirection", "value" : "backward" });

		this._webServiceClient.search(this._searchConditions, pagingConditions, null, "search");
	}
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

	this._showSearchResult = function(data) {
		this._nextPagerIndexElement = null;
		this._currentPagerIndexElement = null;
		this._models = new Array();

		if (data.data.length >= 1) {
			this._currentPagerIndexElement = data.data[0];
		}

		if (data.data.length == 11) {
			this._nextPagerIndexElement = data.data[10];
		}

		for (let i = 0; i < data.data.length && i < 10; i++) {
			this._models.push(data.data[i]);
		}

		this._count = data.count;
		this._update("dataChanged", this._models);
		this.clearSelection();
		this._update("search", this._models);
		this._update("count", this._count);
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
	this.init = function () {
		this._registerToWebServiceClient();
	};
	//#endregion
};