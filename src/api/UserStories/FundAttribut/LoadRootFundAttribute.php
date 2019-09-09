<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundAttributFactory.php");

class LoadRootFundAttribute extends UserStory
{
    #region variables
    private $_rootFundAttribute = array();
    #endregion

    #endregion properties
    #region output properties
    public function getRootFundAttribute()
    {
        return $this->_rootFundAttribute;
    }

    private function setRootFundAttribute($rootFundAttribute)
    {
        $this->_rootFundAttribute = $rootFundAttribute;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $lfdNummerFactory = new FundAttributFactory();
        $roots = $lfdNummerFactory->loadRoots();
        $this->setRootFundAttribute($roots);

        return true;
    }
}