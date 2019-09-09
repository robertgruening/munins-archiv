<?php
include_once(__DIR__."/INode.php");
include_once(__DIR__."/IListNode.php");

class LfdNummer implements iNode, iListNode
{    
    public $Id;
    public $Bezeichnung;
    public $OrderNumber;
    public $Kontexte;
    
    
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
    
    public function getKontexte()
    {
        return $this->Kontexte;
    }
    
    public function setKontexte($kontexte)
    {
        $this->Kontexte = $kontexte;
    }
    
    public function addKontext($kontext)
    {
        array_push($this->Kontexte, $kontext);
    }
    
    public function removeKontext($kontext)
    {
        for ($i = 0; $i < count($this->Kontexte); $i++)
        {
            if ($this->Kontexte[$i]->getId() == $kontext->getId())
            {
                array_splice($this->Kontexte, $i, 1);
                break;
            }
        }
    }
    
    function __construct()
    {
        $this->Id = -1;
        $this->Bezeichnung = null;
        $this->OrderNumber = null;
    }
}
