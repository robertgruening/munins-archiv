$(function() {	
	var listeKontext = [
	"Fundstelle: 25",
	"Fundstelle: 25/Begehungsfläche: I",
	"Fundstelle: 25/Begehungsfläche: I/Begehung: 1",
	"Fundstelle: 25/Begehungsfläche: I/Begehung: 2",
	"Fundstelle: 25/Begehungsfläche: I/Begehung: 3",
	"Fundstelle: 25/Begehungsfläche: II",
	"Fundstelle: 25/Begehungsfläche: II/Begehung: 1",
	"Fundstelle: 25/Begehungsfläche: III",
	"Fundstelle: 25/Begehungsfläche: III/Begehung: 1"
	];
	
	var listeAblage = [
	"Raum: Archiv",
	"Raum: Archiv/Regal: 1",
	"Raum: Archiv/Regal: 1/Regalbrett: 1",
	"Raum: Archiv/Regal: 1/Regalbrett: 2",
	"Raum: Archiv/Regal: 1/Regalbrett: 3",
	"Raum: Archiv/Regal: 1/Regalbrett: 3/Karton: 25-I-1-1",
	"Raum: Archiv/Regal: 1/Regalbrett: 3/Karton: 25-III-1-1"
	];
	
	var listeMaterial = [
	"Glas",
	"Knochen",
	"Lehm",
	"Metall",
	"Metall/Bronze",
	"Metall/Buntmetall",
	"Metall/Kupfer",
	"Metall/Eisen",
	"Stein",
	"Stein/Silex",
	"Stein/Silex/Plattensilex",
	"Ton",
	"Ton/Graphitton"
	];
	
	var listeGegenstand = [
	"Gefäß",
	"Waffe",
	"Waffe/Pfeil",
	"Werkzeug",
	"Werkzeug/Bohrer",
	"Werkzeug/Schaber"
	];
	
	var listeErhaltung = [
	"Fragment",
	"Fragment/Boden",
	"Fragment/Henkel",
	"Fragment/Rand",
	"Fragment/Wand",
	"Rohling"
	];
	
	var listeZeitstellung = [
	"Steinzeit",
	"Steinzeit/Altsteinzeit",
	"Steinzeit/Mittelsteinzeit",
	"Steinzeit/Jungsteinzeit",
	"Bronzezeit",
	"Bronzezeit/Bronzezeit",
	"Bronzezeit/Urnfelderzeit",
	"Eisenzeit",
	"Eisenzeit/Hallstattzeit",
	"Eisenzeit/Latènezeit"
	];
	
	
    $(".feld[name=Kontext] input[type=text]").autocomplete({
      source: listeKontext
    });	
    $(".feld[name=Ablage] input[type=text]").autocomplete({
      source: listeAblage
    });
    $(".feld[name=Material] input[type=text]").autocomplete({
      source: listeMaterial
    });
    $(".feld[name=Gegenstand] input[type=text]").autocomplete({
      source: listeGegenstand
    });
    $(".feld[name=Erhaltung] input[type=text]").autocomplete({
      source: listeErhaltung
    });
    $(".feld[name=Zeitstellung] input[type=text]").autocomplete({
      source: listeZeitstellung
    });
    
    if (GetURLParameter("Id") == undefined)
    {
		$("input[type=text]").val("");
		$("#divDetails").empty();
	}
});

function GetURLParameter(name)
{
	var url = window.location.search.substring(1);
	var parameters = url.split("&");
	for (var i = 0; i < parameters.length; i++)
	{
		var parameter = parameters[i].split("=");
		if (parameter[0] == name)
		{
			return parameter[1];
		}
	}
}
