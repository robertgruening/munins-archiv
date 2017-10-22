<?php
include_once(__DIR__."/Factory.php");
include_once(__DIR__."/../Model/AblageTyp.php");

class AblageTypFactory extends Factory
{
    protected function getSQLStatementToLoadById($id)
    {
        return "SELECT Id, Bezeichnung
                FROM AblageTyp
                WHERE Id = ".$id;
    }
    
    protected function fill($dataSet)
    {
        $ablageTyp = new AblageTyp();
        $ablageTyp->setId(intval($dataSet["Id"]));
        $ablageTyp->setBezeichnung($dataSet["Bezeichnung"]);
        
        return $ablageTyp;
    }
}
