function Begehung()
{
    this.Bezeichnung = "";
    this.Type = new Object();
    this.Parent = null;
    this.Path = "";
	this.Children = new Array();
	this.LfdNummern = new Array();
	this.Funde = new Array();
    this.Datum = null;
    this.Kommentar = "";
    this.LastCheckedDate = null;
}