<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtCategoryFactory.php");

class LoadOrtCategory extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ortCategory = null;
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
    public function getOrtCategory()
    {
        return $this->_ortCategory;
    }

    private function setOrtCategory($ortCategory)
    {
        $this->_ortCategory = $ortCategory;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        if ($this->getId() === null ||
            $this->getId() === "")
        {
            $this->addMessage("Id ist nicht gesetzt!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $ortCategoryFactory = new OrtCategoryFactory();
        $ortCategory = $ortCategoryFactory->loadById($this->getId());
        
        if ($ortCategory == null)
        {
            $this->addMessage("Es gibt keine Ortskategorie mit der Id ".$this->getId()."!");
            return false;
        }

        $this->setOrtCategory($ortCategory);

        return true;
    }
}