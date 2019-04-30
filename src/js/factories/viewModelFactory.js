var ViewModelFactory = function () {
    this.getViewModelFormFund = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormFund(webServiceClientFactory.getWebServiceClientFund());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelListAblageType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelListAblageType(webServiceClientFactory.getWebServiceClientAblageType());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelListFundAttributType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelListFundAttributType(webServiceClientFactory.getWebServiceClientFundAttributType());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelListOrtType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelListOrtType(webServiceClientFactory.getWebServiceClientOrtType());
        viewModel.init();

        return viewModel;
    };
};