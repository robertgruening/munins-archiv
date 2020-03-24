<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/OrtFactory.php");
require_once(__DIR__."/../../UserStories/Ort/LoadOrt.php");

class SaveOrt extends UserStory
{
    #region variables
    private $_ort = null;
    #endregion

    #region properties
    #region input properties
    public function setOrt($ort)
    {
        $this->_ort = $ort;
    }
    #endregion

    #region output properties
    public function getOrt()
    {
        return $this->_ort;
    }
    #endregion
    #endregion

    #region methods
    protected function areParametersValid()
    {
        $ort = $this->getOrt();

        if ($ort == null)
        {
            global $logger;
            $logger->warn("Ort ist nicht gesetzt!");
            $this->addMessage("Ort ist nicht gesetzt!");
            return false;
        }

        $areParametersValid = true;

        if ($ort->getBezeichnung() == null ||
        $ort->getBezeichnung() == "")
        {
            global $logger;
            $logger->warn("Bezeichnung ist nicht gesetzt!");
            $this->addMessage("Bezeichnung ist nicht gesetzt!");
            $areParametersValid = false;
        }

        if ($ort->getType() == null)
        {
            global $logger;
            $logger->warn("Typ ist nicht gesetzt!");
            $this->addMessage("Typ ist nicht gesetzt!");
            $areParametersValid = false;
        }

        if (OrtFactory::isNodeInCircleCondition($ort))
        {
            global $logger;
            $logger->warn("Ort darf sich nicht selbst zum über- oder untergeordneten Knoten haben!");
            $this->addMessage("Ort darf sich nicht selbst zum über- oder untergeordneten Knoten haben!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $ortFactory = new OrtFactory();

        $savedOrt = $ortFactory->save($this->getOrt());

        $loadOrt = new LoadOrt();
        $loadOrt->setId($savedOrt->getId());

        if (!$loadOrt->run())
        {
            $this->addMessages($loadOrt->getMessages());
            return false;
        }

        $ortFromDatabase = $loadOrt->getOrt();
        $ortFromDatabase = $ortFactory->updateParent($ortFromDatabase, $this->getOrt()->getParent());
        $ortFromDatabase = $ortFactory->synchroniseChildren($ortFromDatabase, $this->getOrt()->getChildren());
        $this->setOrt($ortFromDatabase);

        return true;
    }
    #endregion
}
