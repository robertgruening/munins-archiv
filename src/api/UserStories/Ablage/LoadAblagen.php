<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/AblageFactory.php");

class LoadAblagen extends UserStory
{
    #region variables
    private $_ablagen = array();
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
    public function getAblagen()
    {
        return $this->_ablagen;
    }

    private function setAblagen($ablagen)
    {
        $this->_ablagen = $ablagen;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $ablageFactory = new AblageFactory();
        $ablagen = $ablageFactory->loadBySearchConditions($this->getSearchConditions());
        $this->setAblagen($ablagen);

        return true;
    }
}
