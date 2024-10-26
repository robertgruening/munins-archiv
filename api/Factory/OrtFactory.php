<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/OrtTypeFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");
include_once(__DIR__."/OrtCategoryFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/KontextFactory.php");
include_once(__DIR__."/../Model/Ort.php");
include_once(__DIR__."/../Model/IOrtContainer.php");

class OrtFactory extends Factory implements iTreeFactory
{
    #region variables
    private $_treeFactory = null;
    private $_ortsTypeFactory = null;
    private $_ortsCategoryFactory = null;
    private $_kontextFactory = null;
    #endregion

    #region properties
    protected function getTreeFactory()
    {
        return $this->_treeFactory;
    }

    protected function getOrtsTypeFactory()
    {
        return $this->_ortsTypeFactory;
    }

    protected function getOrtsCategoryFactory()
    {
        return $this->_ortsCategoryFactory;
    }

    protected function getKontextFactory()
    {
        if ($this->_kontextFactory == null)
        {
            $this->_kontextFactory = new KontextFactory();
        }

        return $this->_kontextFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_treeFactory = new TreeFactory($this);
        $this->_ortsTypeFactory = new OrtTypeFactory();
			$this->_ortsCategoryFactory = new OrtCategoryFactory();
    }
    #endregion

    #region methods
    /**
     * Returns the name of the database table.
     */
    public function getTableName()
    {
        return "Ort";
    }

    #region load
    /**
     * Returns the SQL SELECT statement to load Id, Bezeichnung, Typ_Id, path, Category_Id and CountOfKontexte as string.
     */
    protected function getSqlStatementToLoad()
	{
		return "SELECT Id, Bezeichnung, Typ_Id, `Path`, Category_Id, (SELECT COUNT(*) FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id) AS CountOfKontexte
			FROM ".$this->getTableName();
	}

	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, ContainsBezeichnung, Bezeichnung, Path, ConatinsPath, Typ_Id, Category_Id, HasKontexte, Kontext_Id, HasParent, Parent_Id, HasChildren and Child_Id.
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
		
