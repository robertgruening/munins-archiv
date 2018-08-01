<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/AblageTypFactory.php");

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
        $ablageTyp = $this->getAblageType();

        if ($ablageTyp->getBezeichnung() == null ||
            trim($ablageTyp->getBezeichnung()) == "")
        {
            $logger->warn("Bezeichnung ist nicht gesetzt!");
            $this->addMessage("Bezeichnung ist nicht gesetzt!");
            return false;
        }

        $ablageTypFactory = new AblageTypFactory();
        $ablageTypen = $ablageTypFactory->loadAll();

        for ($i = 0; $i < count($ablageTypen); $i++)
        {
            if ($ablageTypen[$i]->getBezeichnung() == $ablageTyp->getBezeichnung() &&
                ($ablageTyp->getId() == -1 ||
                 $ablageTyp->getId() != $ablageTypen[$i]->getId()))
            {
                $logger->warn("Es existiert bereits ein Ablagetyp mit der Bezeichnung \"".$ablageTyp->getBezeichnung()."\"!");
                $this->addMessage("Es existiert bereits ein Ablagetyp mit der Bezeichnung \"".$ablageTyp->getBezeichnung()."\"!");
                return false;
            }
        }

        return true;
    }

    protected function execute()
    {
        $ablageTypeFactory = new AblageTypFactory();
        $this->setAblageType($ablageTypeFactory->save($this->getAblageType()));

        return true;
    }
}