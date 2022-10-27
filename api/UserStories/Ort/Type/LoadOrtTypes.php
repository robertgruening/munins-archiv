<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtTypeFactory.php");

class LoadOrtTypes extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ortTypes = array();
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
    public function getOrtTypes()
    {
        return $this->_ortTypes;
    }

    private function setOrtTypes($ortTypes)
    {
        $this->_ortTypes = $ortTypes;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $ortTypeFactory = new OrtTypeFactory();
        $this->setOrtTypes($ortTypeFactory->loadAll());
        
        return true;
    }
}