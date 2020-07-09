<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/KontextFactory.php");

class LoadKontexte extends UserStory
{
    #region variables
    private $_kontexte = array();
	private $_searchConditions = array();
    #endregion

    #endregion properties
	#region input properties
	private function getSearchConditions()
	{
		return $this->_searchConditions;
	}

	public function addSearchCondition($field, $value)
	{
		$this->_searchConditions[$field] = $value;
	}
	#endregion

    #region output properties
    public function getKontexte()
    {
        return $this->_kontexte;
    }

    private function setKontexte($kontexte)
    {
        $this->_kontexte = $kontexte;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $kontextFactory = new KontextFactory();
        $kontexte = $kontextFactory->loadBySearchConditions($this->getSearchConditions());
        $this->setKontexte($kontexte);

        return true;
    }
}
