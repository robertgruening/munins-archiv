<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/KontextTypFactory.php");

class LoadKontextTypes extends UserStory
{
    #region variables
    private $_id = 0;
    private $_kontextTypes = array();
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
    public function getKontextTypes()
    {
        return $this->_kontextTypes;
    }

    private function setKontextTypes($kontextTypes)
    {
        $this->_kontextTypes = $kontextTypes;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $kontextTypeFactory = new KontextTypFactory();
        $this->setKontextTypes($kontextTypeFactory->loadAll());
        
        return true;
    }
}