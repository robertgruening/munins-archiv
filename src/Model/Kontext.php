<?php

class Kontext implements iNode, iTypeNode, iTreeNode
{    
    private $_id;
    private $_bezeichnung;
    private $_orderNumber;
    private $_type;
    private $_parent;
    private $_children;
    private $_ablagen;
    private $_orte;
    
    
    public function getId()
    {
        return $this->_id;
    }
    
    public function setId($id)
    {
        $this->_id = $id;
    }
    
    public function getBezeichnung()
    {
        return $this->_bezeichnung;
    }
    
    public function setBezeichnung($bezeichnung)
    {
        $this->_bezeichnung = $bezeichnung;
    }
    
    public function getOrderNumber()
    {
        $this->_orderNumber;
    }
    
    public function setOrderNumber($orderNumber)
    {
        $this->_orderNumber = $orderNumber;
    }
    
    public function getType()
    {
        return $this->_type;
    }
    
    public function setType($type)
    {
        $this->_type = $type;
    }
    
    public function getParent()
    {
        return $this->_parent;
    }
    
    public function setParent($parent)
    {
        $this->_parent = $parent;
    }
    
    public function getChildren()
    {
        return $this->_children;
    }
    
    public function setChildren($children)
    {
        $this->_children = new array();
        array_push($this->_children, $children);
    }
    
    public function addChild($child)
    {
        array_push($this->_children, $child);
    }
    
    public function removeChild($child)
    {
        for ($i = 0; $i < count($this->_children), $i++)
        {
            if ($this->_children[$i]->getId() == $child->getId())
            {
                array_splice($this->_children, $i, 1);
                break;
            }
        }
    }
    
    public function getAblagen()
    {
        return $this->_ablagen;
    }
    
    public function setAblagen($ablagen)
    {
        $this->_ablagen = new array();
        array_push($this->_ablagen, $ablagen);
    }
    
    public function addAblage($ablage)
    {
        array_push($this->_ablagen, $ablage);
    }
    
    public function removeAblage($ablage)
    {
        for ($i = 0; $i < count($this->_ablagen), $i++)
        {
            if ($this->_ablagen[$i]->getId() == $ablage->getId())
            {
                array_splice($this->_ablagen, $i, 1);
                break;
            }
        }
    }
    
    public function getOrte()
    {
        return $this->_orte;
    }
    
    public function setOrte($orte)
    {
        $this->_orte = new array();
        array_push($this->_orte, $orte);
    }
    
    public function addOrt($ort)
    {
        array_push($this->_orte, $ort);
    }
    
    public function removeOrt($ort)
    {
        for ($i = 0; $i < count($this->_orte), $i++)
        {
            if ($this->_orte[$i]->getId() == $ort->getId())
            {
                array_splice($this->_orte, $i, 1);
                break;
            }
        }
    }
    
    public __construct()
    {
        $this->_id = -1;
        $this->_bezeichnung = null;
        $this->_orderNumber = null;
        $this->_type = null;
        $this->_parent = null;
        $this->_children = new array();
        $this->_ablagen = new array();
        $this->_orte = new array();
    }
}
