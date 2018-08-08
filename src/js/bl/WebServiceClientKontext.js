function WebServiceClientKontext()
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
			listener == null)
		{
			return;
		}

		if (eventName == "create")
		{
			this._listeners.create.push(listener);
		}
		else if (eventName == "save")
		{
			this._listeners.save.push(listener);
		}
		else if (eventName == "load")
		{
			this._listeners.load.push(listener);
		}
		else if (eventName == "loadAll")
		{
			this._listeners.loadAll.push(listener);
		}
		else if (eventName == "delete")
		{
			this._listeners.delete.push(listener);
		}
	};

	this.Update = function(eventName, data) {
		if (eventName == "create")
		{
			this._listeners.create.forEach(function(item) {
				item.Update(data);
			});
		}
		else if (eventName == "save")
		{
			this._listeners.save.forEach(function(item) {
				item.Update(data);
			});
		}
		else if (eventName == "load")
		{
			this._listeners.load.forEach(function(item) {
				item.Update(data);
			});
		}
		else if (eventName == "loadAll")
		{
			this._listeners.loadAll.forEach(function(item) {
				item.Update(data);
			});
		}
		else if (eventName == "delete")
		{
			this._listeners.delete.forEach(function(item) {
				item.Update(data);
			});
		}
	};

	this.Fail = function(eventName, messages) {
		if (eventName == "create")
		{
			this._listeners.create.forEach(function(item) {
				item.Fail(messages);
			});
		}
		else if (eventName == "save")
		{
			this._listeners.save.forEach(function(item) {
				item.Fail(messages);
			});
		}
		else if (eventName == "load")
		{
			this._listeners.load.forEach(function(item) {
				item.Fail(messages);
			});
		}
		else if (eventName == "loadAll")
		{
			this._listeners.loadAll.forEach(function(item) {
				item.Fail(messages);
			});
		}
		else if (eventName == "delete")
		{
			this._listeners.delete.forEach(function(item) {
				item.Fail(messages);
			});
		}
	};

	this.Create = function(kontext) {
		var controller = this;

		$.ajax(
		{
			type:"POST",
			url:"../Services/Kontext/",
			dataType: "json",
			data: kontext,
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

	this.Save = function(kontext) {
		var controller = this;

		$.ajax(
		{
			type:"PUT",
			url:"../Services/Kontext/" + kontext.Id,
			dataType: "json",
			data: kontext,
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

	this.Load = function(kontext) {
		var controller = this;

		$.ajax(
		{
			type:"GET",
			url:"../Services/Kontext/" + kontext.Id,
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
			url:"../Services/Kontext/",
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

	this.Delete = function(kontext) {
		var controller = this;

		$.ajax(
		{
			type:"DELETE",
			url:"../Services/Kontext/" + kontext.Id,
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