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
	
	if (element.Type.Bezeichnung == "Raum" ||
	element.Type.Bezeichnung == "Stellplatz" ||
	element.Type.Bezeichnung == "Regal" ||
	element.Type.Bezeichnung == "Regalbrett" ||
	element.Type.Bezeichnung == "Karton")
	{
		transformiertesElement += ",";
		transformiertesElement += "\"icon\":\"images/system/Icon" + element.Type.Bezeichnung.replace(" ", "_") + ".png\"";
	}
	
	transformiertesElement += ",";
	transformiertesElement += "\"text\":\"" + element.Type.Bezeichnung + " : " + element.Bezeichnung + " (" + element.Id + ")\"";

	transformiertesElement += ",";
	transformiertesElement += "\"state\":{";
	if (element.Type.Bezeichnung == "Karton")
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
	if (element.Type.Bezeichnung != "Grabung")
		kennung += element.Bezeichnung;
	
	if (element.Children != undefined &&
		element.Children.length > 0)
	{
		if (element.Type.Bezeichnung != "Grabung")
			kennung += "-";
			
		for (var i = 0; i < element.Children.length; i++)
		{
			kennung += this.private_GetKennung(element.Children[i]);
		}
	}
	
	return kennung;
}

TreeAblage.prototype.private_Contains = function(element, type){
	
	if (element.Type.Bezeichnung == type)
		return true;
		
	if (element.Children != undefined &&
		element.Children.length > 0)
	{
		for (var i = 0; i < element.Children.length; i++)
		{
			if (this.private_Contains(element.Children[i], type))
				return true;
		}
	}
	
	return false;
}
