<?php
include_once(__DIR__."/INode.php");
include_once(__DIR__."/ITypedNode.php");
include_once(__DIR__."/ITreeNode.php");

class Ort implements iNode, iTypedNode, iTreeNode
{    
    public $Id;
    public $Bezeichnung;
    public $OrderNumber;
    public $Type;
    public $Category;
    public $Parent;
    public $Children;
    public $Path;
    public $CountOfKontexte;
    
    
    public function getId()
    {
        return $this->Id;
    }
    
    public function setId($id)
    {
        $this->Id = $id;
    }
    
    public function getBezeichnung()
    {
        return $this->Bezeichnung;
    }
    
    public function setBezeichnung($bezeichnung)
    {
        $this->Bezeichnung = $bezeichnung;
    }
    
    public function getOrderNumber()
    {
        $this->OrderNumber;
    }
    
    public function setOrderNumber($orderNumber)
    {
        $this->OrderNumber = $orderNumber;
    }
    
    public function getType()
    {
        return $this->Type;
    }
    
    public function setType($type)
    {
        $this->Type = $type;
    }
    
    public function getCategory()
    {
        return $this->Category;
    }
    
    public function setCategory($category)
    {
        $this->Category = $category;
    }
    
    public function getParent()
    {
        return $this->Parent;
    }
    
    public function setParent($parent)
    {
        $this->Parent = $parent;
    }
    
    public function getChildren()
    {
        return $this->Children;
    }
    
    public function setChildren($children)
    {
        $this->Children = $children;
    }
    
    public function addChild($child)
    {
        array_push($this->Children, $child);
    }
    
    public function removeChild($child)
    {
        for ($i = 0; $i < count($this->Children); $i++)
        {
            if ($this->Children[$i]->getId() == $child->getId())
            {
                array_splice($this->Children, $i, 1);
                break;
            }
        }
    }

    public function setPath($path)
    {
        $this->Path = $path;
    }

    public function getPath()
    {
        return $this->Path;
    }
    
    public function getCountOfKontexte()
    {
        return $this->CountOfKontexte;
    }
    
    public function setCountOfKontexte($countOfKontexte)
    {
        $this->CountOfKontexte = $countOfKontexte;
    }
    
    function __construct()
    {
        $this->Id = -1;
        $this->Bezeichnung = null;
        $this->OrderNumber = null;
        $this->Type = null;
        $this->Category = null;
        $this->Parent = null;
        $this->Children = array();
        $this->Path = null;
        $this->CountOfKontexte = 0;
    }
}
