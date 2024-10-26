<?php
include_once(__DIR__."/Kontext.php");
include_once(__DIR__."/Begehungsflaeche.php");
include_once(__DIR__."/GeoPoint.php");

class Fundstelle extends Kontext
{
	public $GeoPoint;

    public function setParent($parent)
    {
        return;
        //throw new Exception("Fundstelle can not have a parent!");
    }

    public function setChildren($children)
    {
        for ($i = 0; $i < count($children); $i++)
        {
            if (!($children[$i] instanceof Begehungsflaeche))
            {
                return;
                //throw new Exception("Child is not of type \"Begehungsflaeche\"!");
            }
        }

        $this->Children = $children;
    }

    public function addChild($child)
    {
        if (!($child instanceof Begehungsflaeche))
        {
                return;
                //throw new Exception("Child is not of type \"Begehungsflaeche\"!");
        }

        array_push($this->Children, $child);
    }

	public function setGeoPoint($geoPoint)
	{
		$this->GeoPoint = $geoPoint;
	}

	public function getGeoPoint()
	{
		return $this->GeoPoint;
	}
    
    function __construct()
    {
        parent::__construct();
        $this->GeoPoint = null;
   }
}
