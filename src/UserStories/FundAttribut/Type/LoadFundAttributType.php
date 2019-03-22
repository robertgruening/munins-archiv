<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/FundAttributTypeFactory.php");

class LoadFundAttributType extends UserStory
{
    #region variables
    private $_id = 0;
    private $_fundAttributType = null;
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
    public function getFundAttributType()
    {
        return $this->_fundAttributType;
    }

    private function setFundAttributType($fundAttributType)
    {
        $this->_fundAttributType = $fundAttributType;
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
        $fundAttributTypeFactory = new FundAttributTypeFactory();
        $fundAttributType = $fundAttributTypeFactory->loadById($this->getId());
        
        if ($fundAttributType == null)
        {
            $this->addMessage("Es gibt keinen Fundattributtyp mit der Id ".$this->getId()."!");
            return false;
        }

        $this->setFundAttributType($fundAttributType);

        return true;
    }
}