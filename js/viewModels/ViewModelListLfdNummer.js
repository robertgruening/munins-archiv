var ViewModelListLfdNummer = function (webServiceClient) {
	this._webServiceClient = webServiceClient;

	this._createModel = function () {
		return new LfdNummer();
	};
};

ViewModelListLfdNummer.prototype = new ViewModelList();