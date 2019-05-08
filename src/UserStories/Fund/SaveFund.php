<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundFactory.php");
require_once(__DIR__."/../../UserStories/Fund/LoadFund.php");

class SaveFund extends UserStory
{
    #region variables
    private $_fund = null;
    #endregion

    #region properties
    #region input properties
    public function setFund($fund)
    {
        $this->_fund = $fund;
    }
    #endregion

    #region output properties
    public function getFund()
    {
        return $this->_fund;
    }
    #endregion
    #endregion

    #region methods
    protected function areParametersValid()
    {
        $fund = $this->getFund();
        
        if ($fund == null)
        {
            $this->addMessage("Fund ist nicht gesetzt!");
            return false;
        }
        
        if (strlen($fund->getBezeichnung()) > 30)
        {
            $this->addMessage("Bezeichnung darf nicht länger als 30 Zeichen sein!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $fundFactory = new FundFactory();

        $savedFund = $fundFactory->save($this->getFund());

        $loadFund = new LoadFund();
        $loadFund->setId($savedFund->getId());
        
        if (!$loadFund->run())
        {
            $this->addMessages($loadFund->getMessages());
            return false;
        }

        $fundFromDatabase = $loadFund->getFund();
        $fundFromDatabase = $fundFactory->synchroniseFundAttribute($fundFromDatabase, $this->getFund()->getFundAttribute());

        $loadFund = new LoadFund();
        $loadFund->setId($savedFund->getId());
        
        if (!$loadFund->run())
        {
            $this->addMessages($loadFund->getMessages());
            return false;
        }

        $fundFromDatabase = $loadFund->getFund();

        $this->setFund($fundFromDatabase);

        return true;
    }
    #endregion
}