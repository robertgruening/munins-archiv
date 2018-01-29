<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/KontextFactory.php");

class LoadKontext extends UserStory
{
    #region variables
    private $_id = 0;
    private $_kontext = null;
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
    public function getKontext()
    {
        return $this->_kontext;
    }

    private function setKontext($kontext)
    {
        $this->_kontext = $kontext;
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
        $kontextFactory = new KontextFactory();
        $kontext = $kontextFactory->loadById($this->getId());
        
        if ($kontext == null)
        {
            $this->addMessage("Es gibt keine Kontext mit der Id ".$this->getId()."!");
            return false;
        }

        $kontext = $kontextFactory->loadParent($kontext);
        $kontext = $kontextFactory->loadChildren($kontext);
        $kontext = $kontextFactory->loadFunde($kontext);
        $this->setKontext($kontext);

        return true;
    }
}