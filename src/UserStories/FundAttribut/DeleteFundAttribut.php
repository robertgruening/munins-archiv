<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundAttributFactory.php");

class DeleteFundAttribut extends UserStory
{
    #region variables
    private $_fundAttribut = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given FundAttribut, which is to delete.
     */
    private function getFundAttribut()
    {
        return $this->_fundAttribut;
    }

    /**
     * Sets the FundAttribut, which is to delete.
     * @param FundAttribut $fundAttribut FundAttribut, which is to delete.
     */
    public function setFundAttribut($fundAttribut)
    {
        $this->_fundAttribut = $fundAttribut;
    }
    #endregion
    #endregion

    /**
     * Checks if a FundAttribut is set,
     * the FundAttribut has to be a leaf
     * in the tree structure and
     * must not have Funde.
     */
    protected function areParametersValid()
    {
        global $logger;
        $fundAttribut = $this->getFundAttribut();
        
        if ($fundAttribut == null)
        {
            $logger->warn("Fundattribut ist nicht gesetzt!");
            $this->addMessage("Fundattribut ist nicht gesetzt!");
            return false;
        }
        
        $areParametersValid = true;

        if (count($fundAttribut->getChildren()) > 0)
        {
            $logger->warn("Fundattribut hat Unterelemente!");
            $this->addMessage("Fundattribut hat Unterelemente!");
            $areParametersValid = false;
        }
    
        if ($fundAttribut->getCountOfFunde() > 0)
        {
            $logger->warn("Fundattribut enthält Funde!");
            $this->addMessage("Fundattribut enthält Funde!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $fundAttributFactory = new FundAttributFactory();
        
        return $fundAttributFactory->delete($this->getFundAttribut());
    }
}