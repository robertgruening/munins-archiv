<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/UserFactory.php");

class SaveUser extends UserStory
{
    #region variables
    private $_user = null;
    #endregion

    #endregion properties
    #region input and output properties
    public function getUser()
    {
        return $this->_user;
    }

    public function setUser($user)
    {
        $this->_user = $user;
    }
    #endregion
    #endregion

    protected function areParametersValid()
    {
        global $logger;
        $user = $this->getUser();

        if ($user->getUserName() == null ||
            trim($user->getUserName()) == "")
        {
            $logger->warn("Benutzername ist nicht gesetzt!");
            $this->addMessage("Benutzername ist nicht gesetzt!");
            return false;
        }
        else if (strlen($user->getUserName()) > 20)
        {
            $logger->warn("Benutzername darf nicht länger als 20 Zeichen sein!");
            $this->addMessage("Benutzername darf nicht länger als 20 Zeichen sein!");
            return false;
	    }

        if ($user->getBookmark() != null &&
            strlen($user->getBookmark()) > 100)
        {
            $logger->warn("Bookmark darf nicht länger als 100 Zeichen sein!");
            $this->addMessage("Bookmark darf nicht länger als 100 Zeichen sein!");
            return false;
        }

        return true;
    }

    protected function execute()
    {
        $userFactory = new UserFactory();
        $this->setUser($userFactory->save($this->getUser()));

        return true;
    }
}
