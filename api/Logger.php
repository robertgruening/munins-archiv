<?php

class DummyLogg {
    public function debug($message) { }
    public function info($message) { }
    public function warn($message) { }
    public function error($message) { }
}

$logger = new DummyLogg();
