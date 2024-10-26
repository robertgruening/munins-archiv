var ViewModelListFundAttributType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new FundAttributType();
	};
};

ViewModelListFundAttributType.prototype = new ViewModelList();