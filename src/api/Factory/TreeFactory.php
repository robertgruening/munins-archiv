<?php
include_once(__DIR__."/config.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/ISqlSearchConditionStringsProvider.php");

class TreeFactory implements iTreeFactory, iSqlSearchConditionStringsProvider
{
	#region variables
	private $_modelFactory = null;
	#endregion

	#region properties
	protected function getModelFactory()
	{
		return $this->_modelFactory;
	}
	#endregion
	
	#region constructors
	function __construct($modelFactory)
	{
		$this->_modelFactory = $modelFactory;
	}
	#endregion

	#region parent
	#region methods
	/**
	 * Loads the parent from database and sets it into the
	 * given node.
	 * Returns the updated node.
	 * 
	 * @param iTreeNode $node Node to set the parent to.
	 */
	public function loadParent(iTreeNode $node)
	{
		$searchConditions = array();
		$searchConditions["Child_Id"] = $node->getId();

		$elements = $this->getModelFactory()->loadBySearchConditions($searchConditions);

		if ($elements == null ||
			count($elements) == 0)
		{
			return $node;
		}

		$node->setParent($elements[0]);
		
		return $node;
	}

	/**
	* Returns the SQL statement search conditions as string by the given search conditions.
	* Search condition keys are: Id, Bezeichnung, HasParent, Parent_Id, HasChildren and Child_Id.
	*
	* @param $searchConditions Array of search conditions (key, value) to be translated into SQL WHERE conditions.
	*/
	public function getSqlSearchConditionStringsBySearchConditions($searchConditions)
	{
		if ($searchConditions == null ||
			count($searchConditions) == 0)
		{
			return $sqlStatement;
		}

		$sqlSearchConditionStrings = array();

		if (isset($searchConditions["Id"]))
		{
			array_push($sqlSearchConditionStrings, "Id = ".$searchConditions["Id"]);
		}

		if (isset($searchConditions["Bezeichnung"]))
		{
			array_push($sqlSearchConditionStrings, "Bezeichnung LIKE '%".$searchConditions["Bezeichnung"]."%'");
		}
		
		if (isset($searchConditions["HasParent"]))
		{
			if ($searchConditions["HasParent"] === true)
			{
				array_push($sqlSearchConditionStrings, "Parent_Id IS NOT NULL");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "Parent_Id IS NULL");
			}		
		}

		if (isset($searchConditions["Parent_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Parent_Id = ".$searchConditions["Parent_Id"]);
		}

		if (isset($searchConditions["HasChildren"]))
		{
			if ($searchConditions["HasChildren"] === true)
			{
				array_push($sqlSearchConditionStrings, "EXISTS (SELECT * FROM ".$this->getTableName()." AS child WHERE child.Parent_Id = ".$this->getTableName().".Id)");
			}
			else
			{
				array_push($sqlSearchConditionStrings, "NOT EXISTS (SELECT * FROM ".$this->getTableName()." AS child WHERE child.Parent_Id = ".$this->getTableName().".Id)");
			}
		}

		if (isset($searchConditions["Child_Id"]))
		{
			array_push($sqlSearchConditionStrings, "Id = (SELECT Parent_Id FROM ".$this->getModelFactory()->getTableName()." WHERE Id = ".$searchConditions["Child_Id"].")");
		}

		return $sqlSearchConditionStrings;
	}

