<?php
include_once(__DIR__."/INode.php");
include_once(__DIR__."/IListNode.php");

class LfdNummer implements iNode, iListNode
{    
    public $Id;
    public $Bezeichnung;
    public $OrderNumber;
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
        $this->CountOfKontexte = 0;
    }
}
