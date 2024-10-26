<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/KontextTypeFactory.php");

class LoadKontextType extends UserStory
{
    #region variables
    private $_id = 0;
    private $_kontextType = null;
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
    public function getKontextType()
    {
        return $this->_kontextType;
    }

    private function setKontextType($ablageType)
    {
        $this->_kontextType = $ablageType;
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
        $kontextTypeFactory = new KontextTypeFactory();
        $kontextType = $kontextTypeFactory->loadById($this->getId());
        
        if ($kontextType == null)
        {
            global $logger;
            $logger->warn("Es gibt keinen Kontexttyp mit der Id ".$this->getId()."!");
            $this->addMessage("Es gibt keinen Kontexttyp mit der Id ".$this->getId()."!");
            return false;
        }

        $this->setKontextType($kontextType);

        return true;
    }
}