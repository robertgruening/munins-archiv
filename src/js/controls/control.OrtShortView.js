(function($)
{
	$.fn.OrtShortView = function(options)
	{
		return this.each(function()
		{
			LoadOrtShortView(options, this);
		});
	}
	
	function LoadOrtShortView(options, htmlElement)
	{
		$(htmlElement).empty();		
		WriteName(options, htmlElement);
		WritePfad(options, htmlElement);
        WriteChildInformation(options, htmlElement);
        WriteKontexte(options, htmlElement);
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
			url: "../Dienste/Ort/GetWithChildren/" + options.Element.Id,
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

	function WriteKontexte(options, htmlElement)
	{
	    $(htmlElement).append(
            $("<span/>").html("Kontexte:").addClass("fieldName"),
            $("<span/>").attr("name", "kontexte").addClass("fieldValue"),
            $("<br/>")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Kontext/Get/Ort/" + options.Element.Id,
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
			        
                    $("span[name=kontexte").html(ul);
				}
				else
				{
                    $("span[name=kontexte").html("0 Stk.");
				}
			}
		});	
	}
})(jQuery);
