<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/KontextTypeFactory.php");
include_once(__DIR__."/ITreeFactory.php");
include_once(__DIR__."/TreeFactory.php");
include_once(__DIR__."/FundFactory.php");
include_once(__DIR__."/OrtFactory.php");
include_once(__DIR__."/LfdNummerFactory.php");
include_once(__DIR__."/../Model/GeoPoint.php");
include_once(__DIR__."/../Model/Kontext.php");
include_once(__DIR__."/../Model/Fundstelle.php");
include_once(__DIR__."/../Model/Begehungsflaeche.php");
include_once(__DIR__."/../Model/Begehung.php");

class KontextFactory extends Factory implements iTreeFactory
{
    #region variables
    private $_treeFactory = null;
    private $_kontextTypeFactory = null;
    private $_fundFactory = null;
    private $_ortFactory = null;
    private $_lfdNummerFactory = null;
    #endregion

    #region properties
    protected function getTreeFactory()
    {
        return $this->_treeFactory;
    }

    protected function getKontextTypeFactory()
    {
        return $this->_kontextTypeFactory;
    }

    protected function getFundFactory()
    {
        if ($this->_fundFactory == null)
        {
            $this->_fundFactory = new FundFactory();
        }

        return $this->_fundFactory;
    }

    protected function getOrtFactory()
    {
        if ($this->_ortFactory == null)
        {
            $this->_ortFactory = new OrtFactory();
        }

        return $this->_ortFactory;
    }

    protected function getLfdNummerFactory()
    {
        if ($this->_lfdNummerFactory == null)
        {
            $this->_lfdNummerFactory = new LfdNummerFactory();
        }

        return $this->_lfdNummerFactory;
    }
    #endregion

    #region constructors
    function __construct()
    {
        $this->_treeFactory = new TreeFactory($this);
        $this->_kontextTypeFactory = new KontextTypeFactory();
    }
    #endregion

    #region methods
    /**
    * Returns the name of the database table.
    */
    public function getTableName()
    {
        return "Kontext";
    }

    #region load
    protected function getSQLStatementToLoadById($id)
    {
        $kontextType = $this->getKontextTypeFactory()->loadByNodeId($id);

        if ($kontextType == null)
        {
            throw new Exception("Der Kontexttyp ist nicht gesetzt!");
        }

        switch ($kontextType->getBezeichnung())
        {
            case "Fundstelle":
            {
                return "SELECT ".$this->getTableName().".Id AS Id, ".$this->getTableName().".Bezeichnung AS Bezeichnung, ".$this->getTableName().".Typ_Id AS Typ_Id, ST_X(Fundstelle.GeoPoint) AS GeoPointLatitude, ST_Y(Fundstelle.GeoPoint) AS GeoPointLongitude
                FROM ".$this->getTableName()." LEFT JOIN Fundstelle ON ".$this->getTableName().".Id = Fundstelle.Id
                WHERE ".$this->getTableName().".Id = ".$id.";";
            }
            case "Begehungsfläche":
            {
                return "SELECT Id, Bezeichnung, Typ_Id
                FROM ".$this->getTableName()."
                WHERE Id = ".$id.";";
            }
            case "Begehung":
            {
                return "SELECT ".$this->getTableName().".Id AS Id, ".$this->getTableName().".Bezeichnung AS Bezeichnung, ".$this->getTableName().".Typ_Id AS Typ_Id, Begehung.Datum AS Datum, Begehung.Kommentar AS Kommentar
                FROM ".$this->getTableName()." LEFT JOIN Begehung ON ".$this->getTableName().".Id = Begehung.Id
                WHERE ".$this->getTableName().".Id = ".$id.";";
            }
        }

        throw new Exception("Der Kontexttyp ist nicht implementiert!");
    }

