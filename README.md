HistoryManager
================
This Class supplies a simple light-box wrapper with a clean cross-browser design. 

The Class was developed when working on one of my sites. It wasn't realy ment to be used for distrubiution but after finishing the work i thought it might actualy serve someone.

It supplies 4 different methods of wrapping content:
1. A simple wrapper for any HTML element you might send it.
2. An AJAX wrapper.
3. An Image wrapper.
4. An IFrame wrapper.
![Screenshot](http://github.com/arieh/FloatBox/raw/master/screenshot.png)

How To Use
-------------
### FloatBox
	
	#JS
	var div = new Element('div').appendText('example div');
	new FloatBox(div,{size:{x:100,y:100}});
	
### FloatBox.HTML
	
	#JS
	new FloatBox.HTML({
		url : 'path/to/file.php',
		boxOptions : {size:{x:150,y:100}}
	});

### FloatBox.Image

	#JS
	new FloatBox.Image('path/to/image.png');
	
### FloatBox.IFrame 

	#JS
	new FloatBox.IFrame('http://www.google.com');
	
	
For more info on the options and methods for each of the implementations see the docs.