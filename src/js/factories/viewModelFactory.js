var ViewModelFactory = function () {
    this.getViewModelFormAblage = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormAblage(webServiceClientFactory.getWebServiceClientAblage());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormAblageType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormAblageType(webServiceClientFactory.getWebServiceClientAblageType());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormFundAttributType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormFundAttributType(webServiceClientFactory.getWebServiceClientFundAttributType());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormOrtType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormOrtType(webServiceClientFactory.getWebServiceClientOrtType());
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

    this.getViewModelExplorerAblage = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelExplorerAblage(webServiceClientFactory.getWebServiceClientAblage());
        viewModel.init();

        return viewModel;
    };
};