<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Model/OrtType.php");

class ConvertOrtType extends UserStory
{
    #region variables
    private $_ortType = null;
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
     * Returns the converted Orttyp.
     */
    public function getOrtType()
    {
        return $this->_ortType;
    }

    /**
     * Sets the converted Orttyp.
     * @param OrtType $ortType Orttyp, which was converted.
     */
    private function setOrtType($ortType)
    {
        $this->_ortType = $ortType;
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
            $this->setOrtType(null);
            return false;
        }

        $ortType = new OrtType();

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
                $ortType->setId(intval($multidimensionalArray["Id"]));
            }
        }
        #endregion

        #region Bezeichnung
        if (isset($multidimensionalArray["Bezeichnung"]))
        {
            $ortType->setBezeichnung($multidimensionalArray["Bezeichnung"]);
        }
        #endregion

        $this->setOrtType($ortType);

        return (count($this->getMessages()) == 0);
    }
}