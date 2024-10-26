var ViewModelListOrtType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new OrtType();
	};
};

ViewModelListOrtType.prototype = new ViewModelList();