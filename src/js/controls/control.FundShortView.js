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
		WriteAnzahl(options, htmlElement);
		WriteDimension1(options, htmlElement);
		WriteDimension2(options, htmlElement);
		WriteDimension3(options, htmlElement);
		WriteMasse(options, htmlElement);	
		WriteKontext(options, htmlElement);
		WriteAblage(options, htmlElement);
		WriteFundAttribute(options, htmlElement);
	}
	
    function WriteBeschriftung(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Beschriftung:").addClass("fieldName"),
            $("<span/>").html(options.Element.Bezeichnung).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function WriteAnzahl(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Anzahl:").addClass("fieldName"),
            $("<span/>").html(options.Element.Anzahl).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function WriteDimension1(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension1:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension1).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function WriteDimension2(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension2:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension2).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function WriteDimension3(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension3:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension3).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function WriteMasse(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Masse:").addClass("fieldName"),
            $("<span/>").html(options.Element.Masse).addClass("fieldValue"),
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

	function WriteKontext(options, htmlElement)
	{
	    if (options.Element.Kontex)
	    {
	        $(htmlElement).append(
                $("<span/>").html("Kontext:").addClass("fieldName"),
                $("<span/>").html(GetPfadHtml(options.Element.Kontext.FullBezeichnung)).addClass("fieldValue"),
                $("<br/>")
            );
        }
        else
        {
	        $(htmlElement).append(
                $("<span/>").html("Kontext:").addClass("fieldName"),
                $("<span/>").html("-").addClass("fieldValue"),
                $("<br/>")
            );
        }
	}

	function WriteAblage(options, htmlElement)
	{   
	    if (options.Element.Ablage)
	    {
	        $(htmlElement).append(
                $("<span/>").html("Ablage:").addClass("fieldName"),
                $("<span/>").html(GetPfadHtml(options.Element.Ablage.FullBezeichnung)).addClass("fieldValue"),
                $("<br/>")
            );
        }
        else
        {
	        $(htmlElement).append(
                $("<span/>").html("Ablage:").addClass("fieldName"),
                $("<span/>").html("-").addClass("fieldValue"),
                $("<br/>")
            );
        }
	}

	function WriteFundAttribute(options, htmlElement)
	{
	    console.log(options.Element); 
	    
	    $(htmlElement).append(
            $("<span/>").html("Attribute:").addClass("fieldName"),
            $("<span/>").attr("name", "attribute").addClass("fieldValue"),
            $("<br/>")
        );
        		
		if (options.Element.Attribute &&
			options.Element.Attribute.length > 0)
		{
	        var ul = $("<ul/>");
	        
	        for (var i = 0; i < options.Element.Attribute.length; i++)
	        {
	            $(ul).append(
			        $("<li/>").html(GetPfadHtml(options.Element.Attribute[i].FullBezeichnung))
	            );			        
	        }
	        
            $("span[name=attribute").html(ul);
		}
		else
		{
            $("span[name=attribute").html("0 Stk.");
		}
	}
})(jQuery);
