var MuninsArchivWebdavClient = function () {
	this.setWebdavProtocol("https");
	this.setWebdavServer("localhost");
	this.setWebdavShare("webdav");
	this.setWebdavUser("aaf");
	this.setWebdavPassword("gwf");
};

MuninsArchivWebdavClient.prototype = new WebdavClient();
