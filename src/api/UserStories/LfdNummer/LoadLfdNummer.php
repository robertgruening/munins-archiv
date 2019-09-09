<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/LfdNummerFactory.php");

class LoadLfdNummer extends UserStory
{
    #region variables
    private $_id = 0;
    private $_lfdNummer = null;
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
    public function getLfdNummer()
    {
        return $this->_lfdNummer;
    }

    private function setLfdNummer($lfdNummer)
    {
        $this->_lfdNummer = $lfdNummer;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        if ($this->getId() === null ||
            $this->getId() === "")
        {
            $this->addMessage("Id ist nicht gesetzt!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $lfdNummerFactory = new LfdNummerFactory();
        $lfdNummer = $lfdNummerFactory->loadById($this->getId());

        if ($lfdNummer == null)
        {
            $this->addMessage("Es gibt keine LfD-Nummer mit der Id ".$this->getId()."!");
            return false;
        }

        $lfdNummer = $lfdNummerFactory->loadKontexte($lfdNummer);
        $this->setLfdNummer($lfdNummer);

        return true;
    }
}