<?php
include_once(__DIR__."/INode.php");

class KontextTyp implements iNode
{
    private $_id;
    private $_bezeichnung;
    private $_orderNumber;
    
    
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
}
