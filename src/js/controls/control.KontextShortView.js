(function($)
{
	$.fn.KontextShortView = function(options)
	{
		return this.each(function()
		{
			LoadKontextShortView(options, this);
		});
	}
	
	function LoadKontextShortView(options, htmlElement)
	{
		$(htmlElement).empty();		
		WriteName(options, htmlElement);
		WritePfad(options, htmlElement);
        WriteChildInformation(options, htmlElement);
        WriteAblagen(options, htmlElement);
        WriteFunde(options, htmlElement);
        WriteOrte(options, htmlElement);
	}
	
    function WriteName(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html(options.Element.Typ.Bezeichnung + ":").addClass("fieldName"),
            $("<span/>").html(options.Element.Bezeichnung).addClass("fieldValue"),
            $("<br/>")
        );
    }
    
    function GetPfadHtml(pfad)
    {
        var segments = pfad.split("/");
        var pfadSpan = $("<span/>");
        
        for (var i = 0; i < segments.length; i++)
        {
            $(pfadSpan).append(
                $("<span/>").html(segments[i]).addClass("segment")
            );
                
            if (i < (segments.length - 1))
            {
                $(pfadSpan).append(
                    $("<span/>").html("/").addClass("segmentSeparator")
                );
            }
        }
        
        return pfadSpan;
    }
    
    function WritePfad(options, htmlElement)    
    {
        $(htmlElement).append(
            $("<span/>").html("Pfad:").addClass("fieldName"),
            $("<span/>").html(GetPfadHtml(options.Element.FullBezeichnung)).addClass("fieldValue"),
            $("<br/>")
        );
    }

	function WriteChildInformation(options, htmlElement)
	{
	    $(htmlElement).append(
            $("<span/>").html("Kinder:").addClass("fieldName"),
            $("<span/>").attr("name", "kinderAnzahl").addClass("fieldValue"),
            $("<br/>")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Kontext/GetWithChildren/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data)
				{
				    $("span[name=kinderAnzahl]").html(data.length + " Stk.");
				}
				else
				{
				    $("span[name=kinderAnzahl]").html("0 Stk.");
				}
			}
		});	
	}

	function WriteAblagen(options, htmlElement)
	{
    	if (options.Element.Typ.Bezeichnung != "Begehung" &&
    	    options.Element.Typ.Bezeichnung != "Befund" &&
    	    options.Element.Typ.Bezeichnung != "Laufende Nummer")
	    {
    	    return;
	    }
    	    
	    $(htmlElement).append(
            $("<span/>").html("Ablagen:").addClass("fieldName"),
            $("<span/>").attr("name", "ablagen").addClass("fieldValue"),
            $("<br/>")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Ablage/Get/Kontext/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{			
				if (data &&
    				data.length > 0)
				{
			        var ul = $("<ul/>");
			        
			        for (var i = 0; i < data.length; i++)
			        {
			            $(ul).append(
        			        $("<li/>").html(GetPfadHtml(data[i].FullBezeichnung))
			            );			        
			        }
			        
                    $("span[name=ablagen").html(ul);
				}
				else
				{
                    $("span[name=ablagen").html("0 Stk.");
				}
			}
		});	
	}

	function WriteOrte(options, htmlElement)
	{
    	if (options.Element.Typ.Bezeichnung != "Begehungsfläche" &&
    	    options.Element.Typ.Bezeichnung != "Fläche")
	    {
    	    return;
	    }	    
    	  
	    $(htmlElement).append(
            $("<span/>").html("Orte:").addClass("fieldName"),
            $("<span/>").attr("name", "orte").addClass("fieldValue"),
            $("<br/>")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Ort/Get/Kontext/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{			
				if (data &&
    				data.length > 0)
				{
			        var ul = $("<ul/>");
			        
			        for (var i = 0; i < data.length; i++)
			        {
			            $(ul).append(
        			        $("<li/>").html(GetPfadHtml(data[i].FullBezeichnung))
			            );			        
			        }
			        
                    $("span[name=orte").html(ul);
				}
				else
				{
                    $("span[name=orte").html("0 Stk.");
				}
			}
		});	
	}

	function WriteFunde(options, htmlElement)
	{
    	if (options.Element.Typ.Bezeichnung != "Begehung" &&
    	    options.Element.Typ.Bezeichnung != "Befund" &&
    	    options.Element.Typ.Bezeichnung != "Laufende Nummer")
	    {
    	    return;
	    }	 
	    
	    $(htmlElement).append(
            $("<span/>").html("Funde:").addClass("fieldName"),
            $("<span/>").attr("name", "fundeAnzahl").addClass("fieldValue"),
            $("<br/>")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Fund/Get/Kontext/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{	
				if (data)
				{
				    $("span[name=fundeAnzahl]").html(data.length + " Stk.");
				}
				else
				{
				    $("span[name=fundeAnzahl]").html("0 Stk.");
				}
			}
		});	
	}
})(jQuery);
