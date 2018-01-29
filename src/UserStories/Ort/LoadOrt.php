<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/OrtFactory.php");

class LoadOrt extends UserStory
{
    #region variables
    private $_id = 0;
    private $_ort = null;
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
    public function getOrt()
    {
        return $this->_ort;
    }

    private function setOrt($ort)
    {
        $this->_ort = $ort;
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
        $ortFactory = new OrtFactory();
        $ort = $ortFactory->loadById($this->getId());

        if ($ort == null)
        {
            $this->addMessage("Es gibt keinen Ort mit der Id ".$this->getId()."!");
            return false;
        }

        $ort = $ortFactory->loadParent($ort);
        $ort = $ortFactory->loadChildren($ort);
        $ort = $ortFactory->loadKontexte($ort);
        $this->setOrt($ort);

        return true;
    }
}