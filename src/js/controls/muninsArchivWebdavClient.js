var MuninsArchivWebdavClient = function () {
	this.setWebdavServer("https://10.0.0.1/");
	this.webdavShare("webdav");
	this.setWebdavUser("aaf");
	this.setWebdavPassword("gwf");
};

MuninsArchivWebdavClient.prototype = new WebdavClient();