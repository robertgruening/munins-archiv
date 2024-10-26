<?php
require_once(__DIR__."/../../../Model/FundAttributType.php");
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/FundAttributTypeFactory.php");

class DeleteFundAttributType extends UserStory
{
    #region variables
    private $_fundAttributType = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given FundAttribut type, which is to delete.
     */
    private function getFundAttributType()
    {
        return $this->_fundAttributType;
    }

    /**
     * Sets the FundAttribut type, which is to delete.
     * @param FundAttributType $fundAttributType FundAttribut type, which is to delete.
     */
    public function setFundAttributType($fundAttributType)
    {
        $this->_fundAttributType = $fundAttributType;
    }
    #endregion
    #endregion

    /**
     * Checks if an FundAttribut type is set
     * and not in use.
     */
    protected function areParametersValid()
    {
        $fundAttributType = $this->getFundAttributType();
        
        if ($fundAttributType == null)
        {
            $this->addMessage("Fundattributtyp ist nicht gesetzt!");
            return false;
        }
        
        if ($fundAttributType->getCountOfFundAttributen() > 0)
        {
            $this->addMessage("Fundattributtyp wird ".$fundAttributType->getCountOfFundAttributen()." Mal verwendet!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $fundAttributTypeFactory = new FundAttributTypeFactory();
        
        return $fundAttributTypeFactory->delete($this->getFundAttributType());
    }
}