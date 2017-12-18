<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/OrtTyp.php");

class OrtTypFactory extends Factory implements iListFactory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
                FROM ".$this->getTableName()."
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $ortTyp = new OrtTyp();
        $ortTyp->setId(intval($dataSet["Id"]));
        $ortTyp->setBezeichnung($dataSet["Bezeichnung"]);
        
        return $ortTyp;
    }

    public function loadAll()
    {
        $listFactory = new ListFactory($this);

        return $listFactory->loadAll();
    }
    
    protected function getSQLStatementToCreate($element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung)
                VALUES ('".$element->getBezeichnung()."');";
    }
    
    public function getTableName()
    {
        return "OrtTyp";
    }
}
