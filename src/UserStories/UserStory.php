<?php

abstract class UserStory
{
    #region variables
    private $_messages = array();
    #endregion

    #endregion properties
    #region output properties
    public function getMessages()
    {
        return $this->_messages;
    }

    protected function clearMessages()
    {
        $this->_messages = array();
    }

    protected function addMessages($messages)
    {
        array_merge($this->_messages, $messages);
    }

    protected function addMessage($message)
    {
        array_push($this->_messages, $message);
    }
    #endregion
    #endregion

    public function run()
    {
        global $logger;
        $logger->debug("Starte User Story");
        
        $this->clearMessages();

        if ($this->areParametersValid())
        {
            $logger->debug("Führe User Story aus");

            return $this->execute();
        }
        
        $logger->debug("Parameter sind nicht gültig");
    
        return false;
    }

    abstract protected function areParametersValid();
    abstract protected function execute();
}