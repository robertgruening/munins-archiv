var ViewModelListOrtCategory = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new OrtCategory();
	};
};

ViewModelListOrtCategory.prototype = new ViewModelList();