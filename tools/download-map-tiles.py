#!/usr/bin/env python
import urllib.request
import os

def download_tiles(zoom, xmin, ymin, xmax, ymax):
	serviceUrl = "http://!h.tile.openstreetmap.org/!z/!x/!y.png"
	attribution = "Map data (c) OpenStreetMap"
	downloadRootPath = "/home/renton/projects/openstreetmap/mapTiles/"
	numberOfTiles = (xmax - xmin + 1) * (ymax - ymin + 1)
	counterOfTiles = 0

	if not os.path.exists(downloadRootPath):
		print(os.makedirs(downloadRootPath))

	zoomDirectoryPath = downloadRootPath + str(zoom) + "/"

	if not os.path.exists(zoomDirectoryPath):
		print(os.makedirs(zoomDirectoryPath))

	for x in range(xmin, xmax+1):
		xDirectoryPath = zoomDirectoryPath + str(x) + "/"

		if not os.path.exists(xDirectoryPath):
			print(os.makedirs(xDirectoryPath))

		for y in range(ymin, ymax+1):
				counterOfTiles = counterOfTiles + 1
				print(str(counterOfTiles) + " von " + str(numberOfTiles) + " (" + str(counterOfTiles * 100 / numberOfTiles) + ")")
				hostName = ""

				if (counterOfTiles % 3) == 0:
					hostName = "c"
				elif (counterOfTiles % 2) == 0:
					hostName = "b"
				else:
					hostName = "a"

				tileUrl = serviceUrl.replace("!h", hostName).replace("!x", str(x)).replace("!y", str(y)).replace("!z", str(zoom))
				print(tileUrl)
				try:
					tileDirectoryPath = xDirectoryPath
					tilePath = tileDirectoryPath + "/" + str(y) + ".png"

					if os.path.exists(tilePath):
						print("OK - bereits vohanden")
						continue;

					request = urllib.request.Request(tileUrl, headers={'User-Agent': 'BigMap/2.0'})
					response = urllib.request.urlopen(request)

					tile = open(tilePath, "wb")
					tile.write(response.read())
					tile.close()

					if os.path.exists(tilePath):
						print("OK")
					else:
						print("ERROR!")
				except Exception as e:
					print("Error", e)
					continue;

#Note:
# Go to http://tools.geofabrik.de/calc/#type=geofabrik_standard&bbox=5,47,16,55&grid=1
# Click "+" at the map to see the x and y values of the tiles and to use them below.
# More example code: https://egorikas.com/download-open-street-tiles-for-offline-using/

# 1 : 4.000
#download_tiles(17, 69298, 44725, 69540, 44846)

# 1 : 35.000
#download_tiles(13, 4331, 2795, 4346, 2802)

# 1 : 250.000
#download_tiles(11, 1082, 698, 1086, 700)

# Regionen: Fürth, Bad Windsheim, Erlangen
#download_tiles(10, 540, 348, 543, 350)
#download_tiles(9, 270, 174, 271, 175)
#download_tiles(8, 134, 86, 135, 87)
#download_tiles(7, 67, 43, 67, 43)

# Deutschland
#download_tiles(6, 33, 20, 34, 22)
#download_tiles(5, 16, 10, 17, 11)
