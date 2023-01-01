<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundFactory.php");

class LoadFund extends UserStory
{
    #region variables
    private $_id = 0;
    private $_fund = null;
    #endregion

    #endregion properties
    #region input properties
    public function setId($id)
    {
        $this->_id = $id;
    }

    private function getId()
    {
        return $this->_id;
    }
    #endregion

    #region output properties
    public function getFund()
    {
        return $this->_fund;
    }

    private function setFund($fund)
    {
        $this->_fund = $fund;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        if ($this->getId() === null ||
            $this->getId() === "")
        {
            $this->addMessage("Id ist nicht gesetzt!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $fundFactory = new FundFactory();
        $fund = $fundFactory->loadById($this->getId());
        
        if ($fund == null)
        {
            $this->addMessage("Es gibt keinen Fund mit der Id ".$this->getId()."!");
            return false;
        }

        $this->setFund($fund);

        return true;
    }
}