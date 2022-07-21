var WebdavClient = function () {

	//#region variables
	this.webdavProtocol = null;
	this.webdavServer = null;
	this.webdavShare = null;
	this.webdavUser = null;
	this.webdavPassword = null;
	//#endregion

	//#region properties
	this.getWebdavProtocol = function() {
		return this.webdavProtocol;
	};

	this.setWebdavProtocol = function(webdavProtocol) {
		this.webdavProtocol = webdavProtocol;
	};

	this.getWebdavServer = function() {
		return this.webdavServer;
	};

	this.setWebdavServer = function(webdavServer) {
		this.webdavServer = webdavServer;
	};

	this.getWebdavShare = function() {
		return this.webdavShare;
	};

	this.setWebdavShare = function(webdavShare) {
		this.webdavShare = webdavShare;
	};

	this.getWebdavUser = function() {
		return this.webdavUser;
	};

	this.setWebdavUser = function(webdavUser) {
		this.webdavUser = webdavUser;
	};

	this.getWebdavPassword = function() {
		return this.webdavPassword;
	};

	this.setWebdavPassword = function(webdavPassword) {
		this.webdavPassword = webdavPassword;
	};

	this.getWebdavUrl = function(resourcePath) {
		return this.getWebdavProtocol() + "://" +
			this.getWebdavServer() + "/" + 
			this.getWebdavShare() + (resourcePath == undefined ? "" : ("/" + resourcePath));
	};
	
	this.getWebdavServerUrlWithAuthentication = function() {
		return this.getWebdavProtocol() + "://" + 
			this.getWebdavUser() + ":" +
			this.getWebdavPassword() + "@" +
			this.getWebdavServer();
	};
	//#endregion

	this.getContentListRequestXml = function() {
		return "<?xml version='1.0'?>\
			<a:propfind xmlns:a='DAV:'>\
				<a:allprop/>\
			</a:propfind>";
	};
			
	this.convertContentListXmlToJson = function(contentListXml) {
		let items = [];
		let responses = $(contentListXml)
			.find("D\\:response");
		let webdavServerUrlWithAuthentication = this.getWebdavServerUrlWithAuthentication();
		
		responses.each(function(i, element) {
			let item = {
				href : webdavServerUrlWithAuthentication +
					$(element)
						.find("D\\:href")
						.text(),
				creationDate : $(element)
						.find("lp1\\:creationdate")
						.text(),
				lastModifiedDate : $(element)
						.find("lp1\\:getlastmodified")
						.text()
			};
				
			if ($(element)
					.find("D\\:collection")
					.length == 1) {
				item.type = "directory";
			}
			else {
				item.type = "file";
				item.size = $(element)
					.find("lp1\\:getcontentlength")
					.text()
			}
			
			items.push(item);
		});
		
		return items;
	};
	
	this.formatContentList = function(contentList) {
		let currentDirectory = this.getCurrentDirectory(contentList);
		
		$(contentList).each(function(i, element) {
			element.name = element.href.replace(currentDirectory.href, "");
			
			if (element.name == "") {
				element.name = ".";
			}
		});
		
		return contentList;
	};
	
	this.getCurrentDirectory = function(contentList) {
		if (contentList == null ||
			contentList.length == 0) {
			
			return null;
		}
		
		let currentDirectory = contentList[0];
		
		$(contentList).each(function(i, element) {
			if (element.href.length < currentDirectory.href.length) {
				currentDirectory = element;
			}
		});
		
		return currentDirectory;
	};

	this.getContentList = function(folderPath = "", callbackSuccess, callbackError) {
		$.ajax(
		{
			type: "PROPFIND",
			url: this.getWebdavUrl(folderPath),
			dataType : "xml",
			contentType: "text/xml",
			data : this.getContentListRequestXml(),
			context: this,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa(this.getWebdavUser() + ":" + this.getWebdavPassword()));
				xhr.setRequestHeader("Depth", 1);
			},
			success: function (data, textStatus, jqXHR) {
				callbackSuccess(
					this.formatContentList(
						this.convertContentListXmlToJson(data)
					)
				);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				callbackError(jqXHR, textStatus, errorThrown);
			}
		});
	};

	this.createFolder = function(folderPath, callbackSuccess, callbackError) {
		$.ajax(
		{
			type: "MKCOL",
			url: this.getWebdavUrl(folderPath),
			context: this,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa(this.getWebdavUser() + ":" + this.getWebdavPassword()));
			},
			success: function (data, textStatus, jqXHR) {
				callbackSuccess(data, textStatus, jqXHR);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				callbackError(jqXHR, textStatus, errorThrown);
			}
		});
	};

	this.getFile = function(filePath, callbackSuccess, callbackError) {
		$.ajax(
		{
			type: "GET",
			url: this.getWebdavUrl(filePath),
			context: this,
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Authorization", "Basic " + btoa(this.getWebdavUser() + ":" + this.getWebdavPassword()));
			},
			success: function (data, textStatus, jqXHR) {
				callbackSuccess(data, textStatus, jqXHR);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				callbackError(jqXHR, textStatus, errorThrown);
			}
		});
	};
}
