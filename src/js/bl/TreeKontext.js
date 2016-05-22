//class
TreeKontext = function(nodes){
	//public
	this.Nodes = nodes;
	this.Opened = false;

	//private
	this._nodeId = 0;	
}

//public
TreeKontext.prototype.Transformiere = function(){
	
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


TreeKontext.prototype.private_TransformiereElement = function(element){

	var transformiertesElement = "{";
	transformiertesElement += "\"id\":\"" + this._nodeId + "\"";
	this._nodeId++;
	
	transformiertesElement += ",";
	transformiertesElement += "\"elementId\":\"" + element.Id + "\"";
	
	if (element.Typ == "Fundstelle" ||
	element.Typ == "Begehungsfläche" ||
	element.Typ == "Begehung" ||
	element.Typ == "Grabung" ||
	element.Typ == "Fläche" ||
	element.Typ == "Befund")
	{
		transformiertesElement += ",";
		transformiertesElement += "\"icon\":\"images/system/Icon" + element.Typ.replace(" ", "_") + ".png\"";
	}
	
	transformiertesElement += ",";
	transformiertesElement += "\"text\":\"" + element.Typ + " : " + element.Bezeichnung + " (" + element.Id + ")\"";

	transformiertesElement += ",";
	transformiertesElement += "\"state\":{";
	if (element.Typ == "Begehung" ||
		element.Typ == "Laufende Nummer" ||
		element.Typ == "Befund")
		transformiertesElement += 	"\"opened\":" + true + ",";
	else
		transformiertesElement += 	"\"opened\":" + this.Opened + ",";
	transformiertesElement += 	"\"disabled\":" + false + ",";
	transformiertesElement += 	"\"selected\":" + false;
	transformiertesElement += "}";
	
	if ((element.Children != undefined &&
		element.Children.length > 0) || 
		(element.Ablagen != undefined &&
		element.Ablagen.length > 0))
	{
		transformiertesElement += ",";
		transformiertesElement += "\"children\":";
		transformiertesElement += "[";
		
		if (element.Ablagen != undefined &&
		element.Ablagen.length > 0)
		{	
			for (var i = 0; i < element.Ablagen.length; i++)
			{
				transformiertesElement += this.private_TransformiereAblageElement(element.Ablagen[i]);
				if (i < element.Ablagen.length - 1)
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



TreeKontext.prototype.private_TransformiereAblageElement = function(element){

	var transformiertesElement = "{";
	transformiertesElement += "\"text\":\"" + this.private_GetKennung(element) + " (" + this.private_GetLastChildId(element) + ")" + "\"";

	transformiertesElement += ",";
	transformiertesElement += "\"icon\":\"images/system/IconKarton.png\"";
	
	transformiertesElement += ",";
	transformiertesElement += "\"state\":{";
	transformiertesElement += 	"\"opened\":" + true + ",";
	transformiertesElement += 	"\"disabled\":" + true + ",";
	transformiertesElement += 	"\"selected\":" + false;
	transformiertesElement += "}";
	transformiertesElement += "}";
	
	return transformiertesElement;
}

TreeKontext.prototype.private_GetKennung = function(element){
	
	var kennung = "";
	kennung += element.Bezeichnung;
	
	if (element.Children != undefined &&
		element.Children.length > 0)
	{
		kennung += "-";
			
		for (var i = 0; i < element.Children.length; i++)
		{
			kennung += this.private_GetKennung(element.Children[i]);
		}
	}
	
	return kennung;
}

TreeKontext.prototype.private_GetLastChildId = function(element){
	
	var id = element.Id;
	
	if (element.Children != undefined &&
		element.Children.length > 0)
	{			
		id = this.private_GetLastChildId(element.Children[0]);
	}
	
	return id;
}

TreeKontext.prototype.private_Contains = function(element, typ){
	
	if (element.Typ == typ)
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
