function WebServiceClientOrtType()
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

	this.Create = function(ortType) {
		var controller = this;

		$.ajax(
		{
			type:"POST",
			url:"../Services/Ort/Typ/" + ortType.Id,
			dataType: "json",
			data: ortType,
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("create", data);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("create", jqXHR.responseJSON);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("create", new Array("Es ist ein Servicerfehler aufgetreten!"));
				}                
			}
		});
	}

	this.Save = function(ortType) {
		var controller = this;

		$.ajax(
		{
			type:"PUT",
			url:"../Services/Ort/Typ/",
			dataType: "json",
			data: ortType,
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("save", data);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("save", jqXHR.responseJSON);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("save", new Array("Es ist ein Servicerfehler aufgetreten!"));
				}                
			}
		});
	}

	this.Load = function(ortType) {
		var controller = this;

		$.ajax(
		{
			type:"GET",
			url:"../Services/Ort/Typ/" + ortType.Id,
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("load", data);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("load", jqXHR.responseJSON);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("load", new Array("Es ist ein Servicerfehler aufgetreten!"));
				}
			}
		});
	};

	this.LoadAll = function() {
		var controller = this;

		$.ajax(
		{
			type:"GET",
			url:"../Services/Ort/Typ/",
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("loadAll", data);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				    controller.Fail("loadAll", jqXHR.responseJSON);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				    controller.Fail("loadAll", new Array("Es ist ein Servicerfehler aufgetreten!"));
				}
			}
		});
	};

	this.Delete = function(ortType) {
		var controller = this;

		$.ajax(
		{
			type:"DELETE",
			url:"../Services/Ort/Typ/" + ortType.Id,
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				controller.Update("delete", data);
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
                    controller.Fail("delete", jqXHR.responseJSON);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
                    controller.Fail("delete", new Array("Es ist ein Servicerfehler aufgetreten!"));
                }
			}
		});
	}
}