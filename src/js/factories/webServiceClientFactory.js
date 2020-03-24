var WebServiceClientFactory = function () {
    this.getWebServiceClientAblage = function()
    {
        var webServiceClient = new WebServiceClientAblage();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientAblageType = function()
    {
        var webServiceClient = new WebServiceClientAblageType();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientFund = function()
    {
        var webServiceClient = new WebServiceClientFund();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientFundAttribut = function()
    {
        var webServiceClient = new WebServiceClientFundAttribut();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientFundAttributType = function()
    {
        var webServiceClient = new WebServiceClientFundAttributType();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientKontext = function()
    {
        var webServiceClient = new WebServiceClientKontext();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientKontextType = function()
    {
        var webServiceClient = new WebServiceClientKontextType();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientLfdNummer = function()
    {
        var webServiceClient = new WebServiceClientLfdNummer();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientOrt = function()
    {
        var webServiceClient = new WebServiceClientOrt();
        webServiceClient.init();

        return webServiceClient;
    };

    this.getWebServiceClientOrtType = function()
    {
        var webServiceClient = new WebServiceClientOrtType();
        webServiceClient.init();

        return webServiceClient;
    };
};