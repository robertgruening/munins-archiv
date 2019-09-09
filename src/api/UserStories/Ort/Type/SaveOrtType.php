<?php
require_once(__DIR__."/../../../UserStories/UserStory.php");
require_once(__DIR__."/../../../Factory/OrtTypeFactory.php");

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
        $ortType = $this->getOrtType();

        if (strlen($ortType->getBezeichnung()) > 25)
        {
            $this->addMessage("Bezeichnung darf nicht länger als 25 Zeichen sein!");
            return false;
        }
        
        $ortTypeFactory = new OrtTypeFactory();
        $ortTypes = $ortTypeFactory->loadAll();

        for ($i = 0; $i < count($ortTypes); $i++)
        {
            if ($ortTypes[$i]->getBezeichnung() == $ortType->getBezeichnung() &&
                ($ortType->getId() == -1 ||
                 $ortType->getId() != $ortTypes[$i]->getId()))
            {
                $this->addMessage("Es existiert bereits ein Ortstyp mit der Bezeichnung \"".$ortType->getBezeichnung()."\"!");
                return false;
            }
        }

        return true;
    }

    protected function execute()
    {
        $ortTypeFactory = new OrtTypeFactory();

        $savedOrtType = $ortTypeFactory->save($this->getOrtType());

        $loadOrtType = new LoadOrtType();
        $loadOrtType->setId($savedOrtType->getId());
        
        if (!$loadOrtType->run())
        {
            $this->addMessages($loadOrtType->getMessages());
            return false;
        }

        $ortTypeFromDatabase = $loadOrtType->getOrtType();

        $this->setOrtType($ortTypeFromDatabase);

        return true;
    }
}