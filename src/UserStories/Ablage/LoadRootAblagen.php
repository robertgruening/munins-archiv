<?php
require_once("../../UserStories/UserStory.php");
require_once("../../Factory/AblageFactory.php");

class LoadRootAblagen extends UserStory
{
    #region variables
    private $_rootAblagen = array();
    #endregion

    #endregion properties
    #region output properties
    public function getRootAblagen()
    {
        return $this->_rootAblagen;
    }

    private function setRootAblagen($rootAblage)
    {
        $this->_rootAblagen = $rootAblage;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $ablageFactory = new AblageFactory();
        $roots = $ablageFactory->loadRoots();
        $this->setRootAblagen($roots);

        return true;
    }
}