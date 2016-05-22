//class
TreeAblage = function(nodes){
	//public
	this.Nodes = nodes;
	this.Opened = false;

	//private
	this._nodeId = 0;	
}

//public
TreeAblage.prototype.Transformiere = function(){
	
	var transformierteNodes = "[";
	for (var i = 0; i < this.Nodes.length; i++)
	{
		transformierteNodes += this.private_TransformiereElement(this.Nodes[i]);
		if (i < this.Nodes.length - 1)
			transformierteNodes += ",";
	}
	transformierteNodes += "]";
	
	return JSON.parse(transformierteNodes);
}


TreeAblage.prototype.private_TransformiereElement = function(element){

	var transformiertesElement = "{";
	transformiertesElement += "\"id\":\"" + this._nodeId + "\"";
	this._nodeId++;
	
	transformiertesElement += ",";
	transformiertesElement += "\"elementId\":\"" + element.Id + "\"";
	
	if (element.Typ.Bezeichnung == "Raum" ||
	element.Typ.Bezeichnung == "Stellplatz" ||
	element.Typ.Bezeichnung == "Regal" ||
	element.Typ.Bezeichnung == "Regalbrett" ||
	element.Typ.Bezeichnung == "Karton")
	{
		transformiertesElement += ",";
		transformiertesElement += "\"icon\":\"images/system/Icon" + element.Typ.Bezeichnung.replace(" ", "_") + ".png\"";
	}
	
	transformiertesElement += ",";
	transformiertesElement += "\"text\":\"" + element.Typ.Bezeichnung + " : " + element.Bezeichnung + " (" + element.Id + ")\"";

	transformiertesElement += ",";
	transformiertesElement += "\"state\":{";
	if (element.Typ.Bezeichnung == "Karton")
		transformiertesElement += 	"\"opened\":" + true + ",";
	else
		transformiertesElement += 	"\"opened\":" + this.Opened + ",";
	transformiertesElement += 	"\"disabled\":" + false + ",";
	transformiertesElement += 	"\"selected\":" + false;
	transformiertesElement += "}";
	
	if ((element.Children != undefined &&
		element.Children.length > 0) || 
		(element.Kontexte != undefined &&
		element.Kontexte.length > 0))
	{
		transformiertesElement += ",";
		transformiertesElement += "\"children\":";
		transformiertesElement += "[";
		
		if (element.Kontexte != undefined &&
		element.Kontexte.length > 0)
		{	
			for (var i = 0; i < element.Kontexte.length; i++)
			{
				transformiertesElement += this.private_TransformiereKontextElement(element.Kontexte[i]);
				if (i < element.Kontexte.length - 1)
					transformiertesElement += ",";
			}
		}
		
		if (element.Children != undefined &&
		element.Children.length > 0 &&
		element.Kontexte != undefined &&
		element.Kontexte.length > 0)
		{
			transformiertesElement += ",";
		}
		
		if (element.Children != undefined &&
		element.Children.length > 0)
		{
			for (var i = 0; i < element.Children.length; i++)
			{
				transformiertesElement += this.private_TransformiereElement(element.Children[i]);
				if (i < element.Children.length - 1)
					transformiertesElement += ",";
			}
		}
		transformiertesElement += "]";
	}
	transformiertesElement += "}";
	
	return transformiertesElement;
}



TreeAblage.prototype.private_TransformiereKontextElement = function(element){

	var transformiertesElement = "{";
	transformiertesElement += "\"text\":\"" + this.private_GetKennung(element) + "\"";

	if (this.private_Contains(element, "Grabung"))
	{
		transformiertesElement += ",";
		transformiertesElement += "\"icon\":\"images/system/IconGrabung.png\"";
	}
	else if (this.private_Contains(element, "Begehung"))
	{
		transformiertesElement += ",";
		transformiertesElement += "\"icon\":\"images/system/IconBegehung.png\"";
	}
	
	transformiertesElement += ",";
	transformiertesElement += "\"state\":{";
	transformiertesElement += 	"\"opened\":" + true + ",";
	transformiertesElement += 	"\"disabled\":" + true + ",";
	transformiertesElement += 	"\"selected\":" + false;
	transformiertesElement += "}";
	transformiertesElement += "}";
	
	return transformiertesElement;
}

TreeAblage.prototype.private_GetKennung = function(element){
	
	var kennung = "";
	if (element.Typ.Bezeichnung != "Grabung")
		kennung += element.Bezeichnung;
	
	if (element.Children != undefined &&
		element.Children.length > 0)
	{
		if (element.Typ.Bezeichnung != "Grabung")
			kennung += "-";
			
		for (var i = 0; i < element.Children.length; i++)
		{
			kennung += this.private_GetKennung(element.Children[i]);
		}
	}
	
	return kennung;
}

TreeAblage.prototype.private_Contains = function(element, typ){
	
	if (element.Typ.Bezeichnung == typ)
		return true;
		
	if (element.Children != undefined &&
		element.Children.length > 0)
	{
		for (var i = 0; i < element.Children.length; i++)
		{
			if (this.private_Contains(element.Children[i], typ))
				return true;
		}
	}
	
	return false;
}
