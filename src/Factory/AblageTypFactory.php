<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/AblageTyp.php");

class AblageTypFactory extends Factory implements iListFactory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
                FROM ".$this->getTableName()."
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $ablageTyp = new AblageTyp();
        $ablageTyp->setId(intval($dataSet["Id"]));
        $ablageTyp->setBezeichnung($dataSet["Bezeichnung"]);
        
        return $ablageTyp;
    }

    public function loadAll()
    {
        $listFactory = new ListFactory($this);

        return $listFactory->loadAll();
    }
    
    public function getTableName()
    {
        return "AblageTyp";
    }
    
    protected function getSQLStatementToCreate($element)
    {
        return "INSERT INTO ".$this->getTableName()." (Bezeichnung)
                VALUES ('".$element->getBezeichnung()."');";
    }
}
