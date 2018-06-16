<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtTypFactory.php");

class LoadOrtType extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ortType = null;
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
    public function getOrtType()
    {
        return $this->_ortType;
    }

    private function setOrtType($ortType)
    {
        $this->_ortType = $ortType;
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
        $ortTypeFactory = new OrtTypFactory();
        $ortType = $ortTypeFactory->loadById($this->getId());
        
        if ($ortType == null)
        {
            $this->addMessage("Es gibt keinen Ortstyp mit der Id ".$this->getId()."!");
            return false;
        }

        $this->setOrtType($ortType);

        return true;
    }
}