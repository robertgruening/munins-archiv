var ViewModelFactory = function () {
    this.getViewModelFormFund = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormFund(webServiceClientFactory.getWebServiceClientFund());
        viewModel.init();

        return viewModel;
    };
};