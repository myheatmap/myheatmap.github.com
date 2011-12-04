---
title: myHeatmap REST API
layout: default
---
#myHeatmap REST API

The myHeatmap API allows you to create and update maps, sets, and points for geographic data and download customized heat tiles generated from your geographic data.  We are offering a limited beta version while we are tweaking the technology.

**If you would like early access, please fill out our <a href='https://docs.google.com/a/russjhammond.com/spreadsheet/viewform?formkey=dFlBLUZrMG4wdWxEZklDc1JRVEVmT0E6MQ'>API questionnaire</a> and we will contact you.**

##How do I use the API?

myHeatmap API is a REST API that uses the JSON data format.  You must include your access token with each API request

##1. Create a map

You will need to create a map before you can create a map set or add points.  Pass the map info in the body of the request.  The response will contain the ID of the map you just created.

###REQUEST

    POST http://api.myheatmap.com/maps.json?token=123xyz

    { 
      "name" : "Charlotte, NC Crime Data", 
      "description" : "heatmap of crime statistics" 
    }

###RESPONSE

    { "map_id" : 1 }


##2. Create a map set

Each map must contain one or more sets in order to add geographic points to the map.  Since we already created a map and received the map\_id in the response, we can use the map\_id to create a map set for this map.  Just replace the &lt;map_id&gt; in the request URL with the map ID you received from the map response.  "name" and "mode" are required.  "mode" must be either "density" or "value".

###REQUEST

    POST http://api.myheatmap.com/maps/<map_id>/sets.json?token=123xyz

    { 
      "name" : "thefts", 
      "description" : "crimes categorized as thefts", 
      "data_reference_url" : "http://some-crime-data.url.com", 
      "units" : "incidents", 
      "mode" : "density" 
    }

###RESPONSE

    { "set_id" : 1 }

##3. Create points for a set

Points are required to create a heat map.  Each set can have up to 100,000 points.  You can send a maximum of 10,000 points in each API request.  A point consists of a latitude, a longitude, and a value.  The value represents the density of your data at that particular latitude/longitude point.  You must pass the set\_id in the request URL (replace &lt;set\_id&gt; with your set\_id in this example)


###REQUEST

    POST http://api.myheatmap.com/sets/<set_id>/points.json?token=123xyz

    [
      {
        "lat" : 40.7500,
        "lng" : -73.9970,
        "val" : 2
      },
      {
        "lat" : 34.0522,
        "lng" : -118.2434,
        "val" : "6"
      },
      {
        "lat" : 37.7792,
        "lng" : -122.4201,
        "val" : 4
      }
    ]

###RESPONSE

    OK

##4. Get the heat tile for your map set

Heat tiles for a set can be requested by specifying a zoom level and x and y coordinates:

    GET http://api.myheatmap.com/sets/1/tile/?x=0&y=0&z=0

Optionally, parameters can be specified for the heat width and/or color scale:

    GET http://api.myheatmap.com/sets/1/tile/?x=0&y=0&z=0&width=3&color_scale=00ffff:0|ff0000:100

### Zoom levels

The map zoom level is specified by the `z` parameter. Acceptable values range from 0 to 20 inclusive. The larger the value of *z*, the more zoomed in is the view.

### Tile coordinates

Tiles are rendered using a spherical [Mercator projection](http://en.wikipedia.org/wiki/Mercator_projection). The tile locations are specified by Cartesian coordinates (the `x` and `y` parameters), where the origin is located at the lower left corner of the map (i.e., &minus;180, &minus;180 degrees).

* Values for the <script type='math/tex'>x</script> and <script type='math/tex'>y</script> coordinates must be in the range <script type='math/tex'>\left[ 0, n \right)</script>. 
* The value of <script type='math/tex'>n</script> is a power of two depending on the zoom level, <script type='math/tex'>z</script>, that is: <script type='math/tex'>n = 2^z</script>.

Thus, at zoom level 0 the globe is covered by a single tile with <script type='math/tex'>x = y = 0</script>, and at zoom level 1 the globe is covered by a 2 &times; 2 grid of tiles. Here are grid coordinates for a zoom level of 2:

**Tile coordinates as <script type='math/tex'>\left( x, y \right)</script>, for <script type='math/tex'> z = 2 </script>**
<table style="text-align:center; width:256px; height:256px; background-image:url('/images/0_0_0.png');" border="1" cellpadding="0" cellspacing="0">
<tbody>
<tr>
  <td height="64" width="64"><script type='math/tex'> \left( 0, 3 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 1, 3 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 2, 3 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 3, 3 \right) </script></td>
</tr>
<tr>
  <td height="64" width="64"><script type='math/tex'> \left( 0, 2 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 1, 2 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 2, 2 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 3, 2 \right) </script></td>
</tr>
<tr>
  <td height="64" width="64"><script type='math/tex'> \left( 0, 1 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 1, 1 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 2, 1 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 3, 1 \right) </script></td>
</tr>
<tr>
  <td height="64" width="64"><script type='math/tex'> \left( 0, 0 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 1, 0 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 2, 0 \right) </script></td>
  <td height="64" width="64"><script type='math/tex'> \left( 3, 0 \right) </script></td>
</tr>
</tbody>
</table>

### The `width` parameter

The `width` parameter controls how "spread out" the heat appears around your data points. The higher the `width` parameter, the more spread out the heat. Acceptable values range from 1 to 5, inclusive, with a default value of 3.

### Controlling the color scale

The `color_scale` parameter controls how density (or values) are displayed in terms of colors. The scale is set by specifying color stops. Each stop is assigned a color using RGB hex values (as in HTML colors) and a percent at which the color is used. Color stops are separated by a vertical bar (pipe) character. For example, a color scale that is red at zero, green at 50% scale, and blue at 100% scale would be specified as `color_scale=ff0000:0|00ff00:50|0000ff:100` in your http GET request.

### Integration example ###

To view an example integration using OpenLayers and OpenStreetMap, please see our [Gist on GitHub](https://gist.github.com/1427530)

##5. Updating maps, sets and points

Update requests must use the HTTP PUT method and pass the id of the resource you are updating.  Pass the same JSON data as described in the creation methods.

    PUT http://api.myheatmap.com/maps/1.json

    PUT http://api.myheatmap.com/maps/1/sets/1.json

    PUT http://api.myheatmap.com/sets/1/points/1.json


##6. Deleting maps, sets and points

DELETE requests must use the HTTP DELETE method and pass the id of the resource to be deleted.


    DELETE http://api.myheatmap.com/maps/1.json

    DELETE http://api.myheatmap.com/maps/1/sets/1.json

    DELETE http://api.myheatmap.com/sets/1/points/1.json
