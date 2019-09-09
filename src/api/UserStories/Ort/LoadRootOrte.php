<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/OrtFactory.php");

class LoadRootOrte extends UserStory
{
    #region variables
    private $_rootOrte = array();
    #endregion

    #endregion properties
    #region output properties
    public function getRootOrte()
    {
        return $this->_rootOrte;
    }

    private function setRootOrte($rootOrte)
    {
        $this->_rootOrte = $rootOrte;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $ortFactory = new OrtFactory();
        $roots = $ortFactory->loadRoots();
        $this->setRootOrte($roots);

        return true;
    }
}