<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/AblageTypeFactory.php");

class LoadAblageTypes extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ablageTypes = array();
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
    public function getAblageTypes()
    {
        return $this->_ablageTypes;
    }

    private function setAblageTypes($ablageTypes)
    {
        $this->_ablageTypes = $ablageTypes;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $ablageTypeFactory = new AblageTypeFactory();
        $this->setAblageTypes($ablageTypeFactory->loadAll());
        
        return true;
    }
}