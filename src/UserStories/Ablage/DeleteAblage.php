<?php
require_once("../../UserStories/UserStory.php");
require_once("../../Factory/AblageFactory.php");

class DeleteAblage extends UserStory
{
    #region variables
    private $_ablage = null;
    #endregion

    #endregion properties
    #region input properties
    private function getAblage()
    {
        return $this->_ablage;
    }

    public function setAblage($ablage)
    {
        $this->_ablage = $ablage;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        $ablage = $this->getAblage();
        
        if ($ablage == null)
        {
            $this->addMessage("Ablage ist nicht gesetzt!");
            return false;
        }
        
        $areParametersValid = true;

        if (count($ablage->getChildren()) > 0)
        {
            $this->addMessage("Ablage hat Unterelemente!");
            $areParametersValid = false;
        }
    
        if (count($ablage->getFunde()) > 0)
        {
            $this->addMessage("Ablage enthält Funde!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $ablageFactory = new AblageFactory();
        $ablage = $this->getAblage();
        $ablage = $ablageFactory->unlinkKontexte($ablage);    
    
        return $ablageFactory->delete($ablage);
    }
}