<?php
require_once(__DIR__."/../../UserStories/UserStory.php");
require_once(__DIR__."/../../Factory/FundAttributFactory.php");
require_once(__DIR__."/../../Factory/AblageFactory.php");
require_once(__DIR__."/../../Factory/KontextFactory.php");

class ConvertFund extends UserStory
{
    #region variables
    private $_fund = null;
    private $_multidimensionalArray = null;
    private $_fundAttributFactory = null;
    private $_ablageFactory = null;
    private $_kontextFactory = null;
    #endregion

    #region properties
    #region input properties
    /**
     * Returns the given multidimensional array, which is to convert.
     */
    private function getMultidimensionalArray()
    {
        return $this->_multidimensionalArray;
    }

    /**
     * Sets the multidimensional array, which is to be converted.
     * @param Array $multidimensionalArray multidimensional array, which is to convert.
     */
    public function setMultidimensionalArray($multidimensionalArray)
    {
        $this->_multidimensionalArray = $multidimensionalArray;
    }
    #endregion

    #region output properties
    /**
     * Returns the converted Fund.
     */
    public function getFund()
    {
        return $this->_fund;
    }

    /**
     * Sets the converted Fund.
     * @param Fund $fund Fund, which was converted.
     */
    private function setFund($fund)
    {
        $this->_fund = $fund;
    }
    #endregion

    protected function getFundAttributFactory()
    {
        return $this->_fundAttributFactory;
    }

    protected function getAblageFactory()
    {
        if ($this->_ablageFactory == null)
        {
            $this->_ablageFactory = new AblageFactory();
        }

        return $this->_ablageFactory;
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
        $this->_fundAttributFactory = new FundAttributFactory();
    }
    #endregion

    /**
     * Is always true.
     */
    protected function areParametersValid()
    {
        return true;
    }

    protected function execute()
    {
        $multidimensionalArray = $this->getMultidimensionalArray();

        if ($multidimensionalArray == null)
        {
            $this->addMessage("Es wurden keine Daten übergeben!");
            $this->setFund(null);
            return false;
        }

        $fund = new Fund();

        #region Id
        if (isset($multidimensionalArray["Id"]) &&
            !empty($multidimensionalArray["Id"]))
        {
            if (!is_numeric($multidimensionalArray["Id"]))
            {
                $this->addMessage("Id muss eine Zahl sein!");
            }
            else if(intval($multidimensionalArray["Id"]) < 0)
            {
                $this->addMessage("Id muss mindestens 0 sein!");
            }
            else
            {
                $fund->setId(intval($multidimensionalArray["Id"]));
            }
        }
        #endregion

        #region Anzahl
        if (!isset($multidimensionalArray["Anzahl"]) ||
            empty($multidimensionalArray["Anzahl"]))
        {
            $this->addMessage("Anzahl ist nicht gesetzt!");
        }
        else if (!is_numeric(str_replace(">", "", $multidimensionalArray["Anzahl"])))
        {
            $this->addMessage("Anzahl muss eine Zahl sein!");
        }
        else if (intval(str_replace(">", "", $multidimensionalArray["Anzahl"])) <= 0)
        {
            $this->addMessage("Anzahl muss mindestens 1 sein!");
        }
        else
        {
            $fund->setAnzahl($multidimensionalArray["Anzahl"]);
        }
        #endregion

        #region Bezeichnung
        if (isset($multidimensionalArray["Bezeichnung"]))
        {
            $fund->setBezeichnung($multidimensionalArray["Bezeichnung"]);
        }
        #endregion

        #region Fundattribute
        if (isset($multidimensionalArray["FundAttribute"]))
        {
            for ($i = 0; $i < count($multidimensionalArray["FundAttribute"]); $i++)
            {
                $fund->addFundAttribut($this->getFundAttributFactory()->convertToInstance($multidimensionalArray["FundAttribute"][$i]));
            }
        }
        #endregion

        #region Dimension1
        if (isset($multidimensionalArray["Dimension1"]) &&
            !empty($multidimensionalArray["Dimension1"]))
        {
            if (!is_numeric($multidimensionalArray["Dimension1"]))
            {
                $this->addMessage("Dimension1 muss eine Zahl sein!");
            }
            else if (intval($multidimensionalArray["Dimension1"]) <= 0)
            {
                $this->addMessage("Dimension1 muss mindestens 1 sein!");
            }
            else
            {
                $fund->setDimension1(intval($multidimensionalArray["Anzahl"]));
            }
        }
        #endregion

        #region Dimension2
        if (isset($multidimensionalArray["Dimension2"]) &&
            !empty($multidimensionalArray["Dimension2"]))
        {
            if (!is_numeric($multidimensionalArray["Dimension2"]))
            {
                $this->addMessage("Dimension2 muss eine Zahl sein!");
            }
            else if (intval($multidimensionalArray["Dimension2"]) <= 0)
            {
                $this->addMessage("Dimension2 muss mindestens 1 sein!");
            }
            else
            {
                $fund->setDimension2(intval($multidimensionalArray["Anzahl"]));
            }
        }
        #endregion

        #region Dimension3
        if (isset($multidimensionalArray["Dimension3"]) &&
            !empty($multidimensionalArray["Dimension3"]))
        {
            if (!is_numeric($multidimensionalArray["Dimension3"]))
            {
                $this->addMessage("Dimension3 muss eine Zahl sein!");
            }
            else if (intval($multidimensionalArray["Dimension3"]) <= 0)
            {
                $this->addMessage("Dimension3 muss mindestens 1 sein!");
            }
            else
            {
                $fund->setDimension3(intval($multidimensionalArray["Anzahl"]));
            }
        }
        #endregion

        #region Masse
        if (isset($multidimensionalArray["Masse"]) &&
            !empty($multidimensionalArray["Masse"]))
        {
            if (!is_numeric($multidimensionalArray["Masse"]))
            {
                $this->addMessage("Masse muss eine Zahl sein!");
            }
            else if (intval($multidimensionalArray["Masse"]) <= 0)
            {
                $this->addMessage("Masse muss mindestens 1 sein!");
            }
            else
            {
                $fund->setMasse(intval($multidimensionalArray["Masse"]));
            }
        }
        #endregion

        #region Ablage
        if (isset($multidimensionalArray["Ablage"]))
        {
            $fund->setAblage($this->getAblageFactory()->convertToInstance($multidimensionalArray["Ablage"]));
        }
        #endregion

        #region Kontext
        if (isset($multidimensionalArray["Kontext"]))
        {
            $fund->setKontext($this->getKontextFactory()->convertToInstance($multidimensionalArray["Kontext"]));
        }
        #endregion

        #region FileName
        if (isset($multidimensionalArray["FileName"]))
        {
            $fund->setFileName($multidimensionalArray["FileName"]);
        }
        #endregion

        #region FolderName
        if (isset($multidimensionalArray["FolderName"]))
        {
            $fund->setFolderName($multidimensionalArray["FolderName"]);
        }
        #endregion

        #region Rating
        if (isset($multidimensionalArray["Rating"]) &&
			!empty($multidimensionalArray["Rating"]))
		{
			if (!is_numeric($multidimensionalArray["Rating"]))
			{
				$this->addMessage("Bewertung muss eine Zahl sein!");
			}
			else if (intval($multidimensionalArray["Rating"]) < 0)
			{
				$this->addMessage("Bewertung muss mindestens Null (0) sein!");
			}
			else
			{
				$fund->setRating(intval($multidimensionalArray["Rating"]));
			}
		}
        #endregion

        $this->setFund($fund);

        return (count($this->getMessages()) == 0);
    }
}
