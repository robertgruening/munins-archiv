<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/KontextFactory.php");

class LoadRootKontexte extends UserStory
{
    #region variables
    private $_rootKontexte = array();
    #endregion

    #endregion properties
    #region output properties
    public function getRootKontexte()
    {
        return $this->_rootKontexte;
    }

    private function setRootKontexte($rootKontexte)
    {
        $this->_rootKontexte = $rootKontexte;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $lfdNummerFactory = new KontextFactory();
        $roots = $lfdNummerFactory->loadRoots();
        $this->setRootKontexte($roots);

        return true;
    }
}