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
				$(htmlElement).empty();

				let muninsArchivWebdavClient = new MuninsArchivWebdavClient();
				muninsArchivWebdavClient.getContentList(
					"Fundstellen/Akten/" + options.path,
					function(contentListJson) {
						var IconField = function(config)
						{
							jsGrid.Field.call(this, config);
						}

						IconField.prototype = new jsGrid.Field({
							itemTemplate: function(value) {
								return $("<i>").addClass(value);
							}
						});
						
						var FileSizeField = function(config)
						{
							jsGrid.Field.call(this, config);
						}

						FileSizeField.prototype = new jsGrid.Field({
							align: "right",
							itemTemplate: function(value) {
								return $("<label>").text((value / 1024)
									.toLocaleString("de-DE", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})
								);
							},
							sorter: function(value1, value2) {
								return value1 - value2;
							}
						});
						
						var DateTimeField = function(config)
						{
							jsGrid.Field.call(this, config);
						}

						DateTimeField.prototype = new jsGrid.Field({
							align: "right",
							itemTemplate: function(value) {
								return $("<label>").text(new Date(value)
									.toLocaleString("de-DE"));
							},
							sorter: function(value1, value2) {
								return new Date(value1) - new Date(value2);
							}
						});
						
						let fileList = $(contentListJson)
							.filter(function() {
								return $(this)[0].type == "file";
							});
						
						$(fileList).each(function(i, element) {
							element.downloadicon = "fas fa-download";
						});
						
						jsGrid.fields.icon = IconField;
						jsGrid.fields.fileSize = FileSizeField;
						jsGrid.fields.dateTime = DateTimeField;

						$(htmlElement).jsGrid({
							width: "100%",

							inserting: false,
							editing: false,
							sorting: true,
							paging: false,
							autoload: false,

							pageSize: 10,
							pageButtonCount: 5,
							pagerFormat: "Seiten: {first} {prev} {pages} {next} {last}",
							pagePrevText: "Zurück",
							pageNextText: "Weiter",
							pageFirstText: "Anfang",
							pageLastText: "Ende",

							fields: [
								{
									title: "",
									name: "downloadicon",
									type: "icon",
									width: 27,
									sorting: false
								},
								{
									title: "Name",
									name: "name",
									type: "text",
									validate: "required",
									sorting: true
								},
								{
									title: "Größe (KB)",
									name: "size",
									type: "fileSize",
									sorting: true
								},
								{
									title: "Erzeugungsdatum",
									name: "creationDate",
									type: "dateTime",
									sorting: true
								},
								{
									title: "Änderungsdatum",
									name: "lastModifiedDate",
									type: "dateTime",
									sorting: true
								}
							],

							rowClick: function(args) {
								console.info("row clicked");
								console.debug("clicked item", args.item);
								window.open(args.item.href, "_blank");
							},

							rowDoubleClick: function(args) {
								console.info("row double clicked");
								console.debug("clicked item", args.item);
								window.open(args.item.href, "_blank");
							}
						});

						$(htmlElement).jsGrid({
							data: fileList
						});

						$(htmlElement).jsGrid("sort", "Name");
					},
					function(jqXHR, textStatus, errorThrown) {
				
					}
				);
			},
			function(jqXHR, textStatus, errorThrown) {
				
			}
		);
	}
	
})(jQuery);
