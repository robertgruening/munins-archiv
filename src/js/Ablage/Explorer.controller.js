function ControllerAblage()
{
	this._listeners = {
		delete: new Array()
	};

	this.Register = function(eventName, listener) {
		if (listener != undefined &&
			listener != null)
		{
			if (eventName == "delete")
			{
				this._listeners.delete.push(listener);
			}
		}
	};

	this.Update = function(eventName, ablageTypes) {
		if (eventName == "delete")
		{
			this._listeners.delete.forEach(function(item) {
				item.Update();
			});
		}
	};

	this.Delete = function(ablage) {
		var controller = this;

		$.ajax(
		{
			type:"DELETE",
			url:"../Services/Ablage/" + ablage.Id,
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				//LoadAblagen();
				controller.Update("delete");
			},
			error:function(jqXHR, textStatus, errorThrown)
			{
				if (jqXHR.status == 500)
				{
					ShowMessages(jqXHR.responseJSON);
				}
				else
				{
					console.log("ERROR: " + jqXHR.responseJSON);
				}
			}
		});
	};
}

var _webServiceClientAblageType = new WebServiceClientAblageType();
var _controllerAblage = new ControllerAblage();