	public function linkParent(iTreeNode $node, iTreeNode $parent)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLinkParent($node, $parent));
			
			if (!$mysqli->errno)
			{
				$node->setParent($parent);
			}
		}
		
		$mysqli->close();
		
		return $node;
	}
	
	private function getSQLStatementToLinkParent(iTreeNode $node, iTreeNode $parent)
	{
		return "Update ".$this->getModelFactory()->getTableName()."
				SET Parent_Id = ".$parent->getId()."
				WHERE Id = ".$node->getId().";";
	}
	
	public function unlinkParent(iTreeNode $node)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToUnlinkParent($node));
			
			if (!$mysqli->errno)
			{
				$node->setParent(null);
			}
		}
		
		$mysqli->close();
		
		return $node;
	}
	
	private function getSQLStatementToUnlinkParent(iTreeNode $node)
	{
		return "Update ".$this->getModelFactory()->getTableName()."
				SET Parent_Id = NULL
				WHERE Id = ".$node->getId().";";
	}

	public function updateParent(iTreeNode $node, iTreeNode $parent = null)
	{
		if ($parent == null)
		{
			return $this->unlinkParent($node);
		}

		return $this->linkParent($node, $parent);
	}
	#endregion

	#region children
	/**
	 * Loads all children of the given node,
	 * sets these in the node and returns the
	 * filled node.
	 * 
	 * @param iTreeNode $node Node to fill with its children.
	 */
	public function loadChildren(iTreeNode $node)
	{
		$searchConditions = array();
		$searchConditions["Parent_Id"] = $node->getId();

		$elements = $this->getModelFactory()->loadBySearchConditions($searchConditions);

		if ($elements == null ||
			count($elements) == 0)
		{
			return $node;
		)

		$node->setChidlren($elements);

		return $node;
	}
    
	public function linkChild(iTreeNode $node, iTreeNode $child)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLinkChild($node, $child));
			
			if (!$mysqli->errno)
			{
				$node->addChild($child);
			}
		}
		
		$mysqli->close();
		
		return $node;
	}
	
	private function getSQLStatementToLinkChild(iTreeNode $node, iTreeNode $child)
	{
		return "Update ".$this->getModelFactory()->getTableName()."
				SET Parent_Id = ".$node->getId()."
				WHERE Id = ".$child->getId();
	}
	
	public function unlinkChild(iTreeNode $node, iTreeNode $child)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToUnlinkChild($child));
			
			if (!$mysqli->errno)
			{
				$node->removeChild($child);
			}
		}
		
		$mysqli->close();
		
		return $node;
	}
	
	private function getSQLStatementToUnlinkChild(iTreeNode $child)
	{
		return "Update ".$this->getModelFactory()->getTableName()."
				SET Parent_Id = NULL
				WHERE Id = ".$child->getId().";";
	}
	
	public function unlinkAllChildren(iTreeNode $node)
	{
		$mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToUnlinkAllChildren($node));
			
			if (!$mysqli->errno)
			{
				$node->setChildren(array());
			}
		}
		
		$mysqli->close();
		
		return $node;
	}
	
	private function getSQLStatementToUnlinkAllChildren(iTreeNode $node)
	{
		return "Update ".$this->getModelFactory()->getTableName()."
				SET Parent_Id = NULL
				WHERE Parent_Id = ".$node->getId().";";
	}
	
	public function linkChildren(iTreeNode $node, array $children)
	{
		for ($i = 0; $i < count($children); $i++)
		{
			$node = $this->linkChild($node, $children[$i]);
		}

		return $node;
	}
	
	public function unlinkChildren(iTreeNode $node, array $children)
	{
		for ($i = 0; $i < count($children); $i++)
		{
			$node = $this->unlinkChild($node, $children[$i]);
		}

		return $node;
	}

	/**
	 * Synchronises the node's children with the given
	 * children.
	 * Returns the updated node.
	 * 
	 * @param iTreeNode $node Node to synchronise.
	 * @param array $children Nodes to be used as new children.
	 */
	public function synchroniseChildren(iTreeNode $node, array $children)
	{
		$node = $this->linkNewChildren($node, $children);
		$node = $this->unlinkObsoleteChildren($node, $children);

		return $node;
	}
	
	/**
	 * Links children that are not in the node's
	 * child list.
	 * Returns the updated node.
	 * 
	 * @param iTreeNode $node Node to be updated with new children.
	 * @param array $children Nodes to be used as new children.
	 */
	protected function linkNewChildren(iTreeNode $node, array $children)
	{
		for ($i = 0; $i < count($children); $i++)
		{
			$contains = false;

			for ($j = 0; $j < count($node->getChildren()); $j++)
			{
				if ($children[$i]->getId() == $node->getChildren()[$j]->getId())
				{
					$contains = true;
					break;
				}
			}

			if (!$contains)
			{
				$node = $this->linkChild($node, $children[$i]);
			}
		}

		return $node;
	}	
	
	/**
	 * Unlinks children that are in the node's
	 * child list, but not in the given children.
	 * Returns the updated node.
	 * 
	 * @param iTreeNode $node Node to be cleaned up from obsolete children.
	 * @param array $children Nodes to be used as new children.
	 */
	protected function unlinkObsoleteChildren(iTreeNode $node, array $children)
	{
		for ($i = 0; $i < count($node->getChildren());)
		{
			$contains = false;

			for ($j = 0; $j < count($children); $j++)
			{
				if ($children[$j]->getId() == $node->getChildren()[$i]->getId())
				{
					$contains = true;
					break;
				}
			}

			if ($contains)
			{
				$i++;
			}
			else
			{
				$node = $this->unlinkChild($node, $node->getChildren()[$i]);
			}
		}

		return $node;
	}
	#endregion
    
    public function getPath(iTreeNode $node)
    {
        $path = "";
        
        $node = $this->loadParent($node);
            
        if ($node->getParent() != null)
        {
            $path .= $this->getPath($node->getParent())."/";
        }
                
        $path .= $node->getBezeichnung();
        
        return $path;
    }
    
	public function loadRoots()
	{
		$searchConditions = array();
		$searchConditions["HasParent"] = false;

		return $this->getModelFactory()->loadBySearchConditions($searchConditions);
	}
	#endregion

	public static function isNodeInCircleCondition(iTreeNode $node)
	{
		if ($node->getParent() != null &&
			$node->getParent()->getId() == $node->getId())
		{
			return true;	
		}

		for ($i = 0; $i < count($node->getChildren()); $i++)		
		{
			if ($node->getChildren()[$i]->getId() == $node->getId())
			{
				return true;
			}
		}

		return false;
	}
}
