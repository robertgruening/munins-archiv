<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/OrtFactory.php");

class DeleteOrt extends UserStory
{
    #region variables
    private $_ort = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given Ort, which is to delete.
     */
    private function getOrt()
    {
        return $this->_ort;
    }

    /**
     * Sets the Ort, which is to delete.
     * @param Ort $ort Ort, which is to delete.
     */
    public function setOrt($ort)
    {
        $this->_ort = $ort;
    }
    #endregion
    #endregion

    /**
     * Checks if an Ort is set,
     * the Ort has to be a leaf
     * in the tree structure.
     */
    protected function areParametersValid()
    {
        global $logger;
        $ort = $this->getOrt();
        
        if ($ort == null)
        {
            $logger->warn("Ort ist nicht gesetzt!");
            $this->addMessage("Ort ist nicht gesetzt!");
            return false;
        }
        
        $areParametersValid = true;

        if (count($ort->getChildren()) > 0)
        {
            $logger->warn("Ort hat Unterelemente!");
            $this->addMessage("Ort hat Unterelemente!");
            $areParametersValid = false;
        }
    
        if ($ort->getCountOfKontexte() > 0)
        {
            $logger->warn("Ort enthält Kontexte!");
            $this->addMessage("Ort enthält Kontexte!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $ortFactory = new OrtFactory();
        
        return $ortFactory->delete($this->getOrt());
    }
}