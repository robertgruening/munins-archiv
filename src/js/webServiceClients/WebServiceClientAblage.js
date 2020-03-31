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
}

WebServiceClientAblage.prototype = new WebServiceClient();
