<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/LfdNummerFactory.php");

class SaveLfdNummer extends UserStory
{
    #region variables
    private $_lfdNummer = null;
    #endregion

    #endregion properties
    #region input and output properties
    public function getLfdNummer()
    {
        return $this->_lfdNummer;
    }

    public function setLfdNummer($lfdNummer)
    {
        $this->_lfdNummer = $lfdNummer;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        global $logger;
        $lfdNummer = $this->getLfdNummer();
        $lfdNummerFactory = new LfdNummerFactory();
        $lfdNummern = $lfdNummerFactory->loadAll();

        for ($i = 0; $i < count($lfdNummern); $i++)
        {
            if ($lfdNummern[$i]->getBezeichnung() == $lfdNummer->getBezeichnung() &&
                ($lfdNummer->getId() == -1 ||
                 $lfdNummer->getId() != $lfdNummern[$i]->getId()))
            {
                $logger->warn("Es existiert bereits eine LfD-Nummer mit der Bezeichnung \"".$lfdNummer->getBezeichnung()."\"!");
                $this->addMessage("Es existiert bereits eine LfD-Nummer mit der Bezeichnung \"".$lfdNummer->getBezeichnung()."\"!");
                return false;
            }
        }

        return true;
    }

    protected function execute()
    {
        $lfdNummerFactory = new LfdNummerFactory();
        $this->setLfdNummer($lfdNummerFactory->save($this->getLfdNummer()));

        return true;
    }
}