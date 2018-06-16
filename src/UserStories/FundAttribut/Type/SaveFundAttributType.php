<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/FundAttributTypFactory.php");

class SaveFundAttributType extends UserStory
{
    #region variables
    private $_fundAttributType = null;
    #endregion

    #endregion properties
    #region input and output properties
    public function getFundAttributType()
    {
        return $this->_fundAttributType;
    }

    public function setFundAttributType($fundAttributType)
    {
        $this->_fundAttributType = $fundAttributType;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        $fundAttributTyp = $this->getFundAttributType();
        $fundAttributTypFactory = new FundAttributTypFactory();
        $fundAttributTypen = $fundAttributTypFactory->loadAll();

        for ($i = 0; $i < count($fundAttributTypen); $i++)
        {
            if ($fundAttributTypen[$i]->getBezeichnung() == $fundAttributTyp->getBezeichnung() &&
                ($fundAttributTyp->getId() == -1 ||
                 $fundAttributTyp->getId() != $fundAttributTypen[$i]->getId()))
            {
                $this->addMessage("Es existiert bereits ein Fundattributtyp mit der Bezeichnung \"".$fundAttributTyp->getBezeichnung()."\"!");
                return false;
            }
        }

        return true;
    }

    protected function execute()
    {
        $fundAttributTypeFactory = new FundAttributTypFactory();
        $this->setFundAttributType($fundAttributTypeFactory->save($this->getFundAttributType()));

        return true;
    }
}