var ViewModelFactory = function () {
    //#region forms
    this.getViewModelFormAblage = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormAblage(webServiceClientFactory.getWebServiceClientAblage());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormFundstelle = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormFundstelle(webServiceClientFactory.getWebServiceClientKontext());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormBegehung = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormBegehung(webServiceClientFactory.getWebServiceClientKontext());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormBegehungsflaeche = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormBegehungsflaeche(webServiceClientFactory.getWebServiceClientKontext());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormFundAttribut = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormFundAttribut(webServiceClientFactory.getWebServiceClientFundAttribut());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelFormOrt = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormOrt(webServiceClientFactory.getWebServiceClientOrt());
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

    this.getViewModelFormLfdNummer = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelFormLfdNummer(webServiceClientFactory.getWebServiceClientLfdNummer());
        viewModel.init();

        return viewModel;
    };
    //#endregion

    //#region lists
    this.getViewModelListAblageType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelListAblageType(webServiceClientFactory.getWebServiceClientAblageType());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelListKontextType = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelListKontextType(webServiceClientFactory.getWebServiceClientKontextType());
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

    this.getViewModelListLfdNummer = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelListLfdNummer(webServiceClientFactory.getWebServiceClientLfdNummer());
        viewModel.init();

        return viewModel;
    };
    //#endregion

    //#region explorer
    this.getViewModelExplorerAblage = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelExplorerAblage(webServiceClientFactory.getWebServiceClientAblage());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelExplorerFundAttribut = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelExplorerFundAttribut(webServiceClientFactory.getWebServiceClientFundAttribut());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelExplorerKontext = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelExplorerKontext(webServiceClientFactory.getWebServiceClientKontext());
        viewModel.init();

        return viewModel;
    };

    this.getViewModelExplorerOrt = function()
    {
        var webServiceClientFactory = new WebServiceClientFactory();
        var viewModel = new ViewModelExplorerOrt(webServiceClientFactory.getWebServiceClientOrt());
        viewModel.init();

        return viewModel;
    };
    //#endregion
};
