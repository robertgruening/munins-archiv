<?php

class GeoPoint
{
    public $Latitude;
	public $Longitude;

	public function getLatitude()
	{
		return $this->Latitude;
	}

	public function setLatitude($latitude)
	{
		$this->Latitude = $latitude;
	}

	public function getLongitude()
	{
		return $this->Longitude;
	}

	public function setLongitude($longitude)
	{
		$this->Longitude = $longitude;
	}

    function __construct()
    {
        $this->Latitude = 0;
        $this->Longitude = 0;
    }
}
