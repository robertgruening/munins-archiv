function WebServiceClientOrt()
{
	this._listeners = {
		create: new Array(),
		save: new Array(),
		load: new Array(),
		loadAll: new Array(),
		delete: new Array()
	};

	this.Register = function(eventName, listener) {
		if (listener == undefined ||
			listener == null ||
			this._listeners[eventName] == undefined)
		{
			return;
		}
		
		this._listeners[eventName].push(listener);
	};

	this.Update = function(eventName, data, sender) {
		if (this._listeners[eventName] == undefined)
		{
			return;
		}
		
		this._listeners[eventName].forEach(function(item) {
			item.Update(data, sender);
		});
	};

	this.Fail = function(eventName, messages, sender) {
		if (this._listeners[eventName] == undefined)
		{
			return;
		}
		
		this._listeners[eventName].forEach(function(item) {
			item.Fail(data, sender);
		});
	};

	this.Create = function(ort, sender) {
		var controller = this;

		$.ajax(
		{
			type:"POST",
			url:"../Services/Ort/",
			dataType: "json",
			data: ort,
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("create", data, sender);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("create", jqXHR.responseJSON, sender);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("create", new Array("Es ist ein Servicerfehler aufgetreten!"), sender);
				}                
			}
		});
	}

	this.Save = function(ort, sender) {
		var controller = this;

		$.ajax(
		{
			type:"PUT",
			url:"../Services/Ort/" + ort.Id,
			dataType: "json",
			data: ort,
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("save", data, sender);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("save", jqXHR.responseJSON, sender);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("save", new Array("Es ist ein Servicerfehler aufgetreten!"), sender);
				}                
			}
		});
	}

	this.Load = function(ort, sender) {
		var controller = this;

		$.ajax(
		{
			type:"GET",
			url:"../Services/Ort/" + ort.Id,
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("load", data, sender);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("load", jqXHR.responseJSON, sender);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("load", new Array("Es ist ein Servicerfehler aufgetreten!"), sender);
				}
			}
		});
	};

	this.LoadAll = function(sender) {
		var controller = this;

		$.ajax(
		{
			type:"GET",
			url:"../Services/Ort/",
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("loadAll", data, sender);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("loadAll", jqXHR.responseJSON, sender);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("loadAll", new Array("Es ist ein Servicerfehler aufgetreten!"), sender);
				}
			}
		});
	};

	this.Delete = function(ort, sender) {
		var controller = this;

		$.ajax(
		{
			type:"DELETE",
			url:"../Services/Ort/" + ort.Id,
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("delete", data, sender);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
                    controller.Fail("delete", jqXHR.responseJSON, sender);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
                    controller.Fail("delete", new Array("Es ist ein Servicerfehler aufgetreten!"), sender);
                }
			}
		});
	}
}