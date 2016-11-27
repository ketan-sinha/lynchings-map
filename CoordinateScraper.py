import json, xlrd, xlwt, xlutils, urllib, pprint, re, googlemaps, geocoder
from xlrd import *
from xlwt import *
from xlutils.copy import copy
from pprint import pprint
from googlemaps import *

county = ""
url = ""
book = open_workbook('lynchings.xlsx')
wBook = copy(book)
sheet = book.sheet_by_index(0)
wSheet = wBook.get_sheet(0)
key='AIzaSyCpQbnnUBIaxaB41kCOZWcCEeY6ghoivBA'
gmaps = googlemaps.Client(key)

counter = -1

for row_index in range(sheet.nrows): #sheet.nrows
    #print cellname(row_index,4),'-',

    #check if the current county matches the previous one
    if county != sheet.cell(row_index,4).value:
        county = sheet.cell(row_index,4).value
        state = sheet.cell(row_index,5).value
        newCounty = county

        #precleaning the input a bit
        #stripQuotes = re.match('([\"\'])(?:(?=(\\?))\2.)*?\1', county)
        #if stripQuotes == None:
            #print "No quotes found"
        #elif stripQuotes:
            #newCounty = newCounty.replace(re.match('([\"\'])(?:(?=(\\?))\2.)*?\1', county), "")   #tricky bit of regex to strip out anything inside " ", see http://stackoverflow.com/a/171499
        #else:
            #print "Fail"

        newCounty = county.replace(" ","+")
        g = geocoder.google(newCounty + " County, " + state)

        #check if newCounty contains only alphanumeric characters
        valid = re.match('^[\w-]+$', newCounty)
        #create Google API link and grab JSON output
        url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + newCounty + "+County+" + state
        #response = urllib.urlopen(url)
        #data = json.loads(response.read())
        #geocode_result = gmaps.geocode(url)
        #parse the JSON output from Google Maps
        #print to output
        #pprint(geocode_result)

        if not valid:
            wSheet.write(row_index, 13, "NONALPHANUMERIC CHARACTERS")
        print county + ":\t" + str(g.lat) + "\t" + str(g.lng)
        counter += 1
    wSheet.write(row_index, 12, g.lng)
    wSheet.write(row_index, 11, g.lat)

wBook.save('lynchingsCoord.xls')
print "\nTotal unique counties: "
print counter
