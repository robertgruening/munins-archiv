-- phpMyAdmin SQL Dump
-- version 4.4.15.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 01, 2016 at 06:45 PM
-- Server version: 10.0.22-MariaDB
-- PHP Version: 5.6.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Munins_Archiv`
--

-- --------------------------------------------------------

--
-- Table structure for table `Ablage`
--

CREATE TABLE IF NOT EXISTS `Ablage` (
  `Id` int(11) NOT NULL,
  `Typ_Id` int(11) DEFAULT NULL,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  `Parent_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `AblageTyp`
--

CREATE TABLE IF NOT EXISTS `AblageTyp` (
  `Id` int(11) NOT NULL,
  `Bezeichnung` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Ablage_Kontext`
--

CREATE TABLE IF NOT EXISTS `Ablage_Kontext` (
  `Ablage_Id` int(11) NOT NULL,
  `Kontext_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Begehung`
--

CREATE TABLE IF NOT EXISTS `Begehung` (
  `Id` int(11) NOT NULL,
  `LfDErfassungsJahr` int(11) DEFAULT NULL,
  `LfDErfassungsNr` int(11) DEFAULT NULL,
  `Datum` varchar(10) DEFAULT NULL,
  `Kommentar` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Fund`
--

CREATE TABLE IF NOT EXISTS `Fund` (
  `Id` int(11) NOT NULL,
  `Anzahl` int(11) NOT NULL DEFAULT '1',
  `Kontext_Id` int(11) DEFAULT NULL,
  `Ablage_Id` int(11) DEFAULT NULL,
  `Bezeichnung` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `FundAttribut`
--

CREATE TABLE IF NOT EXISTS `FundAttribut` (
  `Id` int(11) NOT NULL,
  `Typ_Id` int(11) NOT NULL,
  `Bezeichnung` varchar(30) NOT NULL,
  `Parent_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `FundAttributTyp`
--

CREATE TABLE IF NOT EXISTS `FundAttributTyp` (
  `Id` int(11) NOT NULL,
  `Bezeichnung` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Fundstelle`
--

CREATE TABLE IF NOT EXISTS `Fundstelle` (
  `Id` int(11) NOT NULL,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  `AAF_Nr` varchar(30) DEFAULT NULL,
  `AlteAAF_Nr` varchar(10) DEFAULT NULL,
  `Zusatz` varchar(15) DEFAULT NULL,
  `BLfD_Nr` varchar(10) DEFAULT NULL,
  `TK25` int(11) DEFAULT NULL,
  `TK25Rechts` varchar(10) DEFAULT NULL,
  `TK25Hoch` varchar(10) DEFAULT NULL,
  `TK5_1` int(11) DEFAULT NULL,
  `TK5_2` int(11) DEFAULT NULL,
  `Kommentar` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Fundstelle_Flurstuecke`
--

CREATE TABLE IF NOT EXISTS `Fundstelle_Flurstuecke` (
  `Fundstelle_Id` int(11) NOT NULL,
  `Flurstueck` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Fund_FundAttribut`
--

CREATE TABLE IF NOT EXISTS `Fund_FundAttribut` (
  `Fund_Id` int(11) NOT NULL,
  `FundAttribut_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Karton`
--

CREATE TABLE IF NOT EXISTS `Karton` (
  `Id` int(11) NOT NULL,
  `GUID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Kontext`
--

CREATE TABLE IF NOT EXISTS `Kontext` (
  `Id` int(11) NOT NULL,
  `Typ_Id` int(11) DEFAULT NULL,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  `Parent_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `KontextTyp`
--

CREATE TABLE IF NOT EXISTS `KontextTyp` (
  `Id` int(11) NOT NULL,
  `Bezeichnung` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Kontext_LfD`
--

CREATE TABLE IF NOT EXISTS `Kontext_LfD` (
  `LfD_Id` int(11) NOT NULL,
  `Kontext_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Kontext_Ort`
--

CREATE TABLE IF NOT EXISTS `Kontext_Ort` (
  `Kontext_Id` int(11) NOT NULL,
  `Ort_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `LfD`
--

CREATE TABLE IF NOT EXISTS `LfD` (
  `Id` int(11) NOT NULL,
  `TK25Nr` int(11) NOT NULL,
  `Nr` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Ort`
--

CREATE TABLE IF NOT EXISTS `Ort` (
  `Id` int(11) NOT NULL,
  `Bezeichnung` varchar(25) NOT NULL,
  `Typ_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `OrtTyp`
--

CREATE TABLE IF NOT EXISTS `OrtTyp` (
  `Id` int(11) NOT NULL,
  `Bezeichnung` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Ort_Ort`
--

CREATE TABLE IF NOT EXISTS `Ort_Ort` (
  `Ort_Id` int(11) NOT NULL,
  `Parent_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Ablage`
--
ALTER TABLE `Ablage`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `AblageTyp_Id` (`Typ_Id`),
  ADD KEY `Parent_Id` (`Parent_Id`),
  ADD KEY `IndexAblage` (`Bezeichnung`);

--
-- Indexes for table `AblageTyp`
--
ALTER TABLE `AblageTyp`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IndexAblageTyp` (`Bezeichnung`);

--
-- Indexes for table `Ablage_Kontext`
--
ALTER TABLE `Ablage_Kontext`
  ADD PRIMARY KEY (`Ablage_Id`,`Kontext_Id`),
  ADD KEY `Kontext_Id` (`Kontext_Id`);

--
-- Indexes for table `Begehung`
--
ALTER TABLE `Begehung`
  ADD PRIMARY KEY (`Id`),
  ADD FULLTEXT KEY `Kommentar` (`Kommentar`);

--
-- Indexes for table `Fund`
--
ALTER TABLE `Fund`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Kontext_Id` (`Kontext_Id`),
  ADD KEY `Ablage_Id` (`Ablage_Id`),
  ADD FULLTEXT KEY `Beschriftung` (`Bezeichnung`);

--
-- Indexes for table `FundAttribut`
--
ALTER TABLE `FundAttribut`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Parent_Id` (`Parent_Id`),
  ADD KEY `FundAttributTyp_Id` (`Typ_Id`);

--
-- Indexes for table `FundAttributTyp`
--
ALTER TABLE `FundAttributTyp`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `FundAttributTyp_Bezeichnung` (`Bezeichnung`);

--
-- Indexes for table `Fundstelle`
--
ALTER TABLE `Fundstelle`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IndexFundstelle` (`Bezeichnung`),
  ADD KEY `IndexFundstelleKommentar` (`Kommentar`);

--
-- Indexes for table `Fundstelle_Flurstuecke`
--
ALTER TABLE `Fundstelle_Flurstuecke`
  ADD PRIMARY KEY (`Fundstelle_Id`,`Flurstueck`);

--
-- Indexes for table `Fund_FundAttribut`
--
ALTER TABLE `Fund_FundAttribut`
  ADD PRIMARY KEY (`Fund_Id`,`FundAttribut_Id`),
  ADD KEY `Material_Id` (`FundAttribut_Id`);

--
-- Indexes for table `Karton`
--
ALTER TABLE `Karton`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Kontext`
--
ALTER TABLE `Kontext`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `KontextTyp_Id` (`Typ_Id`),
  ADD KEY `Parent_Id` (`Parent_Id`),
  ADD KEY `IndexKontext` (`Bezeichnung`) USING BTREE;

--
-- Indexes for table `KontextTyp`
--
ALTER TABLE `KontextTyp`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IndexKontextTyp` (`Bezeichnung`);

--
-- Indexes for table `Kontext_LfD`
--
ALTER TABLE `Kontext_LfD`
  ADD PRIMARY KEY (`LfD_Id`,`Kontext_Id`),
  ADD KEY `Kontext_Id` (`Kontext_Id`);

--
-- Indexes for table `Kontext_Ort`
--
ALTER TABLE `Kontext_Ort`
  ADD PRIMARY KEY (`Kontext_Id`,`Ort_Id`),
  ADD KEY `Kontext_Id` (`Kontext_Id`),
  ADD KEY `Ort_Id` (`Ort_Id`);

--
-- Indexes for table `LfD`
--
ALTER TABLE `LfD`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `TK25Nummer` (`TK25Nr`,`Nr`) USING BTREE;

--
-- Indexes for table `Ort`
--
ALTER TABLE `Ort`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Typ_Id` (`Typ_Id`);

--
-- Indexes for table `OrtTyp`
--
ALTER TABLE `OrtTyp`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Ort_Ort`
--
ALTER TABLE `Ort_Ort`
  ADD PRIMARY KEY (`Ort_Id`,`ElternOrt_Id`),
  ADD KEY `Ort_Id` (`Ort_Id`),
  ADD KEY `Ort_Id_2` (`Ort_Id`),
  ADD KEY `ElternOrt_Id` (`ElternOrt_Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Ablage`
--
ALTER TABLE `Ablage`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `AblageTyp`
--
ALTER TABLE `AblageTyp`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Fund`
--
ALTER TABLE `Fund`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `FundAttribut`
--
ALTER TABLE `FundAttribut`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `FundAttributTyp`
--
ALTER TABLE `FundAttributTyp`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Kontext`
--
ALTER TABLE `Kontext`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `KontextTyp`
--
ALTER TABLE `KontextTyp`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `LfD`
--
ALTER TABLE `LfD`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Ort`
--
ALTER TABLE `Ort`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `OrtTyp`
--
ALTER TABLE `OrtTyp`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Ablage`
--
ALTER TABLE `Ablage`
  ADD CONSTRAINT `Ablage_ibfk_1` FOREIGN KEY (`Typ_Id`) REFERENCES `AblageTyp` (`Id`),
  ADD CONSTRAINT `Ablage_ibfk_2` FOREIGN KEY (`Parent_Id`) REFERENCES `Ablage` (`Id`);

--
-- Constraints for table `Ablage_Kontext`
--
ALTER TABLE `Ablage_Kontext`
  ADD CONSTRAINT `Ablage_Kontext_ibfk_1` FOREIGN KEY (`Ablage_Id`) REFERENCES `Ablage` (`Id`),
  ADD CONSTRAINT `Ablage_Kontext_ibfk_2` FOREIGN KEY (`Kontext_Id`) REFERENCES `Kontext` (`Id`);

--
-- Constraints for table `Begehung`
--
ALTER TABLE `Begehung`
  ADD CONSTRAINT `Begehung_ibfk_1` FOREIGN KEY (`Id`) REFERENCES `Kontext` (`Id`);

--
-- Constraints for table `Fund`
--
ALTER TABLE `Fund`
  ADD CONSTRAINT `Fund_ibfk_3` FOREIGN KEY (`Kontext_Id`) REFERENCES `Kontext` (`Id`),
  ADD CONSTRAINT `Fund_ibfk_4` FOREIGN KEY (`Ablage_Id`) REFERENCES `Ablage` (`Id`);

--
-- Constraints for table `FundAttribut`
--
ALTER TABLE `FundAttribut`
  ADD CONSTRAINT `FundAttribut_ibfk_1` FOREIGN KEY (`Parent_Id`) REFERENCES `FundAttribut` (`Id`),
  ADD CONSTRAINT `FundAttribut_ibfk_2` FOREIGN KEY (`Typ_Id`) REFERENCES `FundAttributTyp` (`Id`);

--
-- Constraints for table `Fundstelle`
--
ALTER TABLE `Fundstelle`
  ADD CONSTRAINT `Fundstelle_ibfk_1` FOREIGN KEY (`Id`) REFERENCES `Kontext` (`Id`);

--
-- Constraints for table `Fundstelle_Flurstuecke`
--
ALTER TABLE `Fundstelle_Flurstuecke`
  ADD CONSTRAINT `Fundstelle_Flurstuecke_ibfk_1` FOREIGN KEY (`Fundstelle_Id`) REFERENCES `Fundstelle` (`Id`);

--
-- Constraints for table `Fund_FundAttribut`
--
ALTER TABLE `Fund_FundAttribut`
  ADD CONSTRAINT `Fund_FundAttribut_ibfk_1` FOREIGN KEY (`Fund_Id`) REFERENCES `Fund` (`Id`),
  ADD CONSTRAINT `Fund_FundAttribut_ibfk_2` FOREIGN KEY (`FundAttribut_Id`) REFERENCES `FundAttribut` (`Id`);

--
-- Constraints for table `Karton`
--
ALTER TABLE `Karton`
  ADD CONSTRAINT `Karton_ibfk_1` FOREIGN KEY (`Id`) REFERENCES `Ablage` (`Id`);

--
-- Constraints for table `Kontext`
--
ALTER TABLE `Kontext`
  ADD CONSTRAINT `Kontext_ibfk_1` FOREIGN KEY (`Typ_Id`) REFERENCES `KontextTyp` (`Id`),
  ADD CONSTRAINT `Kontext_ibfk_2` FOREIGN KEY (`Parent_Id`) REFERENCES `Kontext` (`Id`);

--
-- Constraints for table `Kontext_LfD`
--
ALTER TABLE `Kontext_LfD`
  ADD CONSTRAINT `Kontext_LfD_ibfk_2` FOREIGN KEY (`Kontext_Id`) REFERENCES `Kontext` (`Id`),
  ADD CONSTRAINT `Kontext_LfD_ibfk_3` FOREIGN KEY (`LfD_Id`) REFERENCES `LfD` (`Id`);

--
-- Constraints for table `Kontext_Ort`
--
ALTER TABLE `Kontext_Ort`
  ADD CONSTRAINT `Kontext_Ort_ibfk_1` FOREIGN KEY (`Kontext_Id`) REFERENCES `Kontext` (`Id`),
  ADD CONSTRAINT `Kontext_Ort_ibfk_2` FOREIGN KEY (`Ort_Id`) REFERENCES `Ort` (`Id`);

--
-- Constraints for table `Ort`
--
ALTER TABLE `Ort`
  ADD CONSTRAINT `Ort_ibfk_1` FOREIGN KEY (`Typ_Id`) REFERENCES `OrtTyp` (`Id`);

--
-- Constraints for table `Ort_Ort`
--
ALTER TABLE `Ort_Ort`
  ADD CONSTRAINT `Ort_Ort_ibfk_1` FOREIGN KEY (`Ort_Id`) REFERENCES `Ort` (`Id`),
  ADD CONSTRAINT `Ort_Ort_ibfk_2` FOREIGN KEY (`ElternOrt_Id`) REFERENCES `Ort` (`Id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
