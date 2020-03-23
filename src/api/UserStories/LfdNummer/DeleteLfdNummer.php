<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/LfdNummerFactory.php");

class DeleteLfdNummer extends UserStory
{
    #region variables
    private $_lfdNummer = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given LfdNummer, which is to delete.
     */
    private function getLfdNummer()
    {
        return $this->_lfdNummer;
    }

    /**
     * Sets the LfdNummer, which is to delete.
     * @param LfdNummer $lfdNummer LfdNummer, which is to delete.
     */
    public function setLfdNummer($lfdNummer)
    {
        $this->_lfdNummer = $lfdNummer;
    }
    #endregion
    #endregion

    /**
     * Checks if a LfdNummer is set.
     */
    protected function areParametersValid()
    {
        global $logger;
        $lfdNummer = $this->getLfdNummer();
        
        if ($lfdNummer == null)
        {
            $logger->warn("LfdNummer ist nicht gesetzt!");
            $this->addMessage("LfdNummer ist nicht gesetzt!");
            return false;
        }
        
        if ($lfdNummer->getCountOfKontexte() >= 1)
        {
            $logger->warn("LfdNummer hat ".$lfdNummer->getCountOfKontexte()." Kontexte!");
            $this->addMessage("LfdNummer hat ".$lfdNummer->getCountOfKontexte()." Kontexte!");
            return false;				
        }

        return true;
    }

    protected function execute()
    {
        $lfdNummerFactory = new LfdNummerFactory();
        
        return $lfdNummerFactory->delete($this->getLfdNummer());
    }
}