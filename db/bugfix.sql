ALTER TABLE Fundstelle ADD GeoPointTemp POINT NULL SRID 4326;

DROP PROCEDURE IF EXISTS Munins_Archiv.fix_geo_points;

DELIMITER $$
$$
CREATE PROCEDURE fix_geo_points()
BEGIN
	DECLARE lon DOUBLE DEFAULT 0.0;
	DECLARE lat DOUBLE DEFAULT 0.0;

	FOR i IN (SELECT Id, GeoPoint FROM Fundstelle WHERE GeoPoint IS NOT NULL) DO
		SET lat = ST_X(i.GeoPoint);
		SET lon = ST_Y(i.GeoPoint);
		UPDATE Fundstelle SET GeoPointTemp = ST_PointFromWKB(POINT(lon, lat), 4326) WHERE Id = i.Id;
	END FOR;
	
END;
$$
DELIMITER ;

CALL fix_geo_points();

ALTER TABLE Fundstelle DROP GeoPoint;
ALTER TABLE Fundstelle RENAME COLUMN GeoPointTemp TO GeoPoint;

DROP PROCEDURE IF EXISTS Munins_Archiv.fix_geo_points;