<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/LfdNummerFactory.php");

class LoadLfdNummern extends UserStory
{
    #region variables
    private $_lfdNummern = array();
    #endregion

    #endregion properties
    #region output properties
    public function getLfdNummern()
    {
        return $this->_lfdNummern;
    }

    private function setLfdNummern($lfdNummern)
    {
        $this->_lfdNummern = $lfdNummern;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $lfdNummerFactory = new LfdNummerFactory();
        $roots = $lfdNummerFactory->loadAll();
        $this->setLfdNummern($roots);

        return true;
    }
}