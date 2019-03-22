<?php
require_once(__DIR__."/../../../Model/OrtType.php");
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtTypeFactory.php");

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
     * @param OrtType $ortType Ort type, which is to delete.
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
        $ortTypeFactory = new OrtTypeFactory();
        
        return $ortTypeFactory->delete($this->getOrtType());
    }
}