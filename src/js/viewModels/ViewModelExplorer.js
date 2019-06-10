var ViewModelExplorer = function (webServiceClient) {
	this._createModel = function () {
		return null;
	};

	this._createPropertyListeners = function () {
		return new Array();
	};

	this._updateAllPropertyListeners = function () {
	};

	this._createAbstractRoot = function () {
		return null;
	};

	//#region variables
	this._model = null;
	this._selectedParentItem = null;
	this._selectedChildItem = null;
	this._webServiceClient = webServiceClient;
	this._listeners = {
		actions : {
			loadRoots: new Array(),
			load: new Array(),
			create: new Array(),
			save: new Array(),
			delete: new Array(),
			dataChanged: new Array(),
			parentItemSelected : new Array(),
			parentSelectionCleared : new Array(),
			childItemSelected : new Array(),
			childSelectionCleared : new Array(),
		},
		properties : new Array()
	};
	//#endregion

	//#region methods
	//#region web service methods
	this.load = function (id) {

		if (id == undefined)
		{
			this._webServiceClient.LoadAll("loadRoots");
		}
		else
		{
			var model = new Object();
			model.Id = id;
			this._webServiceClient.Load(model, "load");
		}
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
	 * Gets the selected parent item.
	 * @public
	 */
	this.getSelectedParentItem = function () {
		return this._selectedParentItem;
	};

	/**
	 * Clears the selection of the parent item.
	 * @public
	 */
	this.clearParentSelection = function () {
		this._selectedParentItem = null;
		this._update("parentSelectionCleared");
	};

	/**
	 * Sets the given item as selected. If the item is already selected it becomes unselected.
	 * @public
	 */
	this.selectParentItem = function () {
		if (this._model.Parent === null) {
			console.debug("Model has no parent item.");
			return;
		}

		if (this._selectedParentItem !== null)
		{
			console.debug("The selected parent item is already selected. Selection will be cleared.");
			this.clearParentSelection();
			return;
		}

		console.debug("Parent item will be set as selected parent item.");
		this._selectedParentItem = this._model.Parent;
		var args = {
			SelectedItem : this._selectedParentItem,
			Index : 0
		};
		this._update("parentItemSelected", args);
	};

	/**
	 * Gets the selected child item.
	 * @public
	 */
	this.getSelectedChildItem = function () {
		return this._selectedChildItem;
	};

	/**
	 * Clears the selection of the child item.
	 * @public
	 */
	this.clearChildSelection = function () {
		this._selectedChildItem = null;
		this._update("childSelectionCleared");
	};

	/**
	 * Sets the given child item as selected. If the item is already selected it becomes unselected.
	 * @param {model} childItem The child item that is to be set as selected.
	 * @public
	 */
	this.selectChildItem = function (childItem) {
		console.info("setting selected child item");

		if (childItem == undefined ||
			childItem == null) {
			console.error("child item to be set as selected is not set!");
			this.clearChildSelection();
			return;
		}

		if (this._selectedChildItem != null &&
			childItem.Id == this._selectedChildItem.Id)
		{
			console.debug("selected child item is already selected");
			this.clearChildSelection();
			return;
		}

		for (var i = 0; i < this._model.Children.length; i++) {
			if (this._model.Children[i].Id == childItem.Id) {
				console.debug("Child item to be set as selected is in the list of child items.");				
				this._selectedChildItem = this._model.Children[i];
				var args = {
					SelectedItem : this._selectedChildItem,
					Index : i
				};
				this._update("childItemSelected", args);
				return;
			}
		}
	};

	this.getSelectedItem = function () {
		console.info("returning selected item");

		if (this._selectedParentItem !== null) {
			console.debug("selected item is the parent");
			return this._selectedParentItem;
		}
		else if (this._selectedChildItem !== null) {
			console.debug("selected item is a child");
			return this._selectedChildItem;
		}
		else {
			console.debug("nothing is selected");
			return null;
		}
	};

	this.hasParent = function () {
		return this._model.Parent !== undefined &&
			this._model.Parent !== null;
	};

	this.getChildren = function () {
		return this._model.Children !== undefined &&
			this._model.Children !== null;
	};

	this.openParent = function () {
		if (!this.hasParent()){
			return;
		}

		this.load(this._model.Parent.Id);
	};

	this.openAbstractRoot = function () {
		this.load();
	};

	//#region observer methods
	/**
	 * Registers this instance as listener to the events offered by the WebServiceClient.
	 * @private
	 */
	this._registerToWebServiceClient = function () {
		this._webServiceClient.Register("loadAll", this);
		this._webServiceClient.Register("load", this);
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
			case "loadRoots": {
				this._loadRootElements(data);
				break;
			}
			case "load": {
				this._loadElement(data);
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

	this._loadRootElements = function(elements) {
		this._model = this._createAbstractRoot();
		this._model.Children = elements;

		this._updateAllPropertyListeners();
		this._update("dataChanged", this._model);
		this.clearParentSelection();
		this.clearChildSelection();
		this._update("load", this._model);
	}

	this._loadElement = function(element) {
		this._model = element;

		if (this._model.Parent == undefined ||
			this._model.Parent == null) {
			this._model.Parent = this._createAbstractRoot();
		}

		this._updateAllPropertyListeners();
		this._update("dataChanged", this._model);
		this.clearParentSelection();
		this.clearChildSelection();
		this._update("load", this._model);
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
	this._initPropertyListeners = function () {
		this._listeners.properties = this._createPropertyListeners();
	};

	this.init = function () {
		this._initPropertyListeners();
		this._registerToWebServiceClient();
	};
	//#endregion
};