<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/KontextFactory.php");
require_once(__DIR__."/../../UserStories/Kontext/LoadKontext.php");

class SaveKontext extends UserStory
{
    #region variables
    private $_kontext = null;
    #endregion

    #region properties
    #region input properties
    public function setKontext($kontext)
    {
        $this->_kontext = $kontext;
    }
    #endregion

    #region output properties
    public function getKontext()
    {
        return $this->_kontext;
    }
    #endregion
    #endregion

    #region methods
    protected function areParametersValid()
    {
        global $logger;
        $kontext = $this->getKontext();

        if ($kontext == null)
        {
            $logger->warn("Kontext ist nicht gesetzt!");
            $this->addMessage("Kontext ist nicht gesetzt!");
            return false;
        }

        $areParametersValid = true;

        if ($kontext->getBezeichnung() == null ||
            $kontext->getBezeichnung() == "")
        {
            $logger->warn("Bezeichnung ist nicht gesetzt!");
            $this->addMessage("Bezeichnung ist nicht gesetzt!");
            $areParametersValid = false;
        }

        if ($kontext->getType() == null)
        {
            $logger->warn("Typ ist nicht gesetzt!");
            $this->addMessage("Typ ist nicht gesetzt!");
            $areParametersValid = false;
        }
        else if ($kontext->getType()->getBezeichnung() != "Fundstelle" &&
            $kontext->getType()->getBezeichnung() != "Begehungsfläche" &&
            $kontext->getType()->getBezeichnung() != "Begehung")
        {
            $logger->warn("Typ (".$kontext->getType()->getBezeichnung().") wird nicht unterstützt!");
            $this->addMessage("Typ (".$kontext->getType()->getBezeichnung().") wird nicht unterstützt!");
            $areParametersValid = false;
        }

        if (KontextFactory::isNodeInCircleCondition($kontext))
        {
            $logger->warn("Kontext darf sich nicht selbst zum über- oder untergeordneten Knoten haben!");
            $this->addMessage("Kontext darf sich nicht selbst zum über- oder untergeordneten Knoten haben!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $kontextFactory = new KontextFactory();

        $savedKontext = $kontextFactory->save($this->getKontext());

        $loadKontext = new LoadKontext();
        $loadKontext->setId($savedKontext->getId());

        if (!$loadKontext->run())
        {
            $this->addMessages($loadKontext->getMessages());
            return false;
        }

        $kontextFromDatabase = $loadKontext->getKontext();
        $kontextFromDatabase = $kontextFactory->updateParent($kontextFromDatabase, $this->getKontext()->getParent());
        $kontextFromDatabase = $kontextFactory->synchroniseChildren($kontextFromDatabase, $this->getKontext()->getChildren());
        $kontextFromDatabase = $kontextFactory->updatePathRecursive($kontextFromDatabase);
        $kontextFromDatabase = $kontextFactory->synchroniseLfdNummern($kontextFromDatabase, $this->getKontext()->getLfdNummern());

        if ($kontextFromDatabase instanceof iOrtContainer)
        {
            $kontextFromDatabase = $kontextFactory->synchroniseOrte($kontextFromDatabase, $this->getKontext()->getOrte());
        }

        if ($kontextFromDatabase instanceof iFundContainer)
        {
            $kontextFromDatabase = $kontextFactory->synchroniseFunde($kontextFromDatabase, $this->getKontext()->getFunde());
        }

        $this->setKontext($kontextFromDatabase);

        return true;
    }
    #endregion
}
