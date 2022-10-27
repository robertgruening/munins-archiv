var ViewModelListAblageType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new AblageType();
	};
};

ViewModelListAblageType.prototype = new ViewModelList();