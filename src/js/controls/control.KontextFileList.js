(function($)
{
	$.fn.KontextFileList = function(options)
	{
		return this.each(function()
		{
			loadKontextFileList(options, this);
		});
	}

	function loadKontextFileList(options, htmlElement)
	{
		$(htmlElement).empty();

		let muninsArchivWebdavClient = new MuninsArchivWebdavClient();
		muninsArchivWebdavClient.getContentList(
			"Fundstellen/Akten/" + options.path,
			function(contentListJson) {
				console.log(contentListJson);
				
				if ($(contentListJson).length == 0) {
					$(htmlElement).append(
						$("<span>").text("Keine Dateien gefunden!")
					);
					
					return;
				}
				
				$(contentListJson).each(function(i, element) {
					if (element.type == "file") {
						
						let img = $("<img>");
						img.attr("src", element.href);
						img.attr("alt", element.name);
						img.attr("title", element.name);
						
						let span = $("<span>");
						span.text(element.name);
						
						let div = $("<div>");
						div.attr("class", "kontext-file-list-item");
						div.append(img);
						div.append(span);
						
						let a = $("<a>");
						a.attr("href", element.href);
						a.attr("target", "_blank");
						a.append(div)
				
						$(htmlElement).append(a);
					}
				});
				
				/*
				$(htmlElement).append(
					$("<ul>")
				);
				
				$(contentListJson).each(function(i, element) {
					if (element.type == "file") {
						
						let a = $("<a></a>");
						a.attr("title", element.name);
						a.attr("class", "");
						a.attr("href", element.href);
						a.attr("target", "_blank");
						a.text(element.name);
				
						$("ul", htmlElement).append(
							$("<li></li>").append(a)
						);
					}
				});
				*/
			},
			function(jqXHR, textStatus, errorThrown) {
				
			}
		);
	}
	
	/*
	function () {
	}
	*/
	
})(jQuery);
