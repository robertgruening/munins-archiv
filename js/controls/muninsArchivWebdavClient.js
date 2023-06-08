var MuninsArchivWebdavClient = function () {
	this.setWebdavProtocol("https");
	this.setWebdavServer("nextcloud.intranet.aaf:443");
	this.setWebdavShare("remote.php/dav/files/aaf/AAF");
	this.setWebdavUser("aaf");
	this.setWebdavPassword("gwf");
};

MuninsArchivWebdavClient.prototype = new WebdavClient();
