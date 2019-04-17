# Entwicklerhandbuch der Anwendung "Munins Archiv"

## Inhaltsverzeichnis

1. [Entwicklungsumgebung](#1-entwicklungsumgebung)
    1. [Bestandteile](#11-bestandteile)
    1. [Einrichtung](#12-einrichtung)
1. [Verzeichnisstruktur](#2-verzeichnisstruktur)
1. [Verwendete Pakete](#3-verwendete-pakete)
1. [Architektur](#4-architektur)
1. [Logfunktion](#5-logfunktion)
1. [Releasemanagement](#6-releasemanagement)

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

## 4. Architektur

### 4.1. Client-Server-Architektur  

_Munins Archiv_ ist eine Web-Anwendung und damit eine Client-Server-Anwendung. Der Client ist der Browser, z. B. Firefox. Ein wesentlicher Vorteil dieser Architektur besteht darin, dass der Client-Computer nur einen Broswer benötigt. Neue Versionen müssen nur auf dem Server installiert werden. Alle Clients verwenden umgehend die aktuelle auf dem Server installierte Version.  
  
Darüber hinaus können etablierte Web-Mechanismen übernommen werden, z. B. Caching.

### 4.2. Mehrschichtenarchitektur  

_Munins Archiv_ besteht aus mehreren Schicht, die sich auf verschiedenen Rechnern verteilen lassen. 
  
Die **Datenschicht** befindet sich auf dem Datenbankserver und ist mit dem DBMS MySQL umgesetzt. Für _Munins Archiv_ ist eine Datenbank erforderlich.  
  
Die **serverseitige Anwendungsschicht** befindet sich auf dem Applikationsserver, der mit dem Datenbankserver identisch sein kann. Aufgrund der verwendeten Sprache, PHP, ist der eingesetzte Web-Dienste Apache2. Die PHP-Skripte lesen, verarbeiten und speichern die Daten aus der Datenbank und bilden somit eine Brücke zwischen der Clientseite und der Datenbank. Dabei untergliedert sich diese Schicht in weitere Unterschichten: Models, Factories, User Stories und Web Services.  
  
Das **Model** beschreibt lediglich die Datenstruktur, z. B. eine Ablage.  
  
Die **Factory** kümmert sich um das Laden, Ändern, Löschen und Speichern des Models.  
  
Die **User Story** deckt einen konkreten Anwendungsfall ab, z. B. ein Benutzer legt eine neue Ablage an.  
  
Der **Web Service** ist die Schnittstelle zwischen dem Client und den User Stories. Er bereitet Voraussetzungen für die User Story vor, führt die User Story aus und gibt das Ergebnis an den Client weiter.  
  
Die clientseitige Anwendungsschicht besteht aus dem HTML, CSS und JavaScript (jQuery). Die **View** besteht aus dem HTML, CSS und dem JavaScript, welches die GUI manipuliert. Daten und Zustandsinformationen erhält die View vom **ViewModel**, welches Methoden zur Änderung von Werten der Datenobjekte sowie Aktionen, wie bspw. Laden, Löschen oder Speichern, zur Verfügung stellt. Die Aktionen des ViewModels rufen ihr jeweiliges Gegenstück im Webservice auf. Änderungen des ViewModels erfährt die View durch Registrierung für gewisse Änderungsereignisse, siehe [Observer-Patterns](https://de.wikipedia.org/wiki/Beobachter_(Entwurfsmuster)).
  
### 4.3. Web-Service-Architektur  
  
PHP bietet die Möglichkeit, HTML-Code zu generieren, zu manipulieren und an den Browser zu schicken. In der Architektur von _Munins Archiv_ ist dies nicht vorgesehen. Die serverseitige Anwendungsschicht ist ein Web-Service, um Daten zu erzeugen, zu suchen, zu bearbeiten, zu löschen und zu speichern. Die Ausgabe der Daten erfolgt im JSON-Format. Um den Aufruf des Webservices unabhängig von der eingesetzten Serversprache zu machen, findet der Einsatz von URL-Rewriting statt.

Ziel der sprachneutralen Web-Service-Architektur ist es, einen Austausch der serverseitigen Applikationssprache zu vereinfachen. So kann PHP bspw. gegen Java oder ASP.NET ausgewechselt werden, ohne dass der Clientcode geändert werden muss.
  
## 5. Logfunktion

Eine wesentliche Neuerung auf der Serverseite ist das Protokollieren des Programmablaufes und der verarbeiteten Daten mittels log4php. Dies unterstützt sowohl den Entwicklungsprozess, als auch die Fehlersuche im Produktivsystem.

## 6. Releasemanagement

Jedes Jahr soll es eine Hauptversion geben. Dazwischen soll mindestens eine Zwischenversion erscheinen. Der Zweck der Zwischenversion ist, die "Must Have"-Anforderungen umzusetzen und Rückmeldungen der Anwender für die Hauptversion zu sammeln. Die nachfolgenden Zwischenversionen oder die Hauptversion setzen das Benutzer-Feedback um und ergänzen die Anwendung um Funktionen der Kategorie "Should Have" und "Nice To Have".

Im Bereich Branching ist das Ziel "Continuous Integration" zu erreichen. Zu diesem Zweck ist der Branch "main" geschützt. Bei einem Merge muss die Funktionsfähigkeit der Anwendung beachtet werden, um jederzeit ein lauffähiges und idealerweise fehlerfreies Release zu erzeugen.