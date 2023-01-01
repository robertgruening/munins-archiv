(function($)
{
	$.fn.KontextImageList = function(options)
	{
		return this.each(function()
		{
			loadKontextImageList(options, this);
		});
	}

	function loadKontextImageList(options, htmlElement)
	{
		$(htmlElement).empty();

		let muninsArchivWebdavClient = new MuninsArchivWebdavClient();
		muninsArchivWebdavClient.getContentList(
			"Fundstellen/Akten/" + options.path,
			function(contentListJson) {
				if ($(contentListJson).length == 0) {
					$(htmlElement).append(
						$("<span>").text("Keine Dateien gefunden!")
					);
					
					return;
				}
				
				contentListJson.sort(function(a, b) {
					if (a.name < b.name) {
						return -1;
					}
					
					if (a.name > b.name) {
						return 1;
					}
					
					return 0;
				});
				
				$(contentListJson).each(function(i, element) {
					if (element.type == "file" &&
						(
						element.name.toLowerCase().endsWith(".jpeg") ||
						element.name.toLowerCase().endsWith(".jpg") ||
						element.name.toLowerCase().endsWith(".png") ||
						element.name.toLowerCase().endsWith(".gif")
						)
					) {
						
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
			},
			function(jqXHR, textStatus, errorThrown) {
				
			}
		);
	}
	
})(jQuery);
