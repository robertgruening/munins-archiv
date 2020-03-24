<?php
include_once(__DIR__."/../Model/ITreeNode.php");

interface iTreeFactory
{
    public function loadRoots();

    public function loadParent(iTreeNode $node);
    public function linkParent(iTreeNode $node, iTreeNode $parent);
    public function unlinkParent(iTreeNode $node);
    public function updateParent(iTreeNode $node, iTreeNode $parent = null);

    public function loadChildren(iTreeNode $node);
    public function linkChild(iTreeNode $node, iTreeNode $child);
    public function unlinkChild(iTreeNode $node, iTreeNode $child);
    public function linkChildren(iTreeNode $node, array $children);
    public function unlinkChildren(iTreeNode $node, array $children);
    public function unlinkAllChildren(iTreeNode $node);    
    public function synchroniseChildren(iTreeNode $node, array $children);

    public function getPath(iTreeNode $node);

	//public static function isNodeInCircleCondition(iTreeNode $node);
}
