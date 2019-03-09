function FundViewModel(webServiceClient)
{
	//#region variables
	this._fund = new Fund();
	this._webServiceClientFund = webServiceClient;
	this._listeners = {
		dataChanged: new Array(),
		dataResetted: new Array(),
		load: new Array(),
		create: new Array(),
		save: new Array(),
		delete: new Array(),
		id: new Array(),
		bezeichnung: new Array(),
		fundAttribute: new Array(),
		anzahl: new Array(),
		dimension1: new Array(),
		dimension2: new Array(),
		dimension3: new Array(),
		masse: new Array(),
		kontext: new Array(),
		ablage: new Array()
	};
	//#endregion

	//#region properties
	//#region Bezeichnung
	this.getBezeichnung = function() {
		return this._fund.Bezeichnung;
	};
	
	this.setBezeichnung = function(bezeichnung) {
		this._fund.Bezeichnung = bezeichnung;
		this._update("dataChanged");
	};
	//#endregion
	
	//#region Fundattribute
	this.addFundAttribut = function(fundAttribut) {
		this._fund.FundAttribute.push(fundAttribut);
		this._update("dataChanged");
		this._update("fundAttribute", this._fund.FundAttribute);
	};
	
	this.removeFundAttribut = function(fundAttribut) {
		for (i = 0; i < this._fund.FundAttribute.length; i++)
		{
			if (this._fund.FundAttribute[i].Id == fundAttribut.Id)
			{
				this._fund.FundAttribute.splice(i, 1);
				break;
			}
		}
		this._update("dataChanged");
		this._update("fundAttribute", this._fund.FundAttribute);
	};
	//#endregion

	//#region Anzahl
	this.getAnzahl = function() {
		return this._fund.Anzahl;
	};
	
	this.setAnzahl = function(anzahl) {
		this._fund.Anzahl = anzahl;
		this._update("dataChanged");
	};
	//#endregion

	//#region Dimension1
	this.getDimension1 = function() {
		return this._fund.Dimension1;
	};
	
	this.setDimension1 = function(dimension1) {
		this._fund.Dimension1 = dimension1;
		this._update("dataChanged");
	};
	//#endregion

	//#region Dimension2
	this.getDimension2 = function() {
		return this._fund.Dimension2;
	};
	
	this.setDimension2 = function(dimension2) {
		this._fund.Dimension2 = dimension2;
		this._update("dataChanged");
	};
	//#endregion

	//#region Dimension3
	this.getDimension3 = function() {
		return this._fund.Dimension3;
	};
	
	this.setDimension3 = function(dimension3) {
		this._fund.Dimension3 = dimension3;
		this._update("dataChanged");
	};
	//#endregion

	//#region Masse
	this.getMasse = function() {
		return this._fund.Masse;
	};
	
	this.setMasse = function(masse) {
		this._fund.Masse = masse;
		this._update("dataChanged");
	};
	//#endregion

	//#region Ablage
	this.getAblage = function() {
		return this._fund.Ablage;
	};
	
	this.setAblage = function(ablage) {
		this._fund.Ablage = ablage;
		this._update("dataChanged");
	};
	//#endregion

	//#region Kontext
	this.getKontext = function() {
		return this._fund.Kontext;
	};
	
	this.setKontext = function(kontext) {
		this._fund.Kontext = kontext;
		this._update("dataChanged");
	};
	//#endregion
	//#endregion

	//#region methods
	//#region web service methods
	this.load = function(id) {
		var fund = new Object();
		fund.Id = id;
		this._webServiceClientFund.Load(fund, "load");
	};

	this.create = function() {
		this._webServiceClientFund.Create(this._fund, "create");
	};

	this.save = function() {
		if (this._fund.Id == null)
		{
			this.create();
		}
		else
		{
			this._webServiceClientFund.Save(this._fund, "save");
		}
	};

	this.delete = function() {
		this._webServiceClientFund.Delete(this._fund, "delete");
	};

	this.undoAllChanges = function() {
		if (this._fund.Id == undefined)
		{
			this._updateAllPropertyListeners(new Fund());
			this._update("dataResetted");			
		}
		else
		{
			this._webServiceClientFund.Load(this._fund, "load");
		}
	};
	//#endregion

	//#region observer methods
	this._registerToWebServiceClientFund = function()
	{
		this._webServiceClientFund.Register("load", this);
		this._webServiceClientFund.Register("create", this);
		this._webServiceClientFund.Register("save", this);
		this._webServiceClientFund.Register("delete", this);
	}

	this.Update = function(data, sender)
	{
		switch (sender) {
			case "load": {
				this._updateAllPropertyListeners(data);
				this._update("dataResetted");
				this._update("load");
				break;
			}
			case "create": {
				this._updateAllPropertyListeners(data);
				this._update("dataResetted");
				this._update("create");
				break;
			}
			case "save": {
				this._updateAllPropertyListeners(data);
				this._update("dataResetted");
				this._update("save");
				break;
			}
			case "delete": {
				this._updateAllPropertyListeners(new Fund());
				this._update("dataResetted");
				this._update("delete");
				break;
			}
		}
	};

	this.updateAllListeners = function() {
		this._updateAllPropertyListeners(this._fund);
	};

	this._updateAllPropertyListeners = function(element) {
		this._fund = element;

		this._update("id", this._fund.Id);
		this._update("bezeichnung", this._fund.Bezeichnung);
		this._update("fundAttribute", this._fund.FundAttribute);
		this._update("anzahl", this._fund.Anzahl);
		this._update("dimension1", this._fund.Dimension1);
		this._update("dimension2", this._fund.Dimension2);
		this._update("dimension3", this._fund.Dimension3);
		this._update("masse", this._fund.Masse);
		this._update("ablage", this._fund.Ablage);
		this._update("kontext", this._fund.Kontext);
	};

	this.Fail = function(messages, sender)
	{		
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

	this._failLoad = function(messages) {
		this._fail("load", messages);
	};

	this._failCreate = function(messages) {
		var properties = [
			"id",
			"bezeichnung",
			"fundAttribute",
			"anzahl",
			"dimension1",
			"dimension2",
			"dimension3",
			"masse",
			"ablage",
			"kontext"
		];

		for (var i = 0; i < messages.length; i++)
		{
			for (var j = 0; j < properties.length; j++)
			{
				if (messages[i].toLowerCase().startsWith(properties[j].toLowerCase()))
				{
					this._fail(properties[j], messages);
					break;
				}
			}
		}
		this._fail("create", messages);
	};

	this._failSave = function(messages) {
		this._fail("save", messages);
	};

	this._failDelete = function(messages) {
		this._fail("delete", messages);
	};
	//#endregion

	//#region observable subject methods
	this.register = function(eventName, listener) {
		if (listener == undefined ||
			listener == null)
		{
			return;
		}

		if (this._listeners[eventName] == undefined)
		{
			return;
		}
		
		this._listeners[eventName].push(listener);
	};

	this._update = function(eventName, data) {
		if (this._listeners[eventName] == undefined)
		{
			return;
		}
		
		this._listeners[eventName].forEach(function(item) {
			item.Update(data);
		});
	};

	this._fail = function(eventName, messages) {
		if (this._listeners[eventName] == undefined)
		{
			return;
		}
		
		this._listeners[eventName].forEach(function(item) {
			item.Fail(messages);
		});
	};
	//#endregion
	//#endregion

	//#region init
	this._registerToWebServiceClientFund();
	//#endregion
}