    protected function fill($dataSet)
    {
        if ($dataSet == null)
        {
            return null;
        }

        $kontextType = $this->getKontextTypeFactory()->loadById(intval($dataSet["Typ_Id"]));

        $kontext = null;

        switch ($kontextType->getBezeichnung())
        {
            case "Fundstelle":
            {
                $kontext = new Fundstelle();
                break;
            }
            case "Begehungsfläche":
            {
                $kontext = new Begehungsflaeche();
                break;
            }
            case "Begehung":
            {
                $kontext = new Begehung();
                break;
            }
        }

        $kontext->setId(intval($dataSet["Id"]));
        $kontext->setBezeichnung($dataSet["Bezeichnung"]);
        $kontext->setPath($this->getPath($kontext));
        $kontext->setType($kontextType);

        if ($kontext instanceof Fundstelle)
        {
			if ($dataSet["GeoPointLatitude"] != null &&
				$dataSet["GeoPointLongitude"] != null)
			{
				$geoPoint = new GeoPoint();
				$geoPoint->setLatitude($dataSet["GeoPointLatitude"]);
				$geoPoint->setLongitude($dataSet["GeoPointLongitude"]);
	            $kontext->setGeoPoint($geoPoint);
			}
        }
		else if ($kontext instanceof Begehung)
        {
            $kontext->setDatum($dataSet["Datum"]);
            $kontext->setKommentar($dataSet["Kommentar"]);
        }

        return $kontext;
    }

    public function loadByFund($fund)
    {
        global $logger;
        $logger->debug("Lade Kontext anhand Fund (".$fund->getId().")");

        $kontext = null;
        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByFund($fund));

