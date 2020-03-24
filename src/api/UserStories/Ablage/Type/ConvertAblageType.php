<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Model/AblageType.php");

class ConvertAblageType extends UserStory
{
    #region variables
    private $_ablageType = null;
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
     * Returns the converted Ablagetyp.
     */
    public function getAblageType()
    {
        return $this->_ablageType;
    }

    /**
     * Sets the converted Ablagetyp.
     * @param AblageType $ablageType Ablagetyp, which was converted.
     */
    private function setAblageType($ablageType)
    {
        $this->_ablageType = $ablageType;
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
            $this->setAblageType(null);
            return false;
        }

        $ablageType = new AblageType();

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
                $ablageType->setId(intval($multidimensionalArray["Id"]));
            }
        }
        #endregion

        #region Bezeichnung
        if (isset($multidimensionalArray["Bezeichnung"]))
        {
            $ablageType->setBezeichnung($multidimensionalArray["Bezeichnung"]);
        }
        #endregion

        $this->setAblageType($ablageType);

        return (count($this->getMessages()) == 0);
    }
}