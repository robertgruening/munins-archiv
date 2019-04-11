# Entwicklerhandbuch der Anwendung "Munins Archiv"

## Inhaltsverzeichnis

1. [Entwicklungsumgebung](#1-entwicklungsumgebung)
    1. [Bestandteile](#11-bestandteile)
    1. [Einrichtung](#12-einrichtung)
1. [Verzeichnisstruktur](#2-verzeichnisstruktur)
1. [Verwendete Pakete](#3-verwendetepakete)

## 1. Entwicklungsumgebung

### 1.1. Bestandteile

1. Webserver: z. B. Apache Http Server
1. Datenbankserver: MySQL5 Server
1. Versionsverwaltungssystem: git

### 1.2. Einrichtung

#### 1.2.1. Datenbank

1. Datenbankserver einrichten (MySQL5-Server)
1. Datenbank „Munins_Archiv“ anlegen
1. Benutzer anlegen
    1. Name: Munin
    1. Passwort: Erinnerung
1. Lese- und Schreibrechte für die Datenbank vergeben
1. SQL-Skripte ausführen
    1. create.sql
    1. insert data into AblageTyp.sql
    1. insert data into FundAttributTyp.sql
    1. insert data into KontextTyp.sql
    1. insert data into OrtTyp.sql

#### 1.2.2. Website

1. Beliebigen Webserver einrichten (z. B. Apache Http Server)
1. git-Repository als Wurzel der Website einrichten ([http://localhost:80/Munins Archiv/src](http://localhost:80/Munins%20Archiv/src))

## 2. Verzeichnisstruktur
  
* **/db** - Die Skripte zum Erstellen und Befüllen der Datenbank befinden sich im Verzeichnis "db" (database -> Datenbank).  
* **/doc** - Die Dokumentation zum Projekt, inklusive der Handbücher, befindet sich im Verzeichnis "doc" (documents -> Dokumente).
* **/pkg** - Programmbibliotheken und -erweiterungen von Drittanbietern sind in "pkg" (packages -> Pakete) gespeichert.
* **/prototypes** - Prozess-, Architektur- und Designstudien befinden sich in "prototypes" (prototypes -> Prototypen).
* **/src** - Der Quellcode befindet sich unter "src" (sources -> Quellcode). Als Sprachen kommen hier HTML, JavaScript und PHP zum Einsatz.
* **/tst** - Die automatisierten Tests für die Schichten der Serverseite befinden sich im Verzeichnis "tst" (test -> Test).
* **/upgr** - Die Skripte zum Aktualisieren der Anwendung auf die neueste Version befinden sich unter "upgr" (upgrade -> Auktualisierung).

## 3. Verwendete Pakete

* [Apache log4php](https://logging.apache.org/log4php/download.html) v2.3.0 von der **Apache Software Foundation** unter der *Apache-Lizenz 2.0*
* [Font Awesome Icons](https://fontawesome.com/) v5.3.1 von **Fonticons, Inc.** unter der *CC BY 4.0 Lizenz*
* [jQuery min](https://jquery.com/) v3.3.1 von der **jQuery Foundation** unter der *MIT-Lizenz*
* [jQuery UI](https://jquery.com/) v1.12.1 von der **jQuery Foundation** unter der *MIT-Lizenz*
* [jsGrid](http://js-grid.com/) v1.5.3 von **Artem Tabalin** unter der *MIT-Lizenz*
* [jsTree](https://www.jstree.com/) v3.3.5 unter der *MIT-Lizenz*
