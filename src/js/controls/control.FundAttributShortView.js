(function($)
{
	$.fn.FundAttributShortView = function(options)
	{
		return this.each(function()
		{
			LoadFundAttributShortView(options, this);
		});
	}
	
	function LoadFundAttributShortView(options, htmlElement)
	{
		$(htmlElement).empty();		
		WriteName(options, htmlElement);
		WritePfad(options, htmlElement);
        WriteChildInformation(options, htmlElement);
        WriteFunde(options, htmlElement);
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
			url: "../Dienste/FundAttribut/GetWithChildren/" + options.Element.Id,
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

	function WriteFunde(options, htmlElement)
	{
	    $(htmlElement).append(
            $("<span/>").html("Funde:").addClass("fieldName"),
            $("<span/>").attr("name", "fundeAnzahl").addClass("fieldValue"),
            $("<br/>")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Fund/Get/FundAttribut/" + options.Element.Id,
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
