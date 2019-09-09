var ViewModelListKontextType = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new KontextType();
	};
};

ViewModelListKontextType.prototype = new ViewModelList();