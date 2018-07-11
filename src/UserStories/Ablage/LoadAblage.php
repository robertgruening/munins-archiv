<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/AblageFactory.php");

class LoadAblage extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ablage = null;
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
    public function getAblage()
    {
        return $this->_ablage;
    }

    private function setAblage($ablage)
    {
        $this->_ablage = $ablage;
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
        $ablageFactory = new AblageFactory();
        $ablage = $ablageFactory->loadById($this->getId());
        
        if ($ablage == null)
        {
            global $logger;
            $logger->warn("Es gibt keine Ablage mit der Id ".$this->getId()."!");
            $this->addMessage("Es gibt keine Ablage mit der Id ".$this->getId()."!");
            return false;
        }

        $ablage = $ablageFactory->loadParent($ablage);
        $ablage = $ablageFactory->loadChildren($ablage);
        $ablage = $ablageFactory->loadFunde($ablage);
        $this->setAblage($ablage);

        return true;
    }
}