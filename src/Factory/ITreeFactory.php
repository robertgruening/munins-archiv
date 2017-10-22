<?php

interface iTreeFactory
{
    public function loadParent($element);
    public function loadChildren($element);
    public function getPath($element);
}
