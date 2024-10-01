<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/../Model/User.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/ListFactory.php");

class UserFactory extends Factory implements iListFactory
{
    #region variables
	private $_listFactory = null;
    #endregion

    #region properties
    protected function getListFactory()
    {
        return $this->_listFactory;
    }

    #endregion

    #region constructors
    function __construct()
    {
	    $this->_listFactory = new ListFactory($this);
    }
    #endregion

    #region methods
    /**
     * Returns the name of the database table.
     */
    public function getTableName()
    {
        return "User";
    }

    #region load
	/**
	* Returns the SQL SELECT statement to load Id, UserName, Guid and Bookmark as string.
	*/
	protected function getSqlStatementToLoad()
	{		
        	return "SELECT Id, UserName, `Guid`, Bookmark
        		    FROM ".$this->getTableName();
	}

	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, UserName and Guid.
	*
	* @param $searchConditions Array of search conditions (key, value) to be translated into SQL WHERE conditions.
	*/
	protected function getSqlSearchConditionStrings($searchConditions)
	{
		if ($searchConditions == null ||
			count($searchConditions) == 0)
		{
			return array();
		}

		$sqlSearchConditionStrings = array();
		
		if (isset($searchConditions["UserName"]))
		{
			array_push($sqlSearchConditionStrings, "UserName = ".$searchConditions["UserName"]);
		}
		
		if (isset($searchConditions["Guid"]))
		{
			array_push($sqlSearchConditionStrings, "Guid = '".$searchConditions["Guid"]."'");
		}

		if ($this->getTreeFactory() instanceof iSqlSearchConditionStringsProvider)
		{
			$sqlSearchConditionStrings = array_merge($sqlSearchConditionStrings, $this->getTreeFactory()->getSqlSearchConditionStringsBySearchConditions($searchConditions));
		}
		
		return $sqlSearchConditionStrings;
	}
    
	public function loadByGuid($guid)
	{
		global $logger;
		$logger->debug("Lade Element (".$guid.")");

		$element = null;
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadByGuid($guid));

			if ($mysqli->errno)
			{
				$logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
			}
			else
			{
				$element = $this->fill($ergebnis->fetch_assoc());
			}
		}

		$mysqli->close();

		return $element;
	}

    /**
    * Returns the SQL statement to load ID, UserName, GUID und Bookmark
    * by User GUID.
    *
    * @param $guid GUID of the User to load.
    */
    protected function getSQLStatementToLoadByGuid($guid)
    {
        return "SELECT Id, UserName, Guid, Bookmark
                FROM ".$this->getTableName()."
                WHERE Guid = '".$guid."';";
    }

    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, UserName, Guid, Bookmark
                FROM ".$this->getTableName()."
                WHERE Id = ".$id.";";
    }

    public function loadAll()
    {
        return $this->getListFactory()->loadAll();
    }

    protected function fill($dataSet)
    {
        if ($dataSet == null)
        {
            return null;
        }

        $user = new User();
        $user->setId(intval($dataSet["Id"]));
        $user->setUserName($dataSet["UserName"]);
        $user->setGuid($dataSet["Guid"]);
        $user->setBookmark($dataSet["Bookmark"]);

        return $user;
    }
    #endregion

    #region save
    protected function getSQLStatementToInsert(iNode $element)
    {
        return "INSERT INTO ".$thss->getTableme." (UserName, Guide, Bookmark)
                VALUES ('".addslashes($element->getUserName())."', UUID(), '".addslashes($element->getBookmark())."');";
    }

    protected function getSQLStatementToUpdate(iNode $element)
    {
        return "UPDATE ".$this->getTableName()."
                SET UserName = '".addslashes($element->getUserName())."',
                    BookmarkName = '".addslashes($element->getBookmark())."'
                WHERE Id = ".$element->getId().";";
    }
    #endregion

    #region convert
    public function convertToInstance($object)
    {
        global $logger;
        $logger->debug("Konvertiere Daten zu User");

        if ($object == null)
        {
            $logger->error("User ist nicht gesetzt!");
            return null;
        }

        $user = new User();

        if (isset($object["Id"]))
        {
            $user->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("ID ist nicht gesetzt!");
        }

        if (isset($object["UserName"]))
        {
            $user->setUserName($object["UserName"]);
        }
        else
        {
            $logger->debug("Benutzername ist nicht gesetzt!");
	    }

        if (isset($object["Guid"]))
        {
            $user->setGuid($object["Guid"]);
        }
        else
        {
            $logger->debug("GUID ist nicht gesetzt!");
	    }

        if (isset($object["Bookmark"]))
        {
            $user->setBookmark($object["Bookmark"]);
        }
        else
        {
            $logger->debug("Bookmark ist nicht gesetzt!");
	    }
        
        return $user;
    }
    #endregion
    #endregion
}
