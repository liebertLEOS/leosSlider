(function($){

	////////////////////////////////////////////////////////////////////////////
	//                              Slider
	//
	//      .leos-slider
	//      |---- .leos-slider-container
	//           |---- .leos-slide
	//           |---- .leos-slide
	//           |---- ...
	//      |---- .leos-slider-indicator
	//           |---- li
	//           |---- li
	//           |---- ...
	//      |---- .leos-slider-nav
	//           |---- leos-left
	//           |---- leos-right
	//
	////////////////////////////////////////////////////////////////////////////
	var leosSlider = function(element,userconf){
		var _slider          = this;
		var	_sliderInterval  = null;
		_slider.currentSlide = 0;
		_slider.totalSlides  = 0;

		var _conf = $.extend({
			slider:element,
			slide:'.leos-slide',
			indicator:'.leos-slider-indicator',
			navLeft:'.leos-slider-nav .leos-left',
			navRight:'.leos-slider-nav .leos-right',
			interval:2000,
			animateDuration:500,
			animationEasing:'ease',
			pauseOnHover:true,
		},userconf);

		_slider.prevSlide = function(){
			var slide = (_slider.currentSlide > 0) ? _slider.currentSlide -= 1 : _slider.totalSlides - 1;
			_slider.nextSlide(slide);
		}

		_slider.nextSlide = function(slide){
			var oldSlide = _slider.currentSlide;

			if(slide === undefined){
				_slider.currentSlide = (_slider.currentSlide < (_slider.totalSlides-1)) ? _slider.currentSlide += 1 : 0;
			}else{
				_slider.currentSlide = slide;
			}

			// Slide animation, here we determine if we can use CSS transitions (transit.js) or have to use jQuery animate
			$(_conf.slider).find(_conf.slide).each(function(index){
				$(this).stop().animate({left: ($(this).data('index')-_slider.currentSlide)*100+'%'}, _conf.animateDuration);
			});
			$(_conf.slider).find(_conf.indicator+' li').removeClass('active');
			$(_conf.slider).find(_conf.indicator+' li').eq(_slider.currentSlide).addClass('active');
			//Reset slider Interval
			setSliderInterval();
		}

		$(_conf.slider).hover(function(){
			clearInterval(_sliderInterval);
		},setSliderInterval);

		function setSliderInterval(){
			clearInterval(_sliderInterval);
			_sliderInterval = setInterval(function(){
				_slider.nextSlide();
			},_conf.interval);
		}

		_slider.init = function(){
			//get the count of slide
			_slider.totalSlides  = $(_conf.slider).find(_conf.slide).length;
			if(_slider.totalSlides <= 0) return;

			//check silder-indicator and append items to it
			var $indicator = $(_conf.slider).find(_conf.indicator);
			if($indicator != undefined){
				var _html='';
				for(i=0;i<_slider.totalSlides;i++){
					_html += '<li></li>'
				}
				$indicator.append(_html);
				$indicator.children().first().addClass('active');
				$indicator.children().click(function(){
					if(!$(this).hasClass('active')) _slider.nextSlide($(this).index());
				})
				//adjust the margin-left of indicator
				var slider_indicator = $(_conf.slider).find(_conf.indicator);
				slider_indicator.css('marginLeft',-slider_indicator.width()/2);
			}

			$(_conf.slider).find(_conf.navLeft).click(function(){_slider.prevSlide();});
			$(_conf.slider).find(_conf.navRight).click(function(){_slider.nextSlide();});

			//adjust the slide
			$(_conf.slider).find(_conf.slide).each(function(index){
				var _this = $(this);
				_this.attr('data-index',index);
				$(_this).css({left: index*100+'%',width: $(_this).outerWidth()});
			});
			setSliderInterval();
			return true;
		}();
	};

	$.fn.extend({
		slider: function( conf ) {
			return this.each( function () {
				var ele = $(this);
				if ( ele.data('slider') ) {
					return;
				}
				ele.data( 'slider', new leosSlider(ele, conf) );
			} );
		}
	});
/*
	$.fn.slider = function(conf){
		return this.each(function(){
			var element = $(this);
			if(element.data('slider')) return;
			var slider = new leosSlider(this,conf);
			element.data('slider',slider);
		});

	}
*/

})(jQuery);
