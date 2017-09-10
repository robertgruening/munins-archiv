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
		WriteNewLine(options, htmlElement);
		WritePfad(options, htmlElement);
        WriteNewLine(options, htmlElement);
        WriteChildInformation(options, htmlElement);
	}
	
    function WriteNewLine(options, htmlElement)
    {
        $(htmlElement).append(
            $("<br/>")
        );
    }
	
    function WriteName(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html(options.Element.Typ.Bezeichnung + ":").addClass("fieldName"),
            $("<span/>").html(options.Element.Bezeichnung).addClass("fieldValue")
        );
    }
    
    function WritePfad(options, htmlElement)    
    {
        $(htmlElement).append(
            $("<span/>").html("Pfad:").addClass("fieldName")
        );
        
        var segments = options.Element.FullBezeichnung.split("/");
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
        
        $(htmlElement).append(
            $("<span/>").html(pfadSpan).addClass("fieldValue")
        );
    }

	function WriteChildInformation(options, htmlElement)
	{
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Kontext/GetWithChildren/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data &&
    				data.length > 0)
				{                    
                    var ul = $("<ul/>").addClass("fieldValue");
                    
                    for (var i = 0; i< data.length; i++)
                    {
				        $(ul).append(
                            $("<li/>").html(data[i].Bezeichnung)
                        );
                    }
                    
				    $(htmlElement).append(
                        $("<span/>").html("Kinder:").addClass("fieldName"),
                        $(ul),
                        $("<br/>")
                    );
                    
				}
				else
				{				
				    $(htmlElement).append(
                        $("<span/>").html("Kinder:").addClass("fieldName"),
                        $("<span/>").html("-").addClass("fieldValue"),
                        $("<br/>")
                    );
				}
			}
		});	
	}
})(jQuery);
