function FundViewModel()
{
	//#region variables
	this._fund = null;
	this._hasChanged = false;
	this._webServiceClientFund = new WebServiceClientFund();
	this._listeners = {
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

	//#region init
	_webServiceClientFund.Register("load", this);
	_webServiceClientFund.Register("create", this);
	_webServiceClientFund.Register("save", this);
	_webServiceClientFund.Register("delete", this);
	//#endregion

	//#region properties
	//#region Bezeichnung
	this.getBezeichnung = function() {
		return this._fund.Bezeichnung;
	};
	
	this.setBezeichnung = function(bezeichnung) {
		this._fund.Bezeichnung = bezeichnung;
		this._hasChanged = true;
	};
	//#endregion
	
	//#region Fundattribute
	this.addFundAttribut = function(fundAttribut) {
		this._fund.FundAttribute.push(fundAttribut);
		this._hasChanged = true;
	};
	
	this.removeFundAttribut = function(fundAttribut) {
		for (i = 0; i < this._fund.FundAttribute.length; i++)
		{
			if (this._fund.FundAttribute[i].Id == fundAttribut.Id)
			{
				this._fund.FundAttribute.splice(i, 0);
				break;
			}
		}
		this._hasChanged = true;
	};
	//#endregion

	//#region Anzahl
	this.getAnzahl = function() {
		return this._fund.Anzahl;
	};
	
	this.setAnzahl = function(anzahl) {
		this._fund.Anzahl = anzahl;
		this._hasChanged = true;
	};
	//#endregion

	//#region Dimension1
	this.getDimension1 = function() {
		return this._fund.Dimension1;
	};
	
	this.setDimension1 = function(dimension1) {
		this._fund.Dimension1 = dimension1;
		this._hasChanged = true;
	};
	//#endregion

	//#region Dimension2
	this.getDimension2 = function() {
		return this._fund.Dimension2;
	};
	
	this.setDimension2 = function(dimension2) {
		this._fund.Dimension2 = dimension2;
		this._hasChanged = true;
	};
	//#endregion

	//#region Dimension3
	this.getDimension3 = function() {
		return this._fund.Dimension3;
	};
	
	this.setDimension3 = function(dimension3) {
		this._fund.Dimension3 = dimension3;
		this._hasChanged = true;
	};
	//#endregion

	//#region Masse
	this.getMasse = function() {
		return this._fund.Masse;
	};
	
	this.SsetMasse = function(masse) {
		this._fund.Masse = masse;
		this._hasChanged = true;
	};
	//#endregion

	//#region Ablage
	this.getAblage = function() {
		return this._fund.Ablage;
	};
	
	this.setAblage = function(ablage) {
		this._fund.Ablage = ablage;
		this._hasChanged = true;
	};
	//#endregion

	//#region Kontext
	this.getKontext = function() {
		return this._fund.Kontext;
	};
	
	this.setKontext = function(kontext) {
		this._fund.Kontext = kontext;
		this._hasChanged = true;
	};
	//#endregion

	//#region status
	this.hasChanged = function() {
		return this._hasChanged;
	};
	//#endregion
	//#endregion

	//#region methods
	//#region web service methods
	this.load = function(id) {
		var fund = new Object();
		fund.Id = id;
		_webServiceClientFund.Load(fund, "load");
	};

	this.create = function() {
		_webServiceClientFund.Create(this._fund, "create");
	};

	this.save = function() {
		_webServiceClientFund.Save(this._fund, "save");
	};

	this.delete = function() {
		_webServiceClientFund.Delete(this._fund, "delete");
	};
	//#endregion

	//#region observer methods
	this.Update = function(data, sender)
	{		
		switch (sender) {
			case "load": {
				this._updateLoad(data);
				break;
			}
			case "create": {
				this._updateCreate(data);
				break;
			}
			case "save": {
				this._updateSave(data);
				break;
			}
			case "delete": {
				this._updateDelete(data);
				break;
			}
		}
	};

	this._updateLoad = function(element) {
		this._fund = element;		
		this._hasChanged = false;

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

	this._updateCreate = function(element) {
		this._hasChanged = false;
	};

	this._updateSave = function(element) {
		this._hasChanged = false;
	};

	this._updateDelete = function() {
		this._hasChanged = false;
	};

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
			item.Fail(data);
		});
	};
	//#endregion
	//#endregion
}