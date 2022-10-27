<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundAttributFactory.php");

class LoadFundAttribut extends UserStory
{
    #region variables
    private $_id = 0;
    private $_fundAttribut = null;
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
    public function getFundAttribut()
    {
        return $this->_fundAttribut;
    }

    private function setFundAttribut($fundAttribut)
    {
        $this->_fundAttribut = $fundAttribut;
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
        $fundAttributFactory = new FundAttributFactory();
        $fundAttribut = $fundAttributFactory->loadById($this->getId());

        if ($fundAttribut == null)
        {
            $this->addMessage("Es gibt kein Fundattribut mit der Id ".$this->getId()."!");
            return false;
        }

        $fundAttribut = $fundAttributFactory->loadParent($fundAttribut);
        $fundAttribut = $fundAttributFactory->loadChildren($fundAttribut);
        $this->setFundAttribut($fundAttribut);

        return true;
    }
}