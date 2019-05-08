<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Model/KontextType.php");

class ConvertKontextType extends UserStory
{
    #region variables
    private $_kontextType = null;
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
     * Returns the converted Kontexttyp.
     */
    public function getKontextType()
    {
        return $this->_kontextType;
    }

    /**
     * Sets the converted Kontexttyp.
     * @param KontextType $kontextType Kontexttyp, which was converted.
     */
    private function setKontextType($kontextType)
    {
        $this->_kontextType = $kontextType;
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
            $this->setKontextType(null);
            return false;
        }

        $kontextType = new KontextType();

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
                $kontextType->setId(intval($multidimensionalArray["Id"]));
            }
        }
        #endregion

        #region Bezeichnung
        if (isset($multidimensionalArray["Bezeichnung"]))
        {
            if (strlen($multidimensionalArray["Bezeichnung"]) > 30)
            {
                $this->addMessage("Bezeichnung darf nicht länger als 30 Zeichen sein!");
            }
            else
            {
                $kontextType->setBezeichnung($multidimensionalArray["Bezeichnung"]);
            }
        }
        #endregion

        $this->setKontextType($kontextType);

        return (count($this->getMessages()) == 0);
    }
}