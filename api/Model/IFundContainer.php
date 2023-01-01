<?php

interface iFundContainer
{
    public function getFunde();
    public function setFunde($funde);
    public function addFund($fund);
    public function removeFund($fund);
    public function containsFund($fund);
}
