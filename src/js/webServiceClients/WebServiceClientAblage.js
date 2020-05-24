var WebServiceClientAblage = function () {
	this.init = function () {
		this._modelName = "Ablage";
	};

	this.LoadByGuid = function (element, sender) {
		var controller = this;

		$.ajax(
			{
				type: "GET",
				url: "../../api/Services/" + this.getModelName() + "/" + element.Guid,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					controller.Update("load", data, sender);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 500) {
						controller.Fail("load", jqXHR.responseJSON, sender);
					}
					else {
						controller.Fail("load", new Array("Es ist ein Servicerfehle aufgetreten!"), sender);
					}
				}
			});
	};

	this.LoadBySearchConditions = function (searchConditions, sender) {
		var controller = this;

		var urlQueryParametersString = this.convertToUrlQueryParametersString(searchConditions);
		var url = "../../api/Services/" + this.getModelName() + "/";

		if (urlQueryParametersString != null &&
			urlQueryParametersString.length >= 1){
			url += "?" + urlQueryParametersString;
		}

		$.ajax(
			{
				type: "GET",
				url: url,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					controller.Update("loadAll", data, sender);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 500) {
						controller.Fail("loadByFilterConditions", jqXHR.responseJSON, sender);
					}
					else {
						controller.Fail("loadByFilterConditions", new Array("Es ist ein Servicefehler aufgetreten!"), sender);
					}
				}
			});
	};

	this.convertToUrlQueryParametersString = function (searchConditions) {
		var urlQueryParametersString = "";

		if (searchConditions["hasParent"] != undefined) {
			urlQueryParametersString += "hasParent=" + searchConditions["hasParent"].toString();
		}

		if (searchConditions["hasChildren"] != undefined) {
			urlQueryParametersString += "hasChildren=" + searchConditions["hasChildren"].toString();
		}

		if (searchConditions["hasFunde"] != undefined) {
			urlQueryParametersString += "hasFunde=" + searchConditions["hasFunde"].toString();
		}

		return urlQueryParametersString;
	}
}

WebServiceClientAblage.prototype = new WebServiceClient();
