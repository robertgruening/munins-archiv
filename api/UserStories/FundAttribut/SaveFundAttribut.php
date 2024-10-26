<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundAttributFactory.php");
require_once(__DIR__."/../../UserStories/FundAttribut/LoadFundAttribut.php");

class SaveFundAttribut extends UserStory
{
    #region variables
    private $_fundAttribut = null;
    #endregion

    #region properties
    #region input properties
    public function setFundAttribut($fundAttribut)
    {
        $this->_fundAttribut = $fundAttribut;
    }
    #endregion

    #region output properties
    public function getFundAttribut()
    {
        return $this->_fundAttribut;
    }
    #endregion
    #endregion

    #region methods
    protected function areParametersValid()
    {
        $fundAttribut = $this->getFundAttribut();

        if ($fundAttribut == null)
        {
            global $logger;
            $logger->warn("Fundattribut ist nicht gesetzt!");
            $this->addMessage("Fundattribut ist nicht gesetzt!");
            return false;
        }

        $areParametersValid = true;

        if ($fundAttribut->getBezeichnung() == null ||
        $fundAttribut->getBezeichnung() == "")
        {
            global $logger;
            $logger->warn("Bezeichnung ist nicht gesetzt!");
            $this->addMessage("Bezeichnung ist nicht gesetzt!");
            $areParametersValid = false;
        }

        if ($fundAttribut->getType() == null)
        {
            global $logger;
            $logger->warn("Typ ist nicht gesetzt!");
            $this->addMessage("Typ ist nicht gesetzt!");
            $areParametersValid = false;
        }

        if (FundAttributFactory::isNodeInCircleCondition($fundAttribut))
        {
            global $logger;
            $logger->warn("Fundattribut darf sich nicht selbst zum über- oder untergeordneten Knoten haben!");
            $this->addMessage("Fundattribut darf sich nicht selbst zum über- oder untergeordneten Knoten haben!");
            $areParametersValid = false;
        }

        return $areParametersValid;
    }

    protected function execute()
    {
        $fundAttributFactory = new FundAttributFactory();

        $savedFundAttribut = $fundAttributFactory->save($this->getFundAttribut());

        $loadFundAttribut = new LoadFundAttribut();
        $loadFundAttribut->setId($savedFundAttribut->getId());

        if (!$loadFundAttribut->run())
        {
            $this->addMessages($loadFundAttribut->getMessages());
            return false;
        }

        $this->setFundAttribut($loadFundAttribut->getFundAttribut());

        return true;
    }
    #endregion
}
