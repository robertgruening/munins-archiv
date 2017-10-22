<?php

class Ort implements iNode, iTypeNode, iTreeNode
{    
    private $_id;
    private $_bezeichnung;
    private $_orderNumber;
    private $_type;
    private $_parent;
    private $_children;
    private $_kontexte;
    
    
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
    
    public function getKontexte()
    {
        return $this->_kontexte;
    }
    
    public function setKontexte($kontexte)
    {
        $this->_kontexte = new array();
        array_push($this->_kontexte, $kontexte);
    }
    
    public function addKontext($kontext)
    {
        array_push($this->_kontexte, $kontext);
    }
    
    public function removeKontext($kontext)
    {
        for ($i = 0; $i < count($this->_kontexte), $i++)
        {
            if ($this->_kontexte[$i]->getId() == $kontext->getId())
            {
                array_splice($this->_kontexte, $i, 1);
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
        $this->_kontexte = new array();
    }
}
