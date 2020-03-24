<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Model/FundAttributType.php");

class ConvertFundAttributType extends UserStory
{
    #region variables
    private $_fundAttributType = null;
    private $_multidimensionalArray = null;
    #endregion

    #region properties
    #region input properties
    /**
     * Returns the given multidimensional array, which is to convert.
     */
    private function getMultidimensionalArray()
    {
        return $this->_multidimensionalArray;
    }

    /**
     * Sets the multidimensional array, which is to be converted.
     * @param Array $multidimensionalArray multidimensional array, which is to convert.
     */
    public function setMultidimensionalArray($multidimensionalArray)
    {
        $this->_multidimensionalArray = $multidimensionalArray;
    }
    #endregion

    #region output properties
    /**
     * Returns the converted Fundattributtyp.
     */
    public function getFundAttributType()
    {
        return $this->_fundAttributType;
    }

    /**
     * Sets the converted Fundattributtyp.
     * @param FundAttributType $fundAttributType Fundattributtyp, which was converted.
     */
    private function setFundAttributType($fundAttributType)
    {
        $this->_fundAttributType = $fundAttributType;
    }
    #endregion
    #endregion

    #region constructors
    function __construct()
    {
    }
    #endregion

    /**
     * Is always true.
     */
    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $multidimensionalArray = $this->getMultidimensionalArray();

        if ($multidimensionalArray == null)
        {
            $this->addMessage("Es wurden keine Daten übergeben!");
            $this->setFundAttributType(null);
            return false;
        }

        $fundAttributType = new FundAttributType();

        #region Id
        if (isset($multidimensionalArray["Id"]) && 
            !empty($multidimensionalArray["Id"]))
        {
            if (!is_numeric($multidimensionalArray["Id"]))
            {
                $this->addMessage("Id muss eine Zahl sein!");
            }
            else if(intval($multidimensionalArray["Id"]) < 0)
            {
                $this->addMessage("Id muss mindestens 0 sein!");
            }
            else
            {
                $fundAttributType->setId(intval($multidimensionalArray["Id"]));
            }
        }
        #endregion

        #region Bezeichnung
        if (isset($multidimensionalArray["Bezeichnung"]))
        {
            $fundAttributType->setBezeichnung($multidimensionalArray["Bezeichnung"]);
        }
        #endregion

        $this->setFundAttributType($fundAttributType);

        return (count($this->getMessages()) == 0);
    }
}