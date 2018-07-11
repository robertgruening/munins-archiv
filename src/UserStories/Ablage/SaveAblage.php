<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/AblageFactory.php");
require_once(__DIR__."/../../UserStories/Ablage/LoadAblage.php");

class SaveAblage extends UserStory
{
    #region variables
    private $_ablage = null;
    #endregion

    #region properties
    #region input properties
    public function setAblage($ablage)
    {
        $this->_ablage = $ablage;
    }
    #endregion

    #region output properties
    public function getAblage()
    {
        return $this->_ablage;
    }
    #endregion
    #endregion

    #region methods
    protected function areParametersValid()
    {
        $ablage = $this->getAblage();
        
        if ($ablage == null)
        {
            global $logger;
            $logger->warn("Ablage ist nicht gesetzt!");
            $this->addMessage("Ablage ist nicht gesetzt!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $ablageFactory = new AblageFactory();

        $savedAblage = $ablageFactory->save($this->getAblage());

        $loadAblage = new LoadAblage();
        $loadAblage->setId($savedAblage->getId());
        
        if (!$loadAblage->run())
        {
            $this->addMessages($loadAblage->getMessages());
            return false;
        }

        $ablageFromDatabase = $loadAblage->getAblage();
        $ablageFromDatabase = $ablageFactory->updateParent($ablageFromDatabase, $this->getAblage()->getParent());
        $ablageFromDatabase = $ablageFactory->synchroniseChildren($ablageFromDatabase, $this->getAblage()->getChildren());
        $ablageFromDatabase = $ablageFactory->synchroniseFunde($ablageFromDatabase, $this->getAblage()->getFunde());
        $this->setAblage($ablageFromDatabase);

        return true;
    }
    #endregion
}