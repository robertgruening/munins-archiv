-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 06, 2016 at 08:20 PM
-- Server version: 5.5.49-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `Munins_Archiv`
--

-- --------------------------------------------------------

--
-- Table structure for table `Ablage`
--

CREATE TABLE IF NOT EXISTS `Ablage` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Typ_Id` int(11) DEFAULT NULL,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  `Parent_Id` int(11) DEFAULT NULL,
  `Ebene` int(11) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `AblageTyp_Id` (`Typ_Id`),
  KEY `Parent_Id` (`Parent_Id`),
  KEY `IndexAblage` (`Bezeichnung`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `AblageTyp`
--

CREATE TABLE IF NOT EXISTS `AblageTyp` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IndexAblageTyp` (`Bezeichnung`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

--
-- Table structure for table `Begehung`
--

CREATE TABLE IF NOT EXISTS `Begehung` (
  `Id` int(11) NOT NULL,
  `Datum` varchar(10) DEFAULT NULL,
  `Kommentar` text,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Fund`
--

CREATE TABLE IF NOT EXISTS `Fund` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Anzahl` int(11) NOT NULL DEFAULT '1',
  `Kontext_Id` int(11) DEFAULT NULL,
  `Ablage_Id` int(11) DEFAULT NULL,
  `Bezeichnung` varchar(15) DEFAULT NULL,
  `Dimension1` int(11) DEFAULT NULL,
  `Dimension2` int(11) DEFAULT NULL,
  `Dimension3` int(11) DEFAULT NULL,
  `Masse` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `Kontext_Id` (`Kontext_Id`),
  KEY `Ablage_Id` (`Ablage_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `FundAttribut`
--

CREATE TABLE IF NOT EXISTS `FundAttribut` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Typ_Id` int(11) NOT NULL,
  `Bezeichnung` varchar(30) NOT NULL,
  `Parent_Id` int(11) DEFAULT NULL,
  `Ebene` int(11) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `Parent_Id` (`Parent_Id`),
  KEY `FundAttributTyp_Id` (`Typ_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `FundAttributTyp`
--

CREATE TABLE IF NOT EXISTS `FundAttributTyp` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Bezeichnung` varchar(25) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `FundAttributTyp_Bezeichnung` (`Bezeichnung`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- --------------------------------------------------------

--
-- Table structure for table `Fund_FundAttribut`
--

CREATE TABLE IF NOT EXISTS `Fund_FundAttribut` (
  `Fund_Id` int(11) NOT NULL,
  `FundAttribut_Id` int(11) NOT NULL,
  PRIMARY KEY (`Fund_Id`,`FundAttribut_Id`),
  KEY `Material_Id` (`FundAttribut_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Kontext`
--

CREATE TABLE IF NOT EXISTS `Kontext` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Typ_Id` int(11) DEFAULT NULL,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  `Parent_Id` int(11) DEFAULT NULL,
  `Ebene` int(11) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `KontextTyp_Id` (`Typ_Id`),
  KEY `Parent_Id` (`Parent_Id`),
  KEY `IndexKontext` (`Bezeichnung`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

-- --------------------------------------------------------

--
-- Table structure for table `KontextTyp`
--

CREATE TABLE IF NOT EXISTS `KontextTyp` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Bezeichnung` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IndexKontextTyp` (`Bezeichnung`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

-- --------------------------------------------------------

--
-- Table structure for table `Kontext_LfdNummer`
--

CREATE TABLE IF NOT EXISTS `Kontext_LfdNummer` (
  `LfdNummer_Id` int(11) NOT NULL,
  `Kontext_Id` int(11) NOT NULL,
  PRIMARY KEY (`LfdNummer_Id`,`Kontext_Id`),
  KEY `Kontext_Id` (`Kontext_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `Kontext_Ort`
--

CREATE TABLE IF NOT EXISTS `Kontext_Ort` (
  `Kontext_Id` int(11) NOT NULL,
  `Ort_Id` int(11) NOT NULL,
  PRIMARY KEY (`Kontext_Id`,`Ort_Id`),
  KEY `Kontext_Id` (`Kontext_Id`),
  KEY `Ort_Id` (`Ort_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `LfdNummer`
--

CREATE TABLE IF NOT EXISTS `LfdNummer` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Bezeichnung` varchar(30) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `LfdNummernBezeichnung` (`Bezeichnung`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `Ort`
--

CREATE TABLE IF NOT EXISTS `Ort` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Bezeichnung` varchar(50) NOT NULL,
  `Typ_Id` int(11) NOT NULL,
  `Parent_Id` int(11) DEFAULT NULL,
  `Ebene` int(11) DEFAULT 0,
  PRIMARY KEY (`Id`),
  KEY `Typ_Id` (`Typ_Id`),
  KEY `Parent_Id` (`Parent_Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

-- --------------------------------------------------------

--
-- Table structure for table `OrtTyp`
--

CREATE TABLE IF NOT EXISTS `OrtTyp` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Bezeichnung` varchar(25) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

-- --------------------------------------------------------

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
-- Constraints for table `Fund_FundAttribut`
--
ALTER TABLE `Fund_FundAttribut`
  ADD CONSTRAINT `Fund_FundAttribut_ibfk_1` FOREIGN KEY (`Fund_Id`) REFERENCES `Fund` (`Id`),
  ADD CONSTRAINT `Fund_FundAttribut_ibfk_2` FOREIGN KEY (`FundAttribut_Id`) REFERENCES `FundAttribut` (`Id`);

--
-- Constraints for table `Kontext`
--
ALTER TABLE `Kontext`
  ADD CONSTRAINT `Kontext_ibfk_1` FOREIGN KEY (`Typ_Id`) REFERENCES `KontextTyp` (`Id`),
  ADD CONSTRAINT `Kontext_ibfk_2` FOREIGN KEY (`Parent_Id`) REFERENCES `Kontext` (`Id`);

--
-- Constraints for table `Kontext_LfdNummer`
--
ALTER TABLE `Kontext_LfdNummer`
  ADD CONSTRAINT `Kontext_LfdNummer_ibfk_2` FOREIGN KEY (`Kontext_Id`) REFERENCES `Kontext` (`Id`),
  ADD CONSTRAINT `Kontext_LfdNummer_ibfk_3` FOREIGN KEY (`LfdNummer_Id`) REFERENCES `LfdNummer` (`Id`);

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
  ADD CONSTRAINT `Ort_ibfk_1` FOREIGN KEY (`Typ_Id`) REFERENCES `OrtTyp` (`Id`),
  ADD CONSTRAINT `Ort_ibfk_2` FOREIGN KEY (`Parent_Id`) REFERENCES `Ort` (`Id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
