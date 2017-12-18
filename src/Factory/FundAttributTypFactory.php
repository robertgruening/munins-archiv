<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/ListFactory.php");
include_once(__DIR__."/IListFactory.php");
include_once(__DIR__."/../Model/FundAttributTyp.php");

class FundAttributTypFactory extends Factory implements iListFactory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
                FROM ".$this->getTableName()."
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $fundAttributTyp = new FundAttributTyp();
        $fundAttributTyp->setId(intval($dataSet["Id"]));
        $fundAttributTyp->setBezeichnung($dataSet["Bezeichnung"]);
        
        return $fundAttributTyp;
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
        return "FundAttributTyp";
    }
}
