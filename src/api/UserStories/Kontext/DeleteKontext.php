<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/KontextFactory.php");

class DeleteKontext extends UserStory
{
    #region variables
    private $_kontext = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given Kontext, which is to delete.
     */
    private function getKontext()
    {
        return $this->_kontext;
    }

    /**
     * Sets the Kontext, which is to delete.
     * @param Kontext $kontext Kontext, which is to delete.
     */
    public function setKontext($kontext)
    {
        $this->_kontext = $kontext;
    }
    #endregion
    #endregion

    /**
     * Checks if a Kontext is set,
     * the Kontext has to be a leaf
     * in the tree structure and
     * must not have Funde or Orte.
     */
    protected function areParametersValid()
    {
        global $logger;
        $kontext = $this->getKontext();
        
        if ($kontext == null)
        {
            $logger->warn("Kontext ist nicht gesetzt!");
            $this->addMessage("Kontext ist nicht gesetzt!");
            return false;
        }
        
        $areParametersValid = true;

        if (count($kontext->getChildren()) > 0)
        {
            $logger->warn("Kontext hat Unterelemente!");
            $this->addMessage("Kontext hat Unterelemente!");
            $areParametersValid = false;
        }
        
        if (count($kontext->getLfdNummern()) > 0)
        {
            $logger->warn("Kontext hat LfD-Nummern!");
            $this->addMessage("Kontext hat LfD-Nummern!");
            $areParametersValid = false;
        }
    
        if ($kontext instanceof iFundContainer &&
            count($kontext->getFunde()) > 0)
        {
            $logger->warn("Kontext enthält Funde!");
            $this->addMessage("Kontext enthält Funde!");
            $areParametersValid = false;
        }
            
        if ($kontext instanceof iOrtContainer &&
            count($kontext->getOrte()) > 0)
        {
            $logger->warn("Kontext enthält Orte!");
            $this->addMessage("Kontext enthält Orte!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $kontextFactory = new KontextFactory();
        
        return $kontextFactory->delete($this->getKontext());
    }
}