<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/AblageFactory.php");

class LoadAblage extends UserStory
{
    #region variables
    private $_id = 0;
	private $_guid = null;
    private $_ablage = null;
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

    public function setGuid($guid)
    {
        $this->_guid = $guid;
    }

    private function getGuid()
    {
        return $this->_guid;
    }
    #endregion

    #region output properties
    public function getAblage()
    {
        return $this->_ablage;
    }

    private function setAblage($ablage)
    {
        $this->_ablage = $ablage;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
		global $logger;
		$areParametersValid = true;

        if (($this->getId() === null ||
             $this->getId() === "") &&
			($this->getGuid() === null ||
	         $this->getGuid() === ""))
        {
            $logger->warn("ID und GUID sind nicht gesetzt!");
            $this->addMessage("ID und GUID sind nicht gesetzt!");
            $areParametersValid = false;
        }

		if ($this->getId() != null &&
			$this->getId() != "")
		{
			if (!is_numeric($this->getId()) &&
				!is_int($this->getId()))
			{
            	$logger->warn("ID muss eine Zahl sein!");
            	$this->addMessage("ID muss eine Zahl sein!");
				$areParametersValid = false;
			}
		}

		if ($this->getGuid() != null &&
			$this->getGuid() != "")
		{
			if (preg_match("/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i", $this->getGuid()))
			{
            	$logger->warn("GUID muss eine Hexadezimalzahl im Format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX sein!");
            	$this->addMessage("GUID muss eine Hexadezimalzahl im Format XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX sein!");
				$areParametersValid = false;
			}
		}

        return $areParametersValid;
    }

    protected function execute()
    {
        $ablageFactory = new AblageFactory();

		if ($this->getId() != null &&
			$this->getId() != "")
		{
        	$ablage = $ablageFactory->loadById($this->getId());

	        if ($ablage == null)
	        {
	            global $logger;
	            $logger->warn("Es gibt keine Ablage mit der ID ".$this->getId()."!");
	            $this->addMessage("Es gibt keine Ablage mit der ID ".$this->getId()."!");
	            return false;
	        }
		}
		else if ($this->getGuid() != null &&
				 $this->getGuid() != "")
		{
        	$ablage = $ablageFactory->loadByGuid($this->getGuid());

	        if ($ablage == null)
	        {
	            global $logger;
	            $logger->warn("Es gibt keine Ablage mit der GUID ".$this->getGuid()."!");
	            $this->addMessage("Es gibt keine Ablage mit der GUID ".$this->getGuid()."!");
	            return false;
	        }
		}

        $ablage = $ablageFactory->loadParent($ablage);
        $ablage = $ablageFactory->loadChildren($ablage);
        $ablage = $ablageFactory->loadFunde($ablage);
        $this->setAblage($ablage);

        return true;
    }
}