            if ($mysqli->errno)
            {
                $logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
            }
            else
            {
                if ($datensatz = $ergebnis->fetch_assoc())
                {
					if ($datensatz["Id"] != null)
					{
                    	$kontext = $this->loadById(intval($datensatz["Id"]));
					}
                }
            }
        }

        $mysqli->close();

        return $kontext;
    }

    protected function getSQLStatementToLoadIdsByFund($fund)
    {
        return "SELECT Kontext_Id AS Id
        FROM ".$this->getFundFactory()->getTableName()."
        WHERE Id = ".$fund->getId().";";
    }
    #endregion

    #region save
    /**
    * Overwrites the basis function. If the Kontext type is 'Begehung'
    * then the system calls a transaction.
    * Returns the updated Kontext element.
    *
    * @param iNode $element Kontext to insert.
    */
    protected function insert(iNode $element)
    {
        global $logger;
        $logger->debug("Erzeuge Element");

        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");

            if ($element->getType()->getBezeichnung() == "Fundstelle")
            {
                $mysqli->autocommit(false);
                $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                $passed = true;
                $passed = $mysqli->query($this->getSQLStatementToInsert($element)) && $passed;

                if ($passed)
                {
                	$element->setId($mysqli->insert_id);
                	$passed = $mysqli->query($this->getSQLStatementToInsertFundstelle($element)) && $passed;
                }

                if ($passed)
                {
                    $mysqli->commit();
                }
                else
                {
                    $mysqli->rollback();
                }
            }
			else if ($element->getType()->getBezeichnung() == "Begehung")
			{
                $mysqli->autocommit(false);
                $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                $passed = true;
                $passed = $mysqli->query($this->getSQLStatementToInsert($element)) && $passed;

                if ($passed)
                {
                    $element->setId($mysqli->insert_id);
                    $passed = $mysqli->query($this->getSQLStatementToInsertBegehung($element)) && $passed;
                }

                if ($passed)
                {
                    $mysqli->commit();
                }
                else
                {
                    $mysqli->rollback();
                }
			}
            else
            {
                $ergebnis = $mysqli->multi_query($this->getSQLStatementToInsert($element));

                if ($mysqli->errno)
                {
                    $logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
                }
                else
                {
                    $element->setId($mysqli->insert_id);
                }
            }
        }

        $mysqli->close();

        return $element;
    }

    protected function getSQLStatementToInsert(iNode $kontext)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung, Typ_Id)
        VALUES ('".addslashes($kontext->getBezeichnung())."', ".$kontext->getType()->getId().");";
    }

    protected function getSQLStatementToInsertFundstelle(iNode $kontext)
    {
		$geoPointValue = "NULL";

		if ($kontext->getGeoPoint() != null &&
			$kontext->getGeoPoint()->getLatitude() != null &&
			$kontext->getGeoPoint()->getLongitude() != null)
		{
			$geoPointValue = "ST_GeomFromText('POINT(".$kontext->getGeoPoint()->getLatitude()." ".$kontext->getGeoPoint()->getLongitude().")')";
		}

        return "INSERT INTO Fundstelle (Id, GeoPoint)
        VALUES (".$kontext->getId().", ".$geoPointValue.");";
    }

    protected function getSQLStatementToInsertBegehung(iNode $kontext)
    {
        return "INSERT INTO Begehung (Id, Datum, Kommentar)
        VALUES (".$kontext->getId().", '".addslashes($kontext->getDatum())."', '".addslashes($kontext->getKommentar())."');";
    }

    /**
    * Overwrites the basis function. If the Kontext type is 'Begehung'
    * then the system calls a transaction.
    * Returns the updated Kontext element.
    *
    * @param $element Kontext to update.
    */
    protected function update($element)
    {
        global $logger;
        $logger->debug("Aktualisiere Element (".$element->GetId().")");

        $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

        if (!$mysqli->connect_errno)
        {
            $mysqli->set_charset("utf8");
            $logger->debug("HIER: ".$element->getType()->getBezeichnung());

			if ($element->getType()->getBezeichnung() == "Fundstelle")
            {
                $mysqli->autocommit(false);
                $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                $passed = true;
                $passed = $mysqli->query($this->getSQLStatementToUpdate($element)) && $passed;
                $logger->debug("PASSED: ".$passed);

                if ($passed)
                {
                    $passed = $mysqli->query($this->getSQLStatementToUpdateFundstelle($element)) && $passed;
                    $logger->debug("PASSED: ".$passed);
                }

                if ($passed)
                {
                    $mysqli->commit();
                }
                else
                {
                    $mysqli->rollback();
                }
            }
			else if ($element->getType()->getBezeichnung() == "Begehung")
            {
                $mysqli->autocommit(false);
                $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                $passed = true;
                $passed = $mysqli->query($this->getSQLStatementToUpdate($element)) && $passed;
                $logger->debug("PASSED: ".$passed);

                if ($passed)
                {
                    $passed = $mysqli->query($this->getSQLStatementToUpdateBegehung($element)) && $passed;
                    $logger->debug("PASSED: ".$passed);
                }

                if ($passed)
                {
                    $mysqli->commit();
                }
                else
                {
                    $mysqli->rollback();
                }
            }
            else
            {
                $ergebnis = $mysqli->multi_query($this->getSQLStatementToUpdate($element));

                if ($mysqli->errno)
                {
                    $logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
                }
                else
                {
                    $isSuccessfullyUpdated = true;
                }
            }
        }

        $mysqli->close();

        return $element;
    }

    protected function getSQLStatementToUpdate(iNode $kontext)
    {
        return "UPDATE ".$this->getTableName()."
            SET Bezeichnung = '".addslashes($kontext->getBezeichnung())."',
            Typ_Id = ".$kontext->getType()->getId()."
            WHERE Id = ".$kontext->getId().";";
    }

    protected function getSQLStatementToUpdateFundstelle(iNode $kontext)
    {
		$geoPointValue = "NULL";

		if ($kontext->getGeoPoint() != null &&
			$kontext->getGeoPoint()->getLatitude() != null &&
			$kontext->getGeoPoint()->getLongitude() != null)
		{
			$geoPointValue = "ST_GeomFromText('POINT(".$kontext->getGeoPoint()->getLatitude()." ".$kontext->getGeoPoint()->getLongitude().")')";
		}

        return "UPDATE Fundstelle
            SET GeoPoint = ".$geoPointValue."
            WHERE Id = ".$kontext->getId().";";
    }

    protected function getSQLStatementToUpdateBegehung(iNode $kontext)
    {
        return "UPDATE Begehung
            SET Datum = '".addslashes($kontext->getDatum())."',
            Kommentar = '".addslashes($kontext->getKommentar())."'
            WHERE Id = ".$kontext->getId().";";
    }
        #endregion

        #region delete
        /**
        * Overwrites the basis function. If the Kontext type is 'Begehung'
        * then the system calls a transaction.
        *
        * @param $element Kontext to delete.
        */
        public function delete($element)
        {
            global $logger;
            $logger->debug("Lösche Element (".$element->GetId().")");

            $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

            if (!$mysqli->connect_errno)
            {
                $mysqli->set_charset("utf8");

				if ($element->getType()->getBezeichnung() == "Fundstelle")
                {
                    $mysqli->autocommit(false);
                    $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                    $passed = true;
                    $passed = $mysqli->query($this->getSQLStatementToDeleteFundstelle($element)) && $passed;

                    if ($passed)
                    {
                        $passed = $mysqli->query($this->getSQLStatementToDelete($element)) && $passed;
                    }

                    if ($passed)
                    {
                        $mysqli->commit();
                    }
                    else
                    {
                        $mysqli->rollback();
                    }
                }
				else if ($element->getType()->getBezeichnung() == "Begehung")
                {
                    $mysqli->autocommit(false);
                    $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                    $passed = true;
                    $passed = $mysqli->query($this->getSQLStatementToDeleteBegehung($element)) && $passed;

                    if ($passed)
                    {
                        $passed = $mysqli->query($this->getSQLStatementToDelete($element)) && $passed;
                    }

                    if ($passed)
                    {
                        $mysqli->commit();
                    }
                    else
                    {
                        $mysqli->rollback();
                    }
                }
                else
                {
                    $ergebnis = $mysqli->multi_query($this->getSQLStatementToDelete($element));

                    if ($mysqli->errno)
                    {
                        $logger->error("Datenbankfehler: ".$mysqli->errno." ".$mysqli->error);
                    }
                    else
                    {
                        $isSuccessfullyUpdated = true;
                    }
                }
            }

            $mysqli->close();

            return $element;
        }

        protected function getSQLStatementToDelete($element)
        {
            return "DELETE
            FROM ".$this->getTableName()."
            WHERE Id = ".$element->getId().";";
        }

        protected function getSQLStatementToDeleteFundstelle($element)
        {
            return "DELETE
            FROM Fundstelle
            WHERE Id = ".$element->getId().";";
        }

        protected function getSQLStatementToDeleteBegehung($element)
        {
            return "DELETE
            FROM Begehung
            WHERE Id = ".$element->getId().";";
        }
        #endregion

        #region convert
        public function convertToInstance($object)
        {
            global $logger;
            $logger->debug("Konvertiere Daten zu Kontext");

            if ($object == null)
            {
                $logger->error("Kontext ist nicht gesetzt!");
                return null;
            }

            $kontext = new Kontext();
            $kontextType = null;

            if (isset($object["Type"]))
            {
                $kontextType = $this->getKontextTypeFactory()->convertToInstance($object["Type"]);
            }

            if ($kontextType == null ||
            	 $kontextType->getId() == null ||
            	 $kontextType->getId() == "" ||
            	 $kontextType->getBezeichnung() == null ||
            	 $kontextType->getBezeichnung() == "")
            {
                $logger->error("Kontexttyp ist nicht gesetzt!");
            }
            else
            {
                switch ($kontextType->getBezeichnung())
                {
                    case "Fundstelle" :
                    {
                        $kontext = new Fundstelle();
                        break;
                    }
                    case "Begehungsfläche" :
                    {
                        $kontext = new Begehungsflaeche();
                        break;
                    }
                    case "Begehung" :
                    {
                        $kontext = new Begehung();
                        break;
                    }
                    default :
                    {
                        $logger->error("Unbekannter Kontexttyp! (".$kontextType->getBezeichnung().")");
                        break;
                    }
                }
            }

            if (isset($object["Id"]))
            {
                $kontext->setId(intval($object["Id"]));
            }
            else {
                $logger->debug("Id ist nicht gesetzt!");
            }

            if (isset($object["Bezeichnung"]))
            {
                $kontext->setBezeichnung($object["Bezeichnung"]);
            }
            else
            {
                $logger->debug("Bezeichnung ist nicht gesetzt!");
            }

            $kontext->setType($kontextType);

            if (isset($object["Parent"]))
            {
                $kontext->setParent($this->convertToInstance($object["Parent"]));
            }
            else
            {
                $logger->debug("Parent ist nicht gesetzt!");
            }

            if (isset($object["Children"]))
            {
                for ($i = 0; $i < count($object["Children"]); $i++)
                {
                    $kontext->addChild($this->convertToInstance($object["Children"][$i]));
                }
            }
            else {
                $logger->debug("Children ist nicht gesetzt!");
            }

            if (isset($object["LfdNummern"]))
            {
                for ($i = 0; $i < count($object["LfdNummern"]); $i++)
                {
                    $kontext->addLfdNummer($this->getLfdNummerFactory()->convertToInstance($object["LfdNummern"][$i]));
                }
            }
            else {
                $logger->debug("LfdNummern ist nicht gesetzt!");
            }

            if ($kontext instanceof iFundContainer &&
            isset($object["Funde"]))
            {
                for ($i = 0; $i < count($object["Funde"]); $i++)
                {
                    $kontext->addFund($this->getFundFactory()->convertToInstance($object["Funde"][$i]));
                }
            }

            if ($kontext instanceof iOrtContainer &&
            isset($object["Orte"]))
            {
                for ($i = 0; $i < count($object["Orte"]); $i++)
                {
                    $kontext->addOrt($this->getOrtFactory()->convertToInstance($object["Orte"][$i]));
                }
            }

            if ($kontext instanceof Fundstelle &&
            	isset($object["GeoPoint"]) &&
					isset($object["GeoPoint"]["Latitude"]) &&
					isset($object["GeoPoint"]["Longitude"]))
            {
					$geoPoint = new GeoPoint();
					$geoPoint->setLatitude($object["GeoPoint"]["Latitude"]);
					$geoPoint->setLongitude($object["GeoPoint"]["Longitude"]);
                $kontext->setGeoPoint($geoPoint);
            }
            
            $logger->debug(json_encode($kontext));

            if ($kontext instanceof Begehung)
			{
				if (isset($object["Datum"]))
				{
	                $kontext->setDatum($object["Datum"]);
	            }

				if (isset($object["Kommentar"]))
	            {
	                $kontext->setKommentar($object["Kommentar"]);
	            }
			}
			
            return $kontext;
        }
        #endregion

        #region hierarchy
        #region parent
        public function loadParent(iTreeNode $kontext)
        {
            return $this->getTreeFactory()->loadParent($kontext);
        }

        public function linkParent(iTreeNode $kontext, iTreeNode $parent)
        {
            return $this->getTreeFactory()->linkParent($kontext, $parent);
        }

        public function unlinkParent(iTreeNode $kontext)
        {
            return $this->getTreeFactory()->unlinkParent($kontext);
        }

        public function updateParent(iTreeNode $kontext, iTreeNode $parent = null)
        {
            return $this->getTreeFactory()->updateParent($kontext, $parent);
        }
        #endregion

        #region children
        public function loadChildren(iTreeNode $kontext)
        {
            return $this->getTreeFactory()->loadChildren($kontext);
        }

        public function linkChild(iTreeNode $kontext, iTreeNode $child)
        {
            return $this->getTreeFactory()->linkChild($kontext, $child);
        }

        public function unlinkChild(iTreeNode $kontext, iTreeNode $child)
        {
            return $this->getTreeFactory()->unlinkChild($kontext, $child);
        }

        public function linkChildren(iTreeNode $kontext, array $children)
        {
            return $this->getTreeFactory()->linkChildren($kontext, $children);
        }

        public function unlinkChildren(iTreeNode $kontext, array $children)
        {
            return $this->getTreeFactory()->unlinkChildren($kontext, $children);
        }

        public function unlinkAllChildren(iTreeNode $kontext)
        {
            return $this->getTreeFactory()->unlinkAllChildren($kontext);
        }

        public function synchroniseChildren(iTreeNode $kontext, array $children)
        {
            return $this->getTreeFactory()->synchroniseChildren($kontext, $children);
        }
        #endregion

        public function getPath(iTreeNode $kontext)
        {
            return $this->getTreeFactory()->getPath($kontext);
        }

        public function loadRoots()
        {
            return $this->getTreeFactory()->loadRoots();
        }

        public static function isNodeInCircleCondition(iTreeNode $node)
        {
            return TreeFactory::isNodeInCircleCondition($node);
        }
        #endregion

        #region Fund
        public function linkFund(iFundContainer $kontext, iNode $fund)
        {
            $kontext->addFund($this->getFundFactory()->linkKontext($fund, $kontext));

            return $kontext;
        }

        public function linkFunde(iFundContainer $kontext, array $funde)
        {
            for ($i = 0; $i < count($funde); $i++)
            {
                $kontext = $this->linkFund($kontext, $funde[$i]);
            }

            return $kontext;
        }

        public function unlinkFund(iFundContainer $kontext, iNode $fund)
        {
            $kontext->removeFund($this->getFundFactory()->unlinkKontext($fund, $kontext));

            return $kontext;
        }

        public function unlinkFunde(iFundContainer $kontext, array $funde)
        {
            for ($i = 0; $i < count($funde); $i++)
            {
                $this->unlinkFund($kontext, $funde[$i]);
            }

            return $kontext;
        }

        public function loadFunde(iFundContainer $element)
        {
            $funde = $this->getFundFactory()->loadByKontext($element);
            $element->setFunde($funde);

            return $element;
        }

        /**
        * Synchronises the Kontext's Funde with the given
        * Funden.
        * Returns the updated Kontext.
        *
        * @param iFundContainer $kontext Kontext to synchronise.
        * @param array $funde Funde to be used as new Funde.
        */
        public function synchroniseFunde(iFundContainer $kontext, array $funde)
        {
            $kontext = $this->linkNewFunde($kontext, $funde);
            $kontext = $this->unlinkObsoleteFunde($kontext, $funde);

            return $kontext;
        }

        /**
        * Links Funde that are not in the Kontext's
        * Fund list.
        * Returns the updated Kontext.
        *
        * @param iFundContainer $kontext Kontext to be updated with new Funden.
        * @param iNode $funde Funde to be used as new Funde.
        */
        protected function linkNewFunde(iFundContainer $kontext, array $funde)
        {
            for ($i = 0; $i < count($funde); $i++)
            {
                if (!$kontext->containsFund($funde[$i]))
                {
                    $kontext = $this->linkFund($kontext, $funde[$i]);
                }
            }

            return $kontext;
        }

        /**
        * Unlinks Funde that are in the Kontext's
        * Fund list, but not in the given Funden.
        * Returns the updated Kontext.
        *
        * @param iFundContainer $kontext Kontext to be cleaned up from obsolete Funden.
        * @param array $funde Funde to be used as new Funde.
        */
        protected function unlinkObsoleteFunde(iFundContainer $kontext, array $funde)
        {
            for ($i = 0; $i < count($kontext->getFunde());)
            {
                $contains = false;

                for ($j = 0; $j < count($funde); $j++)
                {
                    if ($funde[$j]->getId() == $kontext->getFunde()[$i]->getId())
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
                    $kontext = $this->unlinkFund($kontext, $kontext->getFunde()[$i]);
                }
            }

            return $kontext;
        }

        #endregion

        #region Ort
        public function loadByOrt($ort)
        {
            $kontexte = array();
            $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

            if (!$mysqli->connect_errno)
            {
                $mysqli->set_charset("utf8");
                $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByOrt($ort));

                if (!$mysqli->errno)
                {
                    while ($datensatz = $ergebnis->fetch_assoc())
                    {
						if ($datensatz["Id"] != null)
						{
                        	array_push($kontexte, $this->loadById(intval($datensatz["Id"])));
						}
                    }
                }
            }

            $mysqli->close();

            return $kontexte;
        }

        protected function getSQLStatementToLoadIdsByOrt($ort)
        {
            return "SELECT ".$this->getTableName()."_Id AS Id
            FROM ".$this->getTableName()."_".$this->getOrtFactory()->getTableName()."
            WHERE ".$this->getOrtFactory()->getTableName()."_Id = ".$ort->getId().";";
        }

        public function loadOrte(iOrtContainer $element)
        {
            $orte = $this->getOrtFactory()->loadByKontext($element);
            $element->setOrte($orte);

            return $element;
        }

        /**
        * Synchronises the Kontext's Orte with the given
        * Orten.
        * Returns the updated Kontext.
        *
        * @param iOrtContainer $element Kontext to synchronise.
        * @param array $orte Orte to be used as new Orte.
        */
        public function synchroniseOrte(iOrtContainer $element, array $orte)
        {
            $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

            if (!$mysqli->connect_errno)
            {
                $mysqli->set_charset("utf8");
                $mysqli->autocommit(false);
                $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                $passed = true;
                $passed = $mysqli->query($this->getSQLStatementToUnlinkOrte($element)) && $passed;

                if (count($orte) > 0)
                {
                    $passed = $mysqli->query($this->getSQLStatementToLinkOrte($element, $orte)) && $passed;
                }

                if ($passed)
                {
                    $mysqli->commit();
                    $element->setOrte($orte);
                }
                else
                {
                    $mysqli->rollback();
                }
            }

            $mysqli->close();

            return $element;
        }

        public function getSQLStatementToUnlinkOrte($element)
        {
            $statement = "DELETE FROM ".$this->getTableName()."_".$this->getOrtFactory()->getTableName()."
            WHERE ".$this->getTableName()."_Id = ".$element->getId().";";

            return $statement;
        }

        public function getSQLStatementToLinkOrte($element, $orte)
        {
            if (count($orte) == 0)
            {
                return "";
            }

            $statement = "INSERT INTO ".$this->getTableName()."_".$this->getOrtFactory()->getTableName()."(".$this->getTableName()."_Id,".$this->getOrtFactory()->getTableName()."_Id)
            VALUES ";

            for ($i = 0; $i < count($orte); $i++)
            {
                $statement .= "(".$element->getId().",".$orte[$i]->getId().")";

                if ($i + 1 < count($orte))
                {
                    $statement .= ",";
                }
            }

            $statement .= ";";

            return $statement;
        }
        #endregion

        #region LfdNummer
        public function loadByLfdNummer($lfdNummer)
        {
            $kontexte = array();
            $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

            if (!$mysqli->connect_errno)
            {
                $mysqli->set_charset("utf8");
                $ergebnis = $mysqli->query($this->getSQLStatementToLoadIdsByLfdNummer($lfdNummer));

                if (!$mysqli->errno)
                {
                    while ($datensatz = $ergebnis->fetch_assoc())
                    {
						if ($datensatz["Id"] != null)
						{
                        	array_push($kontexte, $this->loadById(intval($datensatz["Id"])));
						}
                    }
                }
            }

            $mysqli->close();

            return $kontexte;
        }

        protected function getSQLStatementToLoadIdsByLfdNummer($lfdNummer)
        {
            return "SELECT ".$this->getTableName()."_Id AS Id
            FROM ".$this->getTableName()."_".$this->getLfdNummerFactory()->getTableName()."
            WHERE ".$this->getLfdNummerFactory()->getTableName()."_Id = ".$lfdNummer->getId().";";
        }

        public function loadLfdNummern($element)
        {
            $element->setLfdNummern($this->getLfdNummerFactory()->loadByKontext($element));

            return $element;
        }

        /**
        * Synchronises the Kontext's LfdNummern with the given
        * LfdNummern.
        * Returns the updated Kontext.
        *
        * @param Kontext $element Kontext to synchronise.
        * @param array $lfdNummern LfdNummern to be used as new LfdNummern.
        */
        public function synchroniseLfdNummern(Kontext $element, array $lfdNummern)
        {
            $mysqli = new mysqli(MYSQL_HOST, MYSQL_BENUTZER, MYSQL_KENNWORT, MYSQL_DATENBANK);

            if (!$mysqli->connect_errno)
            {
                $mysqli->set_charset("utf8");
                $mysqli->autocommit(false);
                $mysqli->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);

                $passed = true;
                $passed = $mysqli->query($this->getSQLStatementToUnlinkLfdNummern($element)) && $passed;

                if (count($lfdNummern) > 0)
                {
                    $passed = $mysqli->query($this->getSQLStatementToLinkLfdNummern($element, $lfdNummern)) && $passed;
                }

                if ($passed)
                {
                    $mysqli->commit();
                    $element->setLfdNummern($lfdNummern);
                }
                else
                {
                    $mysqli->rollback();
                }
            }

            $mysqli->close();

            return $element;
        }

        public function getSQLStatementToUnlinkLfdNummern($element)
        {
            $statement = "DELETE FROM ".$this->getTableName()."_".$this->getLfdNummerFactory()->getTableName()."
            WHERE ".$this->getTableName()."_Id = ".$element->getId().";";

            return $statement;
        }

        public function getSQLStatementToLinkLfdNummern($element, $lfdNummern)
        {
            if (count($lfdNummern) == 0)
            {
                return "";
            }

            $statement = "INSERT INTO ".$this->getTableName()."_".$this->getLfdNummerFactory()->getTableName()."(".$this->getTableName()."_Id,".$this->getLfdNummerFactory()->getTableName()."_Id)
            VALUES ";

            for ($i = 0; $i < count($lfdNummern); $i++)
            {
                $statement .= "(".$element->getId().",".$lfdNummern[$i]->getId().")";

                if ($i + 1 < count($lfdNummern))
                {
                    $statement .= ",";
                }
            }

            $statement .= ";";

            return $statement;
        }
        #endregion
        #endregion
    }
