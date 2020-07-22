var WebServiceClientFund = function () {
	this.init = function () {
		this._modelName = "Fund";
	};

	this.search = function (searchConditions, pageIndexElementId, sender) {
		var controller = this;

		let urlParameters = new Array();

		if (searchConditions != undefined &&
			searchConditions != null)
		{
			for (let i = 0; i < searchConditions.length; i++)
			{
				urlParameters.push(encodeURI(searchConditions[i].key) + "=" + encodeURI(searchConditions[i].value));
			}
		}

		if (pageIndexElementId != undefined &&
			pageIndexElementId != null)
		{
			urlParameters.push("pageIndexElementId=" + pageIndexElementId);
		}		

		$.ajax(
			{
				type: "GET",
				url: "../../api/Services/" + this.getModelName() + "/?" + urlParameters.join("&"),
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					controller.Update("search", data, sender);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 500) {
						controller.Fail("search", jqXHR.responseJSON, sender);
					}
					else {
						controller.Fail("search", new Array("Es ist ein Servicerfehle aufgetreten!"), sender);
					}
				}
			});
	};
}

WebServiceClientFund.prototype = new WebServiceClient();