<?php

interface iTreeFactory
{
    public function loadRoots();
    public function loadParent($element);
    public function loadChildren($element);
    public function getPath($element);
}
