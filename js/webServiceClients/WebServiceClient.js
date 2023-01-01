var WebServiceClient = function () {
	this._modelName = null;
	this._listeners = {
		create: new Array(),
		save: new Array(),
		load: new Array(),
		loadAll: new Array(),
		search: new Array(),
		delete: new Array()
	};

	this.init = function () {
	};

	this.getModelName = function () {
		return this._modelName;
	};

	this.Register = function (eventName, listener) {
		if (listener == undefined ||
			listener == null ||
			this._listeners[eventName] == undefined) {
			return;
		}

		this._listeners[eventName].push(listener);
	};

	this.Update = function (eventName, data, sender) {
		if (this._listeners[eventName] == undefined) {
			return;
		}

		this._listeners[eventName].forEach(function (item) {
			item.Update(data, sender);
		});
	};

	this.Fail = function (eventName, messages, sender) {
		if (this._listeners[eventName] == undefined) {
			return;
		}

		this._listeners[eventName].forEach(function (item) {
			item.Fail(messages, sender);
		});
	};

	this.Create = function (element, sender) {
		var controller = this;

		$.ajax(
			{
				type: "POST",
				url: "../../api/Services/" + this.getModelName() + "/",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(element),
				success: function (data, textStatus, jqXHR) {
					controller.Update("create", data, sender);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 500) {
						controller.Fail("create", jqXHR.responseJSON, sender);
					}
					else {
						controller.Fail("create", new Array("Es ist ein Servicefehler aufgetreten!"), sender);
					}
				}
			});
	};

	this.Save = function (element, sender) {
		var controller = this;

		$.ajax(
			{
				type: "PUT",
				url: "../../api/Services/" + this.getModelName() + "/" + element.Id,
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(element),
				success: function (data, textStatus, jqXHR) {
					controller.Update("save", data, sender);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 500) {
						controller.Fail("save", jqXHR.responseJSON, sender);
					}
					else {
						controller.Fail("save", new Array("Es ist ein Servicefehler aufgetreten!"), sender);
					}
				}
			});
	};

	this.Load = function (element, sender) {
		var controller = this;

		$.ajax(
			{
				type: "GET",
				url: "../../api/Services/" + this.getModelName() + "/" + element.Id,
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

	this.LoadAll = function (sender) {
		var controller = this;

		$.ajax(
			{
				type: "GET",
				url: "../../api/Services/" + this.getModelName() + "/",
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					controller.Update("loadAll", data, sender);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 500) {
						controller.Fail("loadAll", jqXHR.responseJSON, sender);
					}
					else {
						controller.Fail("loadAll", new Array("Es ist ein Servicefehler aufgetreten!"), sender);
					}
				}
			});
	};

	this.Delete = function (element, sender) {
		var controller = this;

		$.ajax(
			{
				type: "DELETE",
				url: "../../api/Services/" + this.getModelName() + "/" + element.Id,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					controller.Update("delete", data, sender);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if (jqXHR.status == 500) {
						controller.Fail("delete", jqXHR.responseJSON, sender);
					}
					else {
						controller.Fail("delete", new Array("Es ist ein Servicefehler aufgetreten!"), sender);
					}
				}
			});
	};
}