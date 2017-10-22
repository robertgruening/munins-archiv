<?php

class FundAttribut implements iNode, iTypeNode, iTreeNode
{    
    private $_id;
    private $_bezeichnung;
    private $_orderNumber;
    private $_type;
    private $_parent;
    private $_children;
    private $_funde;
    
    
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
    
    public function getFunde()
    {
        return $this->_funde;
    }
    
    public function setFunde($funde)
    {
        $this->_funde = new array();
        array_push($this->_funde, $funde);
    }
    
    public function addFund($fund)
    {
        array_push($this->_funde, $fund);
    }
    
    public function removeFund($fund)
    {
        for ($i = 0; $i < count($this->_funde), $i++)
        {
            if ($this->_funde[$i]->getId() == $fund->getId())
            {
                array_splice($this->_funde, $i, 1);
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
        $this->_funde = new array();
    }
}
