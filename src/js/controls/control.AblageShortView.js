(function($)
{
	$.fn.AblageShortView = function(options)
	{
		return this.each(function()
		{
			loadAblageShortView(options, this);
		});
	}
	
	function loadAblageShortView(options, htmlElement)
	{
		$(htmlElement).empty();		
		writeName(options, htmlElement);
		writePfad(options, htmlElement);
        writeChildInformation(options, htmlElement);
        writeKontexte(options, htmlElement);
        writeFunde(options, htmlElement);
	}
	
    function writeName(options, htmlElement)
    {
        $(htmlElement).append(
            $("<span/>").html(options.Element.Typ.Bezeichnung + ":").addClass("fieldName"),
            $("<span/>").html(options.Element.Bezeichnung).addClass("fieldValue"),
            $("<br/>")
        );
    }
    
    function writePfad(options, htmlElement)    
    {
        $(htmlElement).append(
            $("<span/>").html("Pfad:").addClass("fieldName"),
            $("<span/>").html(getPfadHtml(options.Element.FullBezeichnung)).addClass("fieldValue"),
            $("<br/>")
        );
    }

	function writeChildInformation(options, htmlElement)
	{
	    $(htmlElement).append(
            $("<span/>").html("Kinder:").addClass("fieldName"),
            $("<span/>").html("0 Stk.").addClass("fieldValue").attr("name", "kinder"),
            $("<div/>").attr("name", "kinder")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Ablage/GetWithChildren/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{
				if (data &&
				    data.length > 0)
				{
				    $("span[name=kinder]").html(data.length + " Stk.");
				    writeList($("div[name=kinder]"), data);
				    appendListToggleIcon($("span[name=kinder]"), $("div[name=kinder] ul"));	
				}
			}
		});	
	}

	function writeKontexte(options, htmlElement)
	{
	    $(htmlElement).append(
            $("<span/>").html("Kontexte:").addClass("fieldName"),
            $("<span/>").html("0 Stk.").addClass("fieldValue").attr("name", "kontexte"),
            $("<div/>").attr("name", "kontexte")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Kontext/Get/Ablage/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{			
				if (data &&
    				data.length > 0)
				{			        
			        $("span[name=kontexte]").html(data.length + " Stk.");
				    writeList($("div[name=kontexte]"), data);
				    appendListToggleIcon($("span[name=kontexte]"), $("div[name=kontexte] ul"));
				}
			}
		});	
	}

	function writeFunde(options, htmlElement)
	{
	    $(htmlElement).append(
            $("<span/>").html("Funde:").addClass("fieldName"),
            $("<span/>").html("0 Stk.").addClass("fieldValue").attr("name", "fundeAnzahl"),
            $("<br/>")
        );
        
		$.ajax(
		{
			type:"GET",
			url: "../Dienste/Fund/Get/Ablage/" + options.Element.Id,
			dataType: "JSON",
			success:function(data, textStatus, jqXHR)
			{	
				if (data)
				{
				    $("span[name=fundeAnzahl]").html(data.length + " Stk.");
				}
			}
		});	
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
