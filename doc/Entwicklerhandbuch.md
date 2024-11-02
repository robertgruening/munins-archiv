# Entwicklerhandbuch der Anwendung "Munins Archiv"

## Inhaltsverzeichnis

1. [Entwicklungsumgebung](#1-entwicklungsumgebung)
    1. [Bestandteile](#11-bestandteile)
    1. [Einrichtung](#12-einrichtung)
1. [Verzeichnisstruktur](#2-verzeichnisstruktur)
1. [Verwendete Pakete](#3-verwendete-pakete)
1. [Architektur](#4-architektur)
    1. [Client-Server-Architektur](#41-client-server-architektur)
    1. [Mehrschichtenarchitektur](#42-mehrschichtenarchitektur)
    1. [Web-Service-Architektur](#43-web-service-architektur)
    1. [Entwurfsmuster](#44-entwurfsmuster)
1. [Benutzerführung](#5-benutzerfhrung)
1. [Logfunktion](#6-logfunktion)
1. [Releasemanagement](#7-releasemanagement)
1. [Sonstiges](#8-sonstiges)

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

1. Webserver einrichten
1. git-Repository einrichten
1. URL-Weiterleitung einrichten
1. HTTPS einrichten
1. Log-Ordner anlegen und berechtigen
1. Kartenkacheln herunterladen

Die folgende Anleitung ist spezifisch für den Betrieb der Anwendung auf einem [Ubuntu-Betriebssystem](https://ubuntu.com/) und dem [Apache HTTP Server](https://www.apache.org/).

1. Apache Http Server installieren
	```
	sudo apt-get install apache2 php php-curl libapache2-mod-php php-mysql
	```
1. git-Repository einrichten
	```
	cd /var/www/html/
	git clone https://github.com/robertgruening/munins-archiv.git
	mv "/var/www/html/Munins-Archiv/" "/var/www/html/munins-archiv/"
	```
1. URL-Weiterleitung einrichten
	```
	sudo a2enmod rewrite
	sudo nano /etc/apache2/sites-available/000-default.conf
	```
	Eintrag vornehmen:
	```
	<Directory "/var/www/html">
		AllowOverride All
	</Directory>
	```
	```
	sudo service apache2 restart
	```
1. HTTPS einrichten
	```
	sudo a2enmod ssl
	sudo service apache2 restart
	sudo mkdir /etc/apache2/ssl
	sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/ssl/apache.key -out /etc/apache2/ssl/apache.crt
	sudo nano /etc/apache2/sites-available/default-ssl.conf
	```
	Eintrag vornehmen:
	```
	SSLEngine on
	SSLCertificateFile /etc/apache2/ssl/apache.crt
	SSLCertificateKeyFile /etc/apache2/ssl/apache.key
	```
	```
	sudo a2ensite default-ssl.conf
	sudo a2enmod headers
	sudo nano /etc/apache2/sites-available/default-ssl.conf
	```
	Eintrag nach *ServerAdmin* vornehmen:
	```
	<IfModule mod_headers.c>
		Header always set Strict-Transport-Security "max-age=15768000; includeSubDomains; preload"
	</IfModule>
	```
	```
	sudo service apache2 restart
	sudo a2enmod rewrite
	sudo nano /etc/apache2/sites-available/default-ssl.conf
	```
	Eintrag vornehmen:
	```
	<Directory "/var/www/html">
		AllowOverride All
	</Directory>
	```
	```
	sudo service apache2 restart
	```
1. Kartenkacheln herunterladen
	1. http://tools.geofabrik.de/calc/#type=geofabrik_standard&bbox=5,47,16,55&grid=1 öffnen
	1. "+" klicken
	1. Kacheln auswählen
	1. Skript anpassen
		```
		cd "/var/www/html/munins-archiv/tools/"
		nano download-map-tiles.py
		```		
	1. minimale und maximale X- und Y-Werte entsprechend unter Berücksichtigung der Zoomstufe eintragen
	1. Skript ausführen
		```
		python3 download-map-tiles.py
		```

#### 1.2.3. Webdav

_Munins Archiv_ verwendet das HTTP-Webdav-Protokoll,
um Fotos von Funden an einen Dateiserver zu übermitteln
(POST) und um diese anzuzeigen (GET).

Beispiele für Webdav-Implementierungen sind:

- Apache mit Webdav-Modul
- NextCloud

Die nachfolgende Anleitung beschreibt die Installation
des Webdav-Moduls von Apache [Quelle](https://www.digitalocean.com/community/tutorials/how-to-configure-webdav-access-with-apache-on-ubuntu-18-04)

1. webdav-Modul aktivieren
	```
	sudo a2enmod dav
	sudo a2enmod dav_fs
	sudo mkdir /var/www/webdav
	sudo chown -R www-data:www-data /var/www/webdav
	sudo mkdir -p /usr/local/apache/var/
	sudo chown www-data:www-data /usr/local/apache/var	
	```
1. 
	```
	sudo nano /etc/apache2/sites-enabled/default-ssl.conf
	Alias /webdav /var/www/webdav
	<Directory "/var/www/webdav">
			DAV On 
			AuthType Basic
			AuthName "webdav"
			AuthUserFile /etc/apache2/webdav.passwords
			Require valid-user
	</Directory>
	```
1. 
	```
	sudo htpasswd -c /etc/apache2/webdav.passwords aaf
	sudo chown www-data:www-data /etc/apache2/webdav.passwords
	sudo a2enmod auth_basic
	sudo systemctl restart apache2.service
	```

_HINWEIS:_ Im Fall von Nextcloud ist mindestens seit der
Version 28 die Erweiterung __WebAppPassword__ zu installieren
und wie folgt zu konfigurieren. Im ersten Eintrag "WebDAV/CalDAV"
muss die URL der Webanwendung _Munins Archiv_ eingetragen werden.
Der Grund ist, dass es andernfalls zu einem CORS-Fehler kommt
und _Munins Archiv_ nicht mehr über das WebDAV-Protokoll
auf den Nextcloud-Server zugreifen kann.


## 2. Verzeichnisstruktur

* **/api** - Webservice.
* **/css** - CSS der Webseite (Client-Anwendung).
* **/db** - Die Skripte zum Erstellen und Befüllen der Datenbank befinden sich im Verzeichnis "db" (database -> Datenbank).  
* **/doc** - Die Dokumentation zum Projekt, inklusive der Handbücher, befindet sich im Verzeichnis "doc" (documents -> Dokumente).
* **/images** - Bilder und Grafiken der Webseite (Client-Anwendung).
* **/js** - JavaScript der Webseite (Client-Anwendung).
* **/pages** - HTML der Webseite (Client-Anwendung).
* **/pkg** - Programmbibliotheken und -erweiterungen von Drittanbietern sind in "pkg" (packages -> Pakete) gespeichert.
* **/tools** - Die Werkzeuge der Anwendung, z. B. Python3-Skript zum Herunterladen von Kartenkacheln.
* **/tst** - Die automatisierten Tests für die Schichten der Serverseite befinden sich im Verzeichnis "tst" (test -> Test).
* **/upgr** - Die Skripte zum Aktualisieren der Anwendung auf die neueste Version befinden sich unter "upgr" (upgrade -> Auktualisierung).
* **/webfonts** - Schriftarten für die die Icons der Webseite (Client-Anwendung).

## 3. Verwendete Pakete

* [Font Awesome Icons](https://fontawesome.com/) v6.6.0 von **Fonticons, Inc.** unter der *CC BY 4.0 Lizenz*
* [jQuery min](https://jquery.com/) v3.7.1 von der **jQuery Foundation** unter der *MIT-Lizenz*
* [jQuery UI](https://jquery.com/) v1.14.1 von der **jQuery Foundation** unter der *MIT-Lizenz*
* [jQuery Toast Plugin](https://github.com/kamranahmedse/jquery-toast-plugin) v1.3.2 von **Kamran Ahmed** unter der *MIT-Lizenz*
* [jQuery QR Code](https://github.com/jeromeetienne/jquery-qrcode) 2020-03-29 von **jeromeetienne** und **Community** unter der *MIT-Lizenz*
* [jsGrid](http://js-grid.com/) v1.5.3 von **Artem Tabalin** unter der *MIT-Lizenz*
* [leaflet](http://leafletjs.com/) v1.9.4 von **Vladimir Agafonkin** und **Community** unter der *BSD-2-Lizenz*
* [jsQR](https://github.com/cozmo/jsQR) 2020-03-31 von **Cozmo Wolfe** unter der *Apache-Lizenz 2.0*

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

### 4.4. Entwurfsmuster

#### 4.4.1. Schablonenmethode

Auf der Serverseite wird das [Schablonenmethodenmuster](https://de.wikipedia.org/wiki/Schablonenmethode) (Template Method Pattern) bei den User Stories (Anwendererzählungen) angewandt. Sie bilden die Geschäftslogik des Webservices ab. Alle User Stories laufen gleich ab. Wenn sie über `run()` gestartet wird, werden in `areParametersValid()` die Parameter individuell geprüft. Diese Methode ist in der abstrakten Klasse UserStory abstrakt und muss von den abgeleiteten Klassen implementiert werden. Falls es bei der Überprüfung keinen Fehler gab, führt die User Story mit `execute()` den eigentlichen Vorgang aus. Auch diese abstrakte Methode muss von den abgeleiteten Klassen implementiert werden. Im Fehlerfall kann in den konkreten User Story-Klassen mit `addMessage()` zu jedem Verstoß der Akzeptanzbedingungen eine Meldung geschrieben werden. Der Verwender einer User Story kann über `getMessages()` die Fehlermeldungen auslesen, um sie zu loggen oder dem Benutzer anzuzeigen.

Die konkreten User Stories unterscheiden sich anhand ihrer Ein- und Ausgabeparameter, der Akzeptanzbedingungen in der Prüfungsmethode und dem auszuführenden Geschäftsvorfall.

![Schablonenmethodenmuster am Beispiel der Ablage-User Stories](Schablonenmethode.png)  
*Abbildung 1 - Schablonenmethodenmuster am Beispiel der Ablage-User Stories*

#### 4.4.2. Fabrikmethode

Auf der Clientseite wird das [Fabrikmethodenmuster](https://de.wikipedia.org/wiki/Fabrikmethode) (Factory Method Pattern) bei den WebServiceClients und ViewModels angewandt. Die WebServiceClient-Fabrikmethoden instanziieren eine WebServiceClient-Instanz und führen dessen `init()`-Methode aus. Im Fall der ViewModel-Fabrikmethoden wird zuerst mit Hilfe der WebServiceClient-Fabrik der passende WebServiceClient instanziiert und dem ViewModel-Konstruktor als Parameter übergeben. Abschließend ruft die Fabrikmethode die `init()`-Methode des ViewModel-Objekts auf.

![Fabrikmethodenmuster am Beispiel der WebServiceClients und ViewModels des AblageTypes](Fabrikmethode.png)  
*Abbildung 2 - Fabrikmethodenmuster am Beispiel der WebServiceClients und ViewModels des AblageTypes*

#### 4.4.3. Beobachter

Auf der Clientseite wird das [Beobachtermuster](https://de.wikipedia.org/wiki/Beobachter_(Entwurfsmuster)) (Observer Pattern) bei den WebServiceClients und ViewModels angewandt. Die WebServiceClients (Subjekt) kommunizieren mit dem WebService und sind von daher für den Client - speziell für die ViewModels (Beobachter) - eine Datenquelle. Die ViewModels (Subjekt) stellen der View (Beobachter) einen Zustandsautomaten zur Verfügung.

Ein oder mehrere *Beobachter* können sich bei einem *Subjekt* für ein oder mehrere Eregnisse registrieren. Der Vorteil des Beobachtermusters ist, dass es keines Beobachters bedarf, damit das Subjekt funktioniert. Die Konsequens ist, dass ein ViewModel ohne Oberfläche und ohne WebService automatisiert getestet werden kann. Des Weiteren kann ein View-Control ein ViewModel verwenden, auch wenn es nur einen Teil der Funktionalität benötigt. Das ViewModel arbeit dabei innerhalb seiner Zustände, um gültige Operationen zu ermöglichen.

![Beobachtermuster am Beispiel der WebServiceClients und ViewModels des AblageTypes](Beobachter.jpg)  
*Abbildung 3 - Beobachtermuster am Beispiel der WebServiceClients und ViewModels des AblageTypes*

## 5. Benutzerführung

Das Konzept der Benutzerführung (User Experience - UX) gliedert sich in mehrere Aspekte. Zu den wichtigsten Themen gehört die Definition der Zielgruppen, die mit der Anwendung zu tun haben. An ihnen orientiert sich das im Folgenden beschriebene Benutzungskonzept.

### 5.1. Zielgruppen

Die Anwendung richtet sich an unterschiedliche Zielgruppen (Stakeholder), die unterschiedliche Ziele, Wünsche, Fertigkeiten und Erfahrungen haben. In diesem Kapitel werden die Zielgruppen durch [Personas](https://en.wikipedia.org/wiki/Persona_(user_experience)) wiedergegeben. Es sei darauf hingewiesen, dass die Vollständigkeit der Beschreibung und die Priorisierung einer Persona von der Entwicklung der Applikation abhängt. Weil aus praktischen und logischen Gründen Daten zuerst eingegeben werden müssen, bevor sie durchsucht oder analysiert werden können, werden Personas bevorzugt beschrieben, die überwiegend Daten eingeben. Dies kann beispielsweise im Rahmen einer Inventur geschehen.

#### 5.1.1. Archivarin

Die Persona *Archivarin* heißt Gabi, ist 55 Jahre alt, verheiratet und hat zwei Kinder, die bereits außer Haus sind. Sie ist schon seit zehn Jahren in der archäologischen Arbeitsgruppe des Ortes tätig und gehört zu den aktiven Mitgliedern. Gabi hat ein abgeschlossenes Studium der Völkerkunde und arbeitet für ein Museum, für das sie Schriften anfertigt und Vorträge hält. Im Bereich von Text- und Tabellenprogrammen hat Gabi grundlegende Kenntnisse. Weil man bei Softwareprogrammen jedoch an viele Dinge denken muss, z. B. Vorbereiten von Daten, wünscht sie sich ein System, das "mitdenkt", sie führt, sodass sie mit wenig Aufwand ihr Ziel erreicht.

Als Archivarin empfielt Gabi Richtlinien für die Verwaltung des Archivs und sorgt für deren Einhaltung.

### 5.1. Systembenachrichtigungen

Das System erzeugt an mehreren Stellen der verschiedenen Anwendungsteile unterschiedliche Nachrichten. Diese richten sich an unterschiedliche Zielgruppen.  

## 6. Logfunktion

Eine wesentliche Neuerung auf der Serverseite ist das Protokollieren des Programmablaufes und der verarbeiteten Daten mittels log4php. Dies unterstützt sowohl den Entwicklungsprozess, als auch die Fehlersuche im Produktivsystem.

## 7. Releasemanagement

Jedes Jahr soll es eine Hauptversion geben. Dazwischen soll mindestens eine Zwischenversion erscheinen. Der Zweck der Zwischenversion ist, die "Must Have"-Anforderungen umzusetzen und Rückmeldungen der Anwender für die Hauptversion zu sammeln. Die nachfolgenden Zwischenversionen oder die Hauptversion setzen das Benutzer-Feedback um und ergänzen die Anwendung um Funktionen der Kategorie "Should Have" und "Nice To Have".

Im Bereich Branching ist das Ziel "Continuous Integration" zu erreichen. Zu diesem Zweck ist der Branch "main" geschützt. Bei einem Merge muss die Funktionsfähigkeit der Anwendung beachtet werden, um jederzeit ein lauffähiges und idealerweise fehlerfreies Release zu erzeugen.

## 8. Sonstiges

"QR Code" is registered trademark of DENSO WAVE INCORPORATED.
"QR Code" ist eine registrierte Handelsmarke der DENSO WAVE INCORPORATED.
