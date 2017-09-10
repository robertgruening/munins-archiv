(function($)
{
	$.fn.FundShortView = function(options)
	{
		return this.each(function()
		{
			LoadFundShortView(options, this);
		});
	}
	
	function LoadFundShortView(options, htmlElement)
	{
		$(htmlElement).empty();		
		WriteBeschriftung(options, htmlElement);
		WriteNewLine(options, htmlElement);
		WriteAnzahl(options, htmlElement);
		WriteNewLine(options, htmlElement);
		WriteDimension1(options, htmlElement);
		WriteNewLine(options, htmlElement);
		WriteDimension2(options, htmlElement);
		WriteNewLine(options, htmlElement);
		WriteDimension3(options, htmlElement);
		WriteNewLine(options, htmlElement);
		WriteMasse(options, htmlElement);		
		WriteNewLine(options, htmlElement);
		WriteKontext(options, htmlElement);
		WriteNewLine(options, htmlElement);
		WriteAblage(options, htmlElement);
		WriteNewLine(options, htmlElement);
		WriteFundAttribute(options, htmlElement);
	}
	
    function WriteNewLine(options, htmlElement)
    {
        $(htmlElement).append(
            $("<br/>")
        );
    }
	
    function WriteBeschriftung(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Beschriftung:").addClass("fieldName"),
            $("<span/>").html(options.Element.Bezeichnung).addClass("fieldValue")
        );
    }
	
    function WriteAnzahl(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Anzahl:").addClass("fieldName"),
            $("<span/>").html(options.Element.Anzahl).addClass("fieldValue")
        );
    }
	
    function WriteDimension1(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension1:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension1).addClass("fieldValue")
        );
    }
	
    function WriteDimension2(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension2:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension2).addClass("fieldValue")
        );
    }
	
    function WriteDimension3(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension3:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension3).addClass("fieldValue")
        );
    }
	
    function WriteMasse(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Masse:").addClass("fieldName"),
            $("<span/>").html(options.Element.Masse).addClass("fieldValue")
        );
    }

	function WriteKontext(options, htmlElement)
	{                    
        var segments = options.Element.Kontext.FullBezeichnung.split("/");
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
            $("<span/>").html("Kontexte:").addClass("fieldName"),
            $(pfadSpan).addClass("fieldValue")
        );
	}

	function WriteAblage(options, htmlElement)
	{                    
        var segments = options.Element.Ablage.FullBezeichnung.split("/");
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
            $("<span/>").html("Ablage:").addClass("fieldName"),
            $(pfadSpan).addClass("fieldValue")
        );
	}

	function WriteFundAttribute(options, htmlElement)
	{      
    	if (options.Element.Attribute.length == 0) 
    	{
            $(htmlElement).append(
                $("<span/>").html("Attribute:").addClass("fieldName"),
                $("<span/>").html("-").addClass("fieldValue")
            );
    	}
    	else
    	{
    	    var ul = $("<ul/>");
    	    
	        for (var i = 0; i < options.Element.Attribute.length; i++)
	        {
	            var segments = options.Element.Attribute[i].FullBezeichnung.split("/");
                var pfadSpan = $("<span/>");
                
                for (var j = 0; j < segments.length; j++)
                {                        
                    if (j == 0)
                    {
                        $(pfadSpan).append(
                            $("<span/>").html(options.Element.Attribute[i].Typ.Bezeichnung).addClass("segment"),
                            $("<span/>").html("/").addClass("segmentSeparator")
                        );
                    }
                    
                    $(pfadSpan).append(
                        $("<span/>").html(segments[j]).addClass("segment")
                    );
                        
                    if (j < (segments.length - 1))
                    {
                        $(pfadSpan).append(
                            $("<span/>").html("/").addClass("segmentSeparator")
                        );
                    }
                }
                
                $(ul).append(
                    $("<li/>").html(pfadSpan)
                ); 
	        } 
                
            $(htmlElement).append(
                $("<span/>").html("Attribute:").addClass("fieldName"),
                $(ul).addClass("fieldValue")
            );
	    }
	}
})(jQuery);
