<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtTypFactory.php");

class SaveOrtType extends UserStory
{
    #region variables
    private $_ortType = null;
    #endregion

    #endregion properties
    #region input and output properties
    public function getOrtType()
    {
        return $this->_ortType;
    }

    public function setOrtType($ortType)
    {
        $this->_ortType = $ortType;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        $ortTyp = $this->getOrtType();
        $ortTypFactory = new OrtTypFactory();
        $ortTypen = $ortTypFactory->loadAll();

        for ($i = 0; $i < count($ortTypen); $i++)
        {
            if ($ortTypen[$i]->getBezeichnung() == $ortTyp->getBezeichnung() &&
                ($ortTyp->getId() == -1 ||
                 $ortTyp->getId() != $ortTypen[$i]->getId()))
            {
                $this->addMessage("Es existiert bereits ein Ortstyp mit der Bezeichnung \"".$ortTyp->getBezeichnung()."\"!");
                return false;
            }
        }

        return true;
    }

    protected function execute()
    {
        $ortTypeFactory = new OrtTypFactory();
        $this->setOrtType($ortTypeFactory->save($this->getOrtType()));

        return true;
    }
}