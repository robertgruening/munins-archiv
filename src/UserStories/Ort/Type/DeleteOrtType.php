<?php
require_once(__DIR__."/../../../Model/OrtTyp.php");
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtTypFactory.php");

class DeleteOrtType extends UserStory
{
    #region variables
    private $_ortType = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given Ort type, which is to delete.
     */
    private function getOrtType()
    {
        return $this->_ortType;
    }

    /**
     * Sets the Ort type, which is to delete.
     * @param OrtTyp $ortType Ort type, which is to delete.
     */
    public function setOrtType($ortType)
    {
        $this->_ortType = $ortType;
    }
    #endregion
    #endregion

    /**
     * Checks if an Ort type is set
     * and not in use.
     */
    protected function areParametersValid()
    {
        $ortType = $this->getOrtType();
        
        if ($ortType == null)
        {
            $this->addMessage("Ortstyp ist nicht gesetzt!");
            return false;
        }
        
        if ($ortType->getCountOfOrten() > 0)
        {
            $this->addMessage("Ortstyp wird ".$ortType->getCountOfOrten()." Mal verwendet!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $ortTypFactory = new OrtTypFactory();
        
        return $ortTypFactory->delete($this->getOrtType());
    }
}