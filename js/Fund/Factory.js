function getFundLabelText(fund)
{
	var labelText = "";
	labelText += getFundAnzahlLabelText(fund)+"x ";
	
	if (fund.FundAttribute != undefined &&
		fund.FundAttribute != null &&
		fund.FundAttribute.length > 0)
	{
		var material = null;
		var gegenstand = null;
		var erhaltung = null;
		
		for (var j = 0; j < fund.FundAttribute.length; j++)
		{
			if (fund.FundAttribute[j].Type.Bezeichnung == "Material")
			{
				material = fund.FundAttribute[j];
			}
			else if (fund.FundAttribute[j].Type.Bezeichnung == "Gegenstand")
			{
				gegenstand = fund.FundAttribute[j];
			}
			else if (fund.FundAttribute[j].Type.Bezeichnung == "Erhaltung")
			{
				erhaltung = fund.FundAttribute[j];
			}
				
			if (material != null &&
				gegenstand != null &&
				erhaltung != null)
			{
				break;
			}
		}

		if (material != null)
		{
			labelText += material.Bezeichnung + " ";
		}
			
		if (gegenstand != null)
		{
			labelText += gegenstand.Bezeichnung + " ";
		}
			
		if (erhaltung != null)
		{
			labelText += erhaltung.Bezeichnung + " ";
		}
	}
	
	if (fund.Bezeichnung != null &&
		fund.Bezeichnung != "")
	{
		labelText += ": \"" + fund.Bezeichnung + "\"";
	}

	labelText = labelText.trim();

	return labelText;
}

function getFundAnzahlLabelText(fund)
{	
	return fund.Anzahl.toString().replace("-", ">");
}

function setFundAnzahlInputText(fund, anzahlInputText)
{	
	fund.Anzahl = convertAnzahlInputText(anzahlInputText);

	return fund;
}

function convertAnzahlInputText(anzahlInputText)
{	
	return anzahlInputText.toString().replace(">", "-");
}