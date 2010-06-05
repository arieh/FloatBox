/*
---
description: This is yet another lightbox widget i developed for one of my sites. Simple interface for creating nicely styled boxes.

license: MIT-style

authors:
- Arieh Glazer

requires:
- core/1.2.4: [Class, Class.Extras, Element, Assets]

provides: [FloatBox, FloatBox.HTML, FloatBox.Image, FloatBox.IFrame]

...
*/
var FloatBox = new Class({
	Implements : [Options],
	options : {
		size : {x :400, y:400}
		, target : document.body
		, rtl : false
	}
	, box : new Element('div',{'class':'box-container'})
	, initialize : function(elem,options){
		this.setOptions(options);
		
		this.createBox(elem);
		
		this.attachEvents();
		
		this.box.inject(this.options.target);
	}
	, createBox : function(elem){	
		var border =  new Element('div',{'class':'box-border'})
		    , close = new Element('span',{'class':'close close-box'})
		    , screen_size = Window.getSize()
		    , top = (screen_size.y-this.options.size.y-60)/2
			, side = (this.options.rtl)? 'right' : 'left'
		    , side_p = (screen_size.x-this.options.size.x-60)/2;
			
		elem.addClass('box-contained');        		
		
		this.box.adopt(close,border,elem).setStyle('padding' , top +' '+side_p);
		
		border.setStyles({
			height:this.options.size.y+60,
			width:this.options.size.x+60
		});
		
		elem.setStyles({
			height:this.options.size.y,
			width:this.options.size.x
		});
		
		close.setStyle('top',top+5).setStyle(side,side_p+5);
	}
	, attachEvents : function(){
		var closeBox = this.close.bind(this);
		this.box.getElements('.close').addEvent('click',function(){closeBox();});
		
		if (Browser.Engine.trident){
		    $(document.body).addEvent('click',function(e){
		        if ($(box).contains(e.target)) return;
		        closeBox();			
		    });
		}else{
		    this.box.addEvent('click',function(e){
		        if (e.target==this) closeBox();
		    });
		}
	}
	, close : function(){
		this.box.destroy();
	}
	, toElement : function(){return this.box;}
	, resize : function(x,y){
		var screen_size = Window.getSize(),
			side=this.options.rtl ? 'right' :'left',
			padd = (screen_size.x-x)/2,
			top =  (screen_size.y-y)/2,
			new_padd = {'padding-top':top},
			new_close = {top:top+10};
		new_padd['padding-'+side] = padd;	
		
		this.box.morph(new_padd);
		new_close[side] = padd +10;
		this.box.getElement('.close-box').morph(new_close);
		
		this.box.getElement('.box-border').morph({
			height:y+60,
			width:x+60
		});
		this.box.getElement('.box-contained').morph({
			height:y,
			width:x
		});
		
	}	
});

FloatBox.HTML = new Class({
	Extends : FloatBox,
	initialize : function(options){
		var req
			, self = this
			,cont;
		
		if (options.boxOptions) this.setOptions(boxOptions);
		
		this.createBox(new Element('div'));
		cont = this.box.getElement('.box-contained');	
		options.update = cont;
		req = new Request.HTML(options);
		req.addEvent('success',function(){
			self.attachEvents();
			self.box.inject(self.options.target);
		});
		
		req.send();
	}
});

FloatBox.Image = new Class({
	Extends : FloatBox
	, options : {fit:true}
	, initialize : function(src,options){
		if (!options) options = {};
		var self = this
			, dummy
			, image = new Asset.image(src,{
				'onLoad' : function(){
					if (!options.size){
						dummy = new Element('div',{styles : {'position':'absolute','right':-9999}})
							.adopt(image)
							.inject(document.body);
						options.size = self.options.fit ? self.getSize(image) : image.getSize();
						image.dispose();
						dummy.destroy();
					}else{
						image.set('height',options.size.y);
						image.set('width',options.size.x);
					}
					self.setOptions(options);
					self.createBox(image);
					self.attachEvents();
					self.box.inject(self.options.target);
				}
			});
	}
	, getSize : function(img){
		var w_size = Window.getSize()
			, img_size = img.getSize()
			, max_height = w_size.y-100
			, max_width  = w_size.x-100
			, h_ratio = img_size.x / img_size.y
			, w_ratio = img_size.y / img_size.x
			, h_diff = img_size.y - w_size.y
			, w_diff = img_size.x - w_size.x
			, size = img.getSize();
		
		if (h_diff > w_diff && h_diff>-101){
			img.setStyles({
				'height' : max_height
				, 'width' : w_ratio * max_height
			});
			size.y = max_height;
			size.x = w_ratio * max_height;
		}else if (w_diff >-101){
			img.setStyles({
				height : max_width * h_ratio
				, width : max_width
			});
			size.y = max_width * h_ratio;
			size.x = max_width;
		}
		return size;
	}
});

FloatBox.IFrame = new Class({
	Extends : FloatBox
	, options : {
		frameOptions : {
			styles :{border:0}
		}
	}
	,initialize : function(src,options){
		this.setOptions(options);
		
		this.options.frameOptions.styles.width = this.options.size.x;
		this.options.frameOptions.styles.height = this.options.size.y;
		this.options.frameOptions.src = src;
		
		var iframe = new IFrame(this.options.frameOptions);
		
		this.parent(iframe);
	}
});