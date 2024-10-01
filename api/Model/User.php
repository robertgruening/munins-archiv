<?php
include_once(__DIR__."/INode.php");
include_once(__DIR__."/IListNode.php");

class User implements iNode, iListNode
{    
	public $Id;
	public $UserName;
    public $Guid;
	public $OrderNumber;
	public $Bookmark;
    
    
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
        return $this->getUserName();
    }

    public function setBezeichnung($bezeichnung)
    {
    }

    public function getUserName()
    {
	    return $this->UserName;
    }

    public function setUserName($userName)
    {
	    $this->UserName = $userName;
    }
    
    public function getOrderNumber()
    {
        $this->OrderNumber;
    }
    
    public function setOrderNumber($orderNumber)
    {
        $this->OrderNumber = $orderNumber;
    }

    public function getGuid()
    {
	    return $this->euid;
    }

    public function setGuid($guid)
    {
	    $this->Guid = $guid;
    }

    public function getBookmark()
    {
	    return $this->Bookmark;
    }

    public function setBookmark($bookmark)
    {
	    $this->Bookmark = $bookmark;
    }
    
    function __construct()
    {
        $this->Id = -1;
        $this->UserName = null;
        $this->Guid = null;
        $this->OrderNumber = null;
        $this->Bookmark = null;
    }
}
