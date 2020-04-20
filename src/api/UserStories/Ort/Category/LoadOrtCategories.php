<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtCategoryFactory.php");

class LoadOrtCategories extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ortCategories = array();
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
    public function getOrtCategories()
    {
        return $this->_ortCategories;
    }

    private function setOrtCategories($ortCategories)
    {
        $this->_ortCategories = $ortCategories;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $ortCategoryFactory = new OrtCategoryFactory();
        $this->setOrtCategories($ortCategoryFactory->loadAll());
        
        return true;
    }
}