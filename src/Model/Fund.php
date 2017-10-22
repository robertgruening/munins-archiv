<?php

class Fund implements iNode
{    
    private $_id;
    private $_bezeichnung;
    private $_orderNumber;
    private $_anzahl;
    private $_dimension1;
    private $_dimension2;
    private $_dimension3;
    private $_masse;
    private $_ablage;
    private $_kontext;
    
    
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
    
    public function getAnzahl()
    {
        return $this->_anzahl;
    }
    
    public function setAnzahl($anzahl)
    {
        $this->_anzahl = $anzahl;
    }
    
    public function getDimension1()
    {
        return $this->_dimension1;
    }
    
    public function setDimension1($dimension1)
    {
        $this->_dimension1 = $dimension1;
    }
    
    public function getDimension2()
    {
        return $this->_dimension2;
    }
    
    public function setDimension2($dimension2)
    {
        $this->_dimension2 = $dimension2;
    }
    
    public function getDimension3()
    {
        return $this->_dimension3;
    }
    
    public function setDimension3($dimension3)
    {
        $this->_dimension3 = $dimension3;
    }
    
    public function getMasse()
    {
        return $this->_masse;
    }
    
    public function setMasse($masse)
    {
        $this->_masse = $masse;
    }
    
    public function getAblage()
    {
        return $this->_ablage;
    }
    
    public function setAblage($ablage)
    {
        $this->_ablage = $ablage;
    }
    
    public function getKontext()
    {
        return $this->_kontext;
    }
    
    public function setOrte($kontext)
    {
        $this->_kontext = $kontext;
    }
    
    function __construct()
    {
        $this->_id = -1;
        $this->_bezeichnung = null;
        $this->_orderNumber = null;
        $this->_anzahl = null;
        $this->_dimension1 = null;
        $this->_dimension2 = null;
        $this->_dimension3 = null;
        $this->_masse = null;
        $this->_ablage = null;
        $this->_kontext = null;
    }
}
