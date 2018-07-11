<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/AblageTypFactory.php");

class LoadAblageType extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ablageType = null;
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
    public function getAblageType()
    {
        return $this->_ablageType;
    }

    private function setAblageType($ablageType)
    {
        $this->_ablageType = $ablageType;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        if ($this->getId() === null ||
            $this->getId() === "")
        {
            global $logger;
            $logger->warn("Id ist nicht gesetzt!");
            $this->addMessage("Id ist nicht gesetzt!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $ablageTypeFactory = new AblageTypFactory();
        $ablageType = $ablageTypeFactory->loadById($this->getId());
        
        if ($ablageType == null)
        {
            global $logger;
            $logger->warn("Es gibt keinen Ablagetyp mit der Id ".$this->getId()."!");
            $this->addMessage("Es gibt keinen Ablagetyp mit der Id ".$this->getId()."!");
            return false;
        }

        $this->setAblageType($ablageType);

        return true;
    }
}