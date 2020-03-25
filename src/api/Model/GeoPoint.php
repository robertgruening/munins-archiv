<?php

class Point
{
    public $X;
	public $Y;

	public function getX()
	{
		return $this->X;
	}

	public function setX($x)
	{
		$this->X = $x;
	}

	public function getY()
	{
		return $this->Y;
	}

	public function setY($y)
	{
		$this->Y = $y;
	}

    function __construct()
    {
        $this->X = 0;
        $this->Y = 0;
    }
}
