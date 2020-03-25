#!/usr/bin/env python
import urllib.request
import os

# 1 : 4.000
#(zoom, xmin, ymin, xmax, ymax) = (17, 69298, 44734, 69540, 44846)

# 1 : 35.000
(zoom, xmin, ymin, xmax, ymax) = (13, 4331, 2795, 4346, 2802)

# 1 : 250.000
#(zoom, xmin, ymin, xmax, ymax) = (11, 1082, 698, 1086, 700)

serviceUrl = "http://tile.openstreetmap.org/!z/!x/!y.png"
attribution = 'Map data (c) OpenStreetMap'
downloadRootPath = "/var/www/html/Munins Archiv/src/api/Services/KartenKacheln/"
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
			tileUrl = serviceUrl.replace("!x", str(x)).replace("!y", str(y)).replace("!z", str(zoom))
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
