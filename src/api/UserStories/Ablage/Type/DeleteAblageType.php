<?php
require_once(__DIR__."/../../../Model/AblageType.php");
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/AblageTypeFactory.php");

class DeleteAblageType extends UserStory
{
    #region variables
    private $_ablageType = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given Ablage type, which is to delete.
     */
    private function getAblageType()
    {
        return $this->_ablageType;
    }

    /**
     * Sets the Ablage type, which is to delete.
     * @param AblageType $ablageType Ablage type, which is to delete.
     */
    public function setAblageType($ablageType)
    {
        $this->_ablageType = $ablageType;
    }
    #endregion
    #endregion

    /**
     * Checks if an Ablage type is set
     * and not in use.
     */
    protected function areParametersValid()
    {
        global $logger;
        $ablageType = $this->getAblageType();
        
        if ($ablageType == null)
        {
            $logger->warn("Ablagetyp ist nicht gesetzt!");
            $this->addMessage("Ablagetyp ist nicht gesetzt!");
            return false;
        }
        
        if ($ablageType->getCountOfAblagen() > 0)
        {
            $logger->warn("Ablagetyp wird ".$ablageType->getCountOfAblagen()." Mal verwendet!");
            $this->addMessage("Ablagetyp wird ".$ablageType->getCountOfAblagen()." Mal verwendet!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $ablageTypeFactory = new AblageTypeFactory();
        
        return $ablageTypeFactory->delete($this->getAblageType());
    }
}