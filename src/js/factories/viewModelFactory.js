var ViewModelFactory = function () {
    this.getViewModelListAblageType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelListAblageType(webServiceClientFactory.getWebServiceClientAblageType());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormFund = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormFund(webServiceClientFactory.getWebServiceClientFund());
        viewModel.init();

        return viewModel;
    };
};