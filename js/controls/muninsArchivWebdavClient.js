var MuninsArchivWebdavClient = function () {
	this.setWebdavProtocol("https");
	this.setWebdavServer("192.168.0.220:9111");
	this.setWebdavShare("remote.php/dav/files/aaf/AAF");
	this.setWebdavUser("aaf");
	this.setWebdavPassword("gwf");
};

MuninsArchivWebdavClient.prototype = new WebdavClient();
