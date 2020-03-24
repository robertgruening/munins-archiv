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

        if ($lfdNummer->getBezeichnung() == null ||
            trim($lfdNummer->getBezeichnung()) == "")
        {
            $logger->warn("Bezeichnung ist nicht gesetzt!");
            $this->addMessage("Bezeichnung ist nicht gesetzt!");
            return false;
        }
        else if (strlen($lfdNummer->getBezeichnung()) > 30)
        {
            $logger->warn("Bezeichnung darf nicht länger als 30 Zeichen sein!");
            $this->addMessage("Bezeichnung darf nicht länger als 30 Zeichen sein!");
            return false;
        }

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
