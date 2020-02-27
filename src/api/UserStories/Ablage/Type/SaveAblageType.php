<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/AblageTypeFactory.php");

class SaveAblageType extends UserStory
{
    #region variables
    private $_ablageType = null;
    #endregion

    #endregion properties
    #region input and output properties
    public function getAblageType()
    {
        return $this->_ablageType;
    }

    public function setAblageType($ablageType)
    {
        $this->_ablageType = $ablageType;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        global $logger;
        $ablageType = $this->getAblageType();

        if ($ablageType->getBezeichnung() == null ||
            trim($ablageType->getBezeichnung()) == "")
        {
            $logger->warn("Bezeichnung ist nicht gesetzt!");
            $this->addMessage("Bezeichnung ist nicht gesetzt!");
            return false;
        }
        else if (strlen($ablageType->getBezeichnung()) > 30)
        {
            $logger->warn("Bezeichnung darf nicht länger als 30 Zeichen sein!");
            $this->addMessage("Bezeichnung darf nicht länger als 30 Zeichen sein!");
            return false;
        }

        $ablageTypeFactory = new AblageTypeFactory();
        $ablageTypes = $ablageTypeFactory->loadAll();

        for ($i = 0; $i < count($ablageTypes); $i++)
        {
            if ($ablageTypes[$i]->getBezeichnung() == $ablageType->getBezeichnung() &&
                ($ablageType->getId() == -1 ||
                 $ablageType->getId() != $ablageTypes[$i]->getId()))
            {
                $logger->warn("Es existiert bereits ein Ablagetyp mit der Bezeichnung \"".$ablageType->getBezeichnung()."\"!");
                $this->addMessage("Es existiert bereits ein Ablagetyp mit der Bezeichnung \"".$ablageType->getBezeichnung()."\"!");
                return false;
            }
        }

        return true;
    }

    protected function execute()
    {
        $ablageTypeFactory = new AblageTypeFactory();

        $savedAblageType = $ablageTypeFactory->save($this->getAblageType());

        $loadAblageType = new LoadAblageType();
        $loadAblageType->setId($savedAblageType->getId());

        if (!$loadAblageType->run())
        {
            $this->addMessages($loadAblageType->getMessages());
            return false;
        }

        $ablageTypeFromDatabase = $loadAblageType->getAblageType();

        $this->setAblageType($ablageTypeFromDatabase);

        return true;
    }
}
