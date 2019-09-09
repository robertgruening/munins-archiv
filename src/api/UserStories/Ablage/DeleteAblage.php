<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/AblageFactory.php");

class DeleteAblage extends UserStory
{
    #region variables
    private $_ablage = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given Ablage, which is to delete.
     */
    private function getAblage()
    {
        return $this->_ablage;
    }

    /**
     * Sets the Ablage, which is to delete.
     * @param Ablage $ablage Ablage, which is to delete.
     */
    public function setAblage($ablage)
    {
        $this->_ablage = $ablage;
    }
    #endregion
    #endregion

    /**
     * Checks if a Ablage is set,
     * the Ablage has to be a leaf
     * in the tree structure and
     * must not have Funde.
     */
    protected function areParametersValid()
    {
        global $logger;
        $ablage = $this->getAblage();
        
        if ($ablage == null)
        {
            $logger->warn("Ablage ist nicht gesetzt!");
            $this->addMessage("Ablage ist nicht gesetzt!");
            return false;
        }
        
        $areParametersValid = true;

        if (count($ablage->getChildren()) > 0)
        {
            $logger->warn("Ablage hat Unterelemente!");
            $this->addMessage("Ablage hat Unterelemente!");
            $areParametersValid = false;
        }
    
        if (count($ablage->getFunde()) > 0)
        {
            $logger->warn("Ablage enthält Funde!");
            $this->addMessage("Ablage enthält Funde!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $ablageFactory = new AblageFactory();
        
        return $ablageFactory->delete($this->getAblage());
    }
}