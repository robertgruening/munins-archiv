<?php
include_once(__DIR__."/INode.php");

class OrtCategory implements iNode
{
    #region variables
    public $Id;
    public $Bezeichnung;
    public $CountOfOrten;
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
    
    public function getCountOfOrten()
    {
        return $this->CountOfOrten;
    }
    
    public function setCountOfOrten($countOfOrten)
    {
        $this->CountOfOrten = $countOfOrten;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->Id = -1;
        $this->Bezeichnung = null;
        $this->CountOfOrten = 0;
    }
    #endegion
}
