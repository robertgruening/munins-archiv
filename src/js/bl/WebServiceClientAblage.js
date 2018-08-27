function WebServiceClientAblage()
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

	this.Update = function(eventName, data, sender) {

		if (eventName == "create")
		{
			this._listeners.create.forEach(function(item) {
				item.Update(data, sender);
			});
		}
		else if (eventName == "save")
		{
			this._listeners.save.forEach(function(item) {
				item.Update(data, sender);
			});
		}
		else if (eventName == "load")
		{
			this._listeners.load.forEach(function(item) {
				item.Update(data, sender);
			});
		}
		else if (eventName == "loadAll")
		{
			this._listeners.loadAll.forEach(function(item) {
				item.Update(data, sender);
			});
		}
		else if (eventName == "delete")
		{
			this._listeners.delete.forEach(function(item) {
				item.Update(data, sender);
			});
		}
	};

	this.Fail = function(eventName, messages, sender) {
		if (eventName == "create")
		{
			this._listeners.create.forEach(function(item) {
				item.Fail(messages, sender);
			});
		}
		else if (eventName == "save")
		{
			this._listeners.save.forEach(function(item) {
				item.Fail(messages, sender);
			});
		}
		else if (eventName == "load")
		{
			this._listeners.load.forEach(function(item) {
				item.Fail(messages, sender);
			});
		}
		else if (eventName == "loadAll")
		{
			this._listeners.loadAll.forEach(function(item) {
				item.Fail(messages, sender);
			});
		}
		else if (eventName == "delete")
		{
			this._listeners.delete.forEach(function(item) {
				item.Fail(messages, sender);
			});
		}
	};

	this.Create = function(ablage, sender) {
		var controller = this;

		$.ajax(
		{
			type:"POST",
			url:"../Services/Ablage/",
			dataType: "json",
			data: ablage,
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

	this.Save = function(ablage, sender) {
		var controller = this;

		$.ajax(
		{
			type:"PUT",
			url:"../Services/Ablage/" + ablage.Id,
			dataType: "json",
			data: ablage,
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

	this.Load = function(ablage, sender) {
		var controller = this;

		$.ajax(
		{
			type:"GET",
			url:"../Services/Ablage/" + ablage.Id,
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
			url:"../Services/Ablage/",
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

	this.Delete = function(ablage, sender) {
		var controller = this;

		$.ajax(
		{
			type:"DELETE",
			url:"../Services/Ablage/" + ablage.Id,
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