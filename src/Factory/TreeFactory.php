<?php
include_once(__DIR__."/config.php");
include_once(__DIR__."/ITreeFactory.php");

class TreeFactory implements iTreeFactory
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
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadParentId($node));
			
			if (!$mysqli->errno)
			{
			    $parentId = $ergebnis->fetch_assoc()["Parent_Id"];
			    
			    if ($parentId != null)
			    {
					$parent = $this->getModelFactory()->loadById(intval($parentId));
					$node->setParent($parent);
			    }				
			}
		}
		
		$mysqli->close();
		
		return $node;
    }
    
    private function getSQLStatementToLoadParentId(iTreeNode $node)
    {
        return "SELECT Parent_Id
                FROM ".$this->getModelFactory()->getTableName()."
                WHERE Id = ".$node->getId().";";
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
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadChildrenIds($node));
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$child = $this->getModelFactory()->loadById(intval($datensatz["Id"]));
					
					if ($child != null)
					{
    					$node->addChild($child);
					}
				}				
			}
		}
		
		$mysqli->close();
		
		return $node;
    }
    
    private function getSQLStatementToLoadChildrenIds(iTreeNode $node)
    {
        return "SELECT Id
                FROM ".$this->getModelFactory()->getTableName()."
                WHERE Parent_Id = ".$node->getId();
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
        $roots = array();
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);
		
		if (!$mysqli->connect_errno)
		{
			$mysqli->set_charset("utf8");
			$ergebnis = $mysqli->query($this->getSQLStatementToLoadRootIds());
			
			if (!$mysqli->errno)
			{
				while ($datensatz = $ergebnis->fetch_assoc())
				{
					$root = $this->getModelFactory()->loadById(intval($datensatz["Id"]));
					
					if ($root != null)
					{
    					array_push($roots, $root);
					}
				}				
			}
		}
		
		$mysqli->close();
		
		return $roots;
    }
    
    private function getSQLStatementToLoadRootIds()
    {
        return "SELECT Id
                FROM ".$this->getModelFactory()->getTableName()."
                WHERE Parent_Id IS NULL;";
	}
	#endregion
}
