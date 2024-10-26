<?php
include_once(__DIR__."/INode.php");

class KontextType implements iNode
{
    #region variables
    public $Id;
    public $Bezeichnung;
    public $OrderNumber;
    public $CountOfKontexte;
    #endregion
    
    #region properties
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
    
    public function getCountOfKontexte()
    {
        return $this->CountOfKontexte;
    }
    
    public function setCountOfKOntexte($countOfKontexte)
    {
        $this->CountOfKontexte = $countOfKontexte;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->Id = -1;
        $this->Bezeichnung = null;
        $this->OrderNumber = null;
        $this->CountOfKontexte = 0;
    }
    #endegion
}