		if (isset($searchConditions["Typ_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Typ_Id = ".$searchConditions["Typ_Id"]);
		}
		
		if (isset($searchConditions["Category_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Category_Id = ".$searchConditions["Category_Id"]);
		}

		if (isset($searchConditions["HasKontexte"]))
		{
			if ($searchConditions["HasKontexte"] === true)
			{
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getTableName()."_Id = ".$this->getTableName().".Id)");
			}
		}

		if (isset($searchConditions["Kontext_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Id IN (SELECT ".$this->getTableName()."_Id FROM ".$this->getKontextFactory()->getTableName()."_".$this->getTableName()." WHERE ".$this->getKontextFactory()->getTableName()."_".$this->getTableName().".".$this->getKontextFactory()->getTableName()."_Id = ".$searchConditions["Kontext_Id"].")");
		}

		if ($this->getTreeFactory() instanceof iSqlSearchConditionStringsProvider)
		{
			$sqlSearchConditionStrings = array_merge($sqlSearchConditionStrings, $this->getTreeFactory()->getSqlSearchConditionStringsBySearchConditions($searchConditions));
		}
		
		return $sqlSearchConditionStrings;
	}

    /**
    * Creates an Ablage instance and fills
    * the ID, Bezeichnung and GUID by the given
    * dataset.
    *
    * @param $dataset Dataset from Ablage table.
    */
    protected function fill($dataset)
    {
        if ($dataset == null)
        {
            return null;
        }

        global $logger;
        $logger->debug("Fülle Ort (".intval($dataset["Id"]).") mit Daten");

        $entity = new Ort();
        $entity->setId(intval($dataset["Id"]));
        $entity->setBezeichnung($dataset["Bezeichnung"]);
        $entity->setPath($dataset["Path"]);
        $entity->setType($this->getOrtsTypeFactory()->loadById(intval($dataset["Typ_Id"])));
        $entity->setCategory($this->getOrtsCategoryFactory()->loadById(intval($dataset["Category_Id"])));
        $entity->setCountOfKontexte(intval($dataset["CountOfKontexte"]));

        return $entity;
    }
    #endregion

    #region save
	public function save($element)
	{
		if ($element->getId() == -1)
		{
            // Insert
			$element = parent::save($element);
            $element = $this->updateParent($element, $element->getParent());
		}
		else
		{
            //Update
            $element = $this->updateParent($element, $element->getParent());
            $element = $this->synchroniseChildren($element, $element->getChildren());
			$element = parent::save($element);
            $this->updatePathRecursive($element);
		}

		return $element;
	}

    /**
    * Returns the SQL statement to insert Bezeichnung, Ort type ID, path and Ort category ID.
    *
    * @param iNode $ort Ort to be inserted.
    */
    protected function getSQLStatementToInsert(iNode $ort)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung, Typ_Id, `Path`, Category_Id)
                VALUES ('".addslashes($ort->getBezeichnung())."', ".$ort->getType()->getId().", '".addslashes($this->calculatePathByParentId($ort, $ort->getParent() == null ? null : $ort->getParent()->getId()))."', ".$ort->getCategory()->getId().");";
    }

    /**
    * Returns the SQL statement to update Bezeichnung, Ort type ID, path and Ort category ID.
    *
    * @param iNode $ort Ort to be updated.
    */
    protected function getSQLStatementToUpdate(iNode $ort)
    {
        return "UPDATE ".$this->getTableName()."
                SET Bezeichnung = '".addslashes($ort->getBezeichnung())."',
                    Typ_Id = ".$ort->getType()->getId().",
					`Path` = '".addslashes($this->calculatePath($ort))."',
                    Category_Id = ".$ort->getCategory()->getId()."
                WHERE Id = ".$ort->getId().";";
    }
    #endregion

    #region convert
    public function convertToInstance($object)
    {
        global $logger;
        $logger->debug("Konvertiere Daten zu Ort");

        if ($object == null)
        {
            $logger->error("Ort ist nicht gesetzt!");
            return null;
        }

        $ort = new Ort();
        $ortsType = null;
        $ortsCategory = null;

        if (isset($object["Id"]))
        {
            $ort->setId(intval($object["Id"]));
        }
        else
        {
            $logger->debug("Id ist nicht gesetzt!");
        }

        if (isset($object["Bezeichnung"]))
        {
            $ort->setBezeichnung($object["Bezeichnung"]);
        }
        else
        {
            $logger->debug("Bezeichnung ist nicht gesetzt!");
        }

        if (isset($object["Type"]))
        {
            $ortsType = $this->getOrtsTypeFactory()->convertToInstance($object["Type"]);
        }
        
        if ($ortsType == null ||
            $ortsType->getId() == null ||
            $ortsType->getId() == "")
        {
            $logger->warn("Typ ist nicht gesetzt!");
        }
        else
        {
        		$ort->setType($ortsType);
        }

        if (isset($object["Category"]))
        {
            $ortsCategory = $this->getOrtsCategoryFactory()->convertToInstance($object["Category"]);
        }
        
        if ($ortsCategory == null ||
            $ortsCategory->getId() == null ||
            $ortsCategory->getId() == "")
        {
            $logger->warn("Kategory ist nicht gesetzt!");
        }
        else
        {
        		$ort->setCategory($ortsCategory);
        }

        if (isset($object["Parent"]))
        {
            $ort->setParent($this->convertToInstance($object["Parent"]));
        }
        else
        {
				$logger->debug("Parent ist nicht gesetzt!");
        }

        if (isset($object["Children"]))
        {
            for ($i = 0; $i < count($object["Children"]); $i++)
            {
                $ort->addChild($this->convertToInstance($object["Children"][$i]));
            }
        }

        if (isset($object["CountOfKontexte"]))
        {
            $ort->setCountOfKontexte(intval($object["CountOfKontexte"]));
        }

        return $ort;
    }
    #endregion

    #region hierarchy
    #region parent
    public function loadParent(iTreeNode $ort)
    {
        return $this->getTreeFactory()->loadParent($ort);
    }

    public function linkParent(iTreeNode $ort, iTreeNode $parent)
    {
        return $this->getTreeFactory()->linkParent($ort, $parent);
    }

    public function unlinkParent(iTreeNode $ort)
    {
        return $this->getTreeFactory()->unlinkParent($ort);
    }

    public function updateParent(iTreeNode $ort, iTreeNode $parent = null)
    {
        return $this->getTreeFactory()->updateParent($ort, $parent);
    }
    #endregion

    #region children
    public function loadChildren(iTreeNode $ort)
    {
        return $this->getTreeFactory()->loadChildren($ort);
    }

    public function linkChild(iTreeNode $ort, iTreeNode $child)
    {
        return $this->getTreeFactory()->linkChild($ort, $child);
    }

    public function unlinkChild(iTreeNode $ort, iTreeNode $child)
    {
        return $this->getTreeFactory()->unlinkChild($ort, $child);
    }

    public function linkChildren(iTreeNode $ort, array $children)
    {
        return $this->getTreeFactory()->linkChildren($ort, $children);
    }

    public function unlinkChildren(iTreeNode $ort, array $children)
    {
        return $this->getTreeFactory()->unlinkChildren($ort, $children);
    }

    public function unlinkAllChildren(iTreeNode $ort)
    {
        return $this->getTreeFactory()->unlinkAllChildren($ort);
    }

    public function synchroniseChildren(iTreeNode $ort, array $children)
    {
        return $this->getTreeFactory()->synchroniseChildren($ort, $children);
    }
    #endregion

	#region path
	public function calculatePath(iTreeNode $entity)
	{
		return $this->getTreeFactory()->calculatePath($entity);
	}

	public function calculatePathByParentId(iTreeNode $entity, $parentId)
	{
		return $this->getTreeFactory()->calculatePathByParentId($entity, $parentId);
	}

	public function updatePathRecursive(iTreeNode $entity = null)
	{
		return $this->getTreeFactory()->updatePathRecursive($entity);
	}
	#endregion

    public function loadRoots()
    {
        return $this->getTreeFactory()->loadRoots();
    }

	public static function isNodeInCircleCondition(iTreeNode $node)
	{
        return TreeFactory::isNodeInCircleCondition($node);
	}
    #endregion

    #region Kontext
    public function loadByKontext($kontext)
    {
        $elemente = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByKontext($kontext));

			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					array_push($elemente, $this->loadById(intval($datensatz["Id"])));
				}
			}
		}

		$mysqli->close();

		return $elemente;
    }

    protected function getSQLStatementToLoadIdsByKontext($kontext)
    {
        return "SELECT Ort_Id AS Id
                FROM Kontext_".$this->getTableName()."
                WHERE Kontext_Id = ".$kontext->getId().";";
    }
    #endregion
    #endregion
}
