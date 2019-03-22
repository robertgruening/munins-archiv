<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/FundAttributTypeFactory.php");

class LoadFundAttributTypes extends UserStory
{
    #region variables
    private $_id = 0;
    private $_fundAttributTypes = array();
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
    public function getFundAttributTypes()
    {
        return $this->_fundAttributTypes;
    }

    private function setFundAttributTypes($fundAttributTypes)
    {
        $this->_fundAttributTypes = $fundAttributTypes;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $fundAttributTypeFactory = new FundAttributTypeFactory();
        $this->setFundAttributTypes($fundAttributTypeFactory->loadAll());
        
        return true;
    }
}