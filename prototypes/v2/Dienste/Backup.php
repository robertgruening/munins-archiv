<?php
include_once(__DIR__."/config.php");
echo exec("rm ../backups/*");
echo exec("mysqldump --opt -u ".MYSQL_BENUTZER." -p".MYSQL_KENNWORT." ".MYSQL_DATENBANK." | gzip -9 > ../backups/Munins_Archiv.sql.gz");

$file = "../backups/Munins_Archiv.sql.gz";
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="'.basename($file).'"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($file));
readfile($file);
echo exec("rm ../backups/*");
