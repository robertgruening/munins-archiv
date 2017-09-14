(function($)
{
	$.fn.FundShortView = function(options)
	{
		return this.each(function()
		{
			loadFundShortView(options, this);
		});
	}
	
	function loadFundShortView(options, htmlElement)
	{
		$(htmlElement).empty();		
		writeBeschriftung(options, htmlElement);
		writeAnzahl(options, htmlElement);
		writeDimension1(options, htmlElement);
		writeDimension2(options, htmlElement);
		writeDimension3(options, htmlElement);
		writeMasse(options, htmlElement);	
		writeKontext(options, htmlElement);
		writeAblage(options, htmlElement);
		writeFundAttribute(options, htmlElement);
	}
	
    function writeBeschriftung(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Beschriftung:").addClass("fieldName"),
            $("<span/>").html(options.Element.Bezeichnung).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function writeAnzahl(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Anzahl:").addClass("fieldName"),
            $("<span/>").html(options.Element.Anzahl).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function writeDimension1(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension1:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension1).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function writeDimension2(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension2:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension2).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function writeDimension3(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Dimension3:").addClass("fieldName"),
            $("<span/>").html(options.Element.Dimension3).addClass("fieldValue"),
            $("<br/>")
        );
    }
	
    function writeMasse(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html("Masse:").addClass("fieldName"),
            $("<span/>").html(options.Element.Masse).addClass("fieldValue"),
            $("<br/>")
        );
    }

	function writeKontext(options, htmlElement)
	{
	    if (options.Element.Kontex)
	    {
	        $(htmlElement).append(
                $("<span/>").html("Kontext:").addClass("fieldName"),
                $("<span/>").html(getPfadHtml(options.Element.Kontext.FullBezeichnung)).addClass("fieldValue"),
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

	function writeAblage(options, htmlElement)
	{   
	    if (options.Element.Ablage)
	    {
	        $(htmlElement).append(
                $("<span/>").html("Ablage:").addClass("fieldName"),
                $("<span/>").html(getPfadHtml(options.Element.Ablage.FullBezeichnung)).addClass("fieldValue"),
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

	function writeFundAttribute(options, htmlElement)
	{
	    $(htmlElement).append(
            $("<span/>").html("Attribute:").addClass("fieldName"),
            $("<span/>").html("0 Stk.").addClass("fieldValue").attr("name", "attribute"),
            $("<div/>").attr("name", "attribute")
        );	
        
		if (options.Element.Attribute &&
		    options.Element.Attribute.length > 0)
		{
		    $("span[name=attribute]").html(options.Element.Attribute.length + " Stk.");
		    writeList($("div[name=attribute]"), options.Element.Attribute);
		    appendListToggleIcon($("span[name=attribute]"), $("div[name=attribute] ul"));	
		}
	}
	
	/* support functions */
    
    function getPfadHtml(pfad)
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
	
	function writeList(listContainer, listData)
	{	
	    var ul = $("<ul/>").addClass("list");
	    	        
        for (var i = 0; i < listData.length; i++)
        {
            $(ul).append(
		        $("<li/>").html(getPfadHtml(listData[i].FullBezeichnung))
            );			        
        }
        
	    $(listContainer).append(ul);
	}
	
	function appendListToggleIcon(onControl, listControl)
	{
        $(onControl).after(
	        $("<span/>").addClass("ui-icon").addClass("ui-icon-circle-triangle-s").click(function() {
                $(listControl).toggle("blind");
                
                if ($(this).hasClass("ui-icon-circle-triangle-s"))
                {
                    $(this).removeClass("ui-icon-circle-triangle-s");
                    $(this).addClass("ui-icon-circle-triangle-n");
                }
                else
                {
                    $(this).removeClass("ui-icon-circle-triangle-n");
                    $(this).addClass("ui-icon-circle-triangle-s");
                }
            })
        );
	}
})(jQuery);
