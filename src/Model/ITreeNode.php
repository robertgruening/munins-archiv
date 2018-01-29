<?php
include_once(__DIR__."/INode.php");

interface iTreeNode extends iNode
{    
    public function getParent();
    public function setParent($parent);
    
    public function getChildren();
    public function setChildren($children);
    public function addChild($child);
    public function removeChild($child);

    public function setPath($path);
    public function getPath();
}
