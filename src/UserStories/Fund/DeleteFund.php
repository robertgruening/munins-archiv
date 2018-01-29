<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundFactory.php");

class DeleteFund extends UserStory
{
    #region variables
    private $_fund = null;
    #endregion

    #endregion properties
    #region input properties
    /**
     * Returns the given Fund, which is to delete.
     */
    private function getFund()
    {
        return $this->_fund;
    }

    /**
     * Sets the Fund, which is to delete.
     * @param Fund $fund Fund, which is to delete.
     */
    public function setFund($fund)
    {
        $this->_fund = $fund;
    }
    #endregion
    #endregion

    /**
     * Checks if a Fund is set.
     */
    protected function areParametersValid()
    {
        $fund = $this->getFund();
        
        if ($fund == null)
        {
            $this->addMessage("Fund ist nicht gesetzt!");
            return false;
        }

        return $true;
    }

    protected function execute()
    {
        $fundFactory = new FundFactory();
        $fund = $fundFactory->unlinkAllFundAttribute($fund);
        
        return $fundFactory->delete($this->getFund());
    }
}