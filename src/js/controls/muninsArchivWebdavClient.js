var MuninsArchivWebdavClient = function () {
	this.setWebdavProtocol("https");
	this.setWebdavServer("10.0.0.1");
	this.setWebdavShare("webdav");
	this.setWebdavUser("aaf");
	this.setWebdavPassword("gwf");
};

MuninsArchivWebdavClient.prototype = new WebdavClient();
