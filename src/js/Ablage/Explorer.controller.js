function ControllerAblageType()
{
	this._listeners = {
		loadAll: new Array()
	};

	this.Register = function(eventName, listener) {
		if (listener != undefined &&
			listener != null)
		{
			if (eventName == "loadAll")
			{
				this._listeners.loadAll.push(listener);
			}
		}
	};

	this.Update = function(eventName, ablageTypes) {
		if (eventName == "loadAll")
		{
			this._listeners.loadAll.forEach(function(item) {
				item.Update(ablageTypes);
			});
		}
	};

	this.LoadAll = function() {
		var controller = this;

		$.ajax(
		{
			type:"GET",
			url:"../Services/Ablage/Typ/",
			dataType: "json",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
					SetAblageTypes(data);
					controller.Update("loadAll", data);
				}
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

var _controllerAblageType = new ControllerAblageType();
var _controllerAblage = new ControllerAblage();
var _ablageTypes = new Array();

function GetAblageTypes()
{
	return _ablageTypes;
}

function SetAblageTypes(ablageTypes)
{
	_ablageTypes = ablageTypes;
}

/*
function LoadAblageTypes()
{
	$.ajax(
	{
		type:"GET",
        url:"../Services/Ablage/Typ/",
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			if (data)
			{
				SetAblageTypes(data);
				//InitGrid();
				_controllerAblageTypes.Update("loadAll", data);
			}
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
}
*/

/*
function DeleteAblage(ablage)
{
	$.ajax(
	{
		type:"DELETE",
        url:"../Services/Ablage/" + ablage.Id,
        dataType: "json",
		success:function(data, textStatus, jqXHR)
		{
			LoadAblagen();
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
}
*/