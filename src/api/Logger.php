<?php
include_once(__DIR__ . "/pkg/log4php/Logger.php");

Logger::configure(array(
    'rootLogger' => array(
        'appenders' => array('default'),
    ),
    'appenders' => array(
        'default' => array(
            'class' => 'LoggerAppenderRollingFile',
            'layout' => array(
                'class' => 'LoggerLayoutPattern',
                'params' => array(
                    'conversionPattern' => '%date{d.m.Y H:i:s} %-5level %F %msg<br/>%n')
            ),
            'params' => array(
                'file' => __DIR__ . '/Logs/Log.html',
                'maxFileSize' => '1MB',
                'maxBackupIndex' => 1,
                'append' => true
            )
        )
    )
));

$logger = Logger::getLogger("default");
