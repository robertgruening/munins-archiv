<?php
include_once(__DIR__."/INode.php");

class AblageTyp implements iNode
{
    #region variables
    public $Id;
    public $Bezeichnung;
    public $OrderNumber;
    public $CountOfAblagen;
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
        return $this->OrderNumber;
    }
    
    public function setOrderNumber($orderNumber)
    {
        $this->OrderNumber = $orderNumber;
    }
    
    public function getCountOfAblagen()
    {
        return $this->CountOfAblagen;
    }
    
    public function setCountOfAblagen($countOfAblagen)
    {
        $this->CountOfAblagen = $countOfAblagen;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->Id = -1;
        $this->Bezeichnung = null;
        $this->OrderNumber = null;
        $this->CountOfAblagen = 0;
    }
    #endegion
}
