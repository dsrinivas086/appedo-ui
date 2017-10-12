appedoApp.directive('appedoDonutChartDirective',['$window', '$timeout', 'd3Service', function($window, $timeout, d3Service){
    return {
        restrict: "AE",
        scope: {
        	chartdata: '=',
        },
        link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
        	var data;
        	var colorBase;
            var rand;
            var color;
            var cText=0;
        	scope.$watch("chartdata", function(newValue, oldValue, scope) {
				if( newValue != undefined) {
					data = newValue;
					
					var svg = d3.select("#" + attrs.id).select("svg").remove();

					//Color Selection: Base 3 color for 3 donut active status are set and randomly select one of these 3 colors.
					if(attrs.paneltype=="apm"){
		            	colorBase =[{"colorRange":"#42a6db"},{"colorRange":"#69d080"},{"colorRange":"#EFC450"}];
		                rand = Math.floor(Math.random()*10%3);
		                color = [{"color": colorBase[rand].colorRange},	{"color": "#e0e7ed"}];
					}else if(attrs.paneltype=="rum"){
		            	colorBase = d3.scale.category10();
		            	color =[{"color":colorBase(20)},{"color":colorBase(60)},{"color":colorBase(80)},{"color": colorBase(100)}];
					}else if(attrs.paneltype=="sum"){
		            	colorBase = d3.scale.category20();
		            	color =[{"color":colorBase(20)},{"color":colorBase(60)},{"color":colorBase(80)},{"color": colorBase(100)}];
					}else if(attrs.paneltype=="lt"){
		            	colorBase = d3.scale.category20();
		            	color =[{"color":colorBase(20)},{"color":colorBase(60)},{"color":colorBase(80)},{"color": colorBase(100)}];
		            }
					generateDonutChart();
				}
			});
        	
            function generateDonutChart()
            {   
                var margin = parseInt(attrs.margin) || 20;
                
                var width = document.getElementById(attrs.parrentnodeid).offsetWidth - margin;

            	if (attrs.ctext==null || attrs.ctext==undefined)
                {
            		cText = 0;
                }else{
                	cText=attrs.ctext;
                }
            	
            	var svg = d3.select("#" + attrs.id)
                    .append("svg")
                    .append("g");

                svg.append("g")
                    .attr("class", "slices");
                svg.append("g")
                    .attr("class", "labels");
                svg.append("g")
                    .attr("class", "lines");

                var ssum = d3.sum(data, function(d) {return d.value;});
                svg.append("text")
                        .style("text-anchor", "middle")
                        .append("tspan")
                        .attr('x', 0)
                        .attr('dy', 3)
                        .attr("class","apd-rbtrbfnfmly font_24 clr1b639e")
                        .html(
                        		function(d) { 
                        			if(Number(cText)<0){
                        				return '&infin;';
                        			}else
                        			{
                        				return ssum;
                        			}
                        		}
                        	);

                svg.select("text")
                        .style("text-anchor", "middle")
                        .attr("class", "svgClr1D639F")
                        .append("tspan")
                        .attr("class","apd-rbtrgfnfmly font_16 clr1b639e")
                        .attr('x', 0)
                        .attr('dy', 20)
                        .text(attrs.acctype);

                var height = 150,
                    radius = Math.min(width,height)/2.5;

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) {
                        return d.value;
                    });

                var arc = d3.svg.arc()
                    .outerRadius(radius * 0.8)
                    .innerRadius(radius * 0.65);

                var outerArc = d3.svg.arc()
                    .innerRadius(radius * 0.9)
                    .outerRadius(radius * 0.9);

                svg.attr("transform", "translate(" + (width-20) / 2 + "," + height / 2 + ")");

                var key = function(d) {
                    return d.data.label;
                };


                if (Number(ssum)>0) {

                    /* ------- PIE SLICES -------*/
                    var slice = svg.select(".slices").selectAll("path.slice")
                        .data(pie(data), key);

                    slice.enter()
                        .insert("path")
                        .style("fill", function(d,i) {return color[i].color;})
                        .attr("class", "slice");

                    slice
                        .transition().duration(1000)
                        .attrTween("d", function(d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function(t) {
                                return arc(interpolate(t));
                            };
                        })

                    slice.exit()
                        .remove();

                    /* ------- TEXT LABELS -------*/

                    var text = svg.select(".labels").selectAll("text")
                        .data(pie(data), key);

                    text.enter()
                        .append("text")
                        .attr("dy", -6)
                        .style("text-anchor", "left")
                        .attr("class", function(d){if (d.value>9999) return "apd-rbtrbfnfmly font_16 clr626161"; else return "apd-rbtrbfnfmly font_12 clr626161";})
                        .text(function(d) {
                        	if(d.value >= 0)
                        		return d.value;
                        	else if (d.value <0)
                        		return "UnL";
                        })
                        .append("tspan")
                        .style("text-anchor", "left")
                        .attr('x', 0)
                        .attr('dy', 20)
                        .attr("class","apd-rbtrgfnfmly font_14 clr626161")
                        .text(function(d) {
                        	if(d.value >= 0)
                        		return d.data.label;
                        });
                        
                    function midAngle(d) {
                        return d.startAngle + (d.endAngle - d.startAngle) / 2;
                    }

                    text.transition().duration(1000)
                        .attrTween("transform", function(d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function(t) {
                                var d2 = interpolate(t);
                                var pos = outerArc.centroid(d2);
                                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                                return "translate(" + pos + ")";
                            };
                        })
                        .styleTween("text-anchor", function(d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function(t) {
                                var d2 = interpolate(t);
                                return midAngle(d2) < Math.PI ? "start" : "end";
                            };
                        });


                    text.exit()
                        .remove();

                    /* ------- SLICE TO TEXT POLYLINES -------*/

                    var polyline = svg.select(".lines").selectAll("polyline")
                        .data(pie(data), key);

                    polyline.enter()
                        .append("polyline");
                        

                    polyline.transition().duration(1000)
                        .attrTween("points", function(d) {
                            this._current = this._current || d;
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            if(d.value >= 0) {
                            	return function(t) {
                            		var d2 = interpolate(t);
                            		var pos = outerArc.centroid(d2);
                            		pos[0] = radius * 1.3 * (midAngle(d2) < Math.PI ? 1 : -1);
                            		return [arc.centroid(d2), outerArc.centroid(d2), pos];
                            	};
                            }
                        });

                    polyline.exit()
                        .remove();
                    
                };
            }      
       });
    }};
}]);		


appedoApp.directive('appedoAreaChartDirective',['d3Service', 'ajaxCallService', 'getURLService', function(d3Service,ajaxCallService,getURLService){
    return {
        restrict: "AE",
        scope: {
        	chartdata: '=',
        	pushdata: '=',
        	loadevent: '&'
        	//yaxislabel: '@'
        },
        link: function(scope, element, attrs) {
	        d3Service.d3().then(function(d3) {
	        	var divisor;
	        	var path, data, xAxis, yAxis, area;
				/* old color data set */
//                var colorData = [{"dark":"#9bc2cf", "light":"#d7e6eb"},{"dark":"#c7c7ff", "light":"#e8e8ff"},{"dark":"#19e7e7", "light":"#baf7f7"},
//                                 {"dark":"#93dca3", "light":"#c9edd1"},{"dark":"#94ccea", "light":"#d4eaf6"},{"dark":"#e9ad8d", "light":"#f6ded1"},
//                                 {"dark":"#b9a2d0", "light":"#e3d9ec"},{"dark":"#afca95", "light":"#d7e4ca"},{"dark":"#ebc9bd", "light":"#f7e9e4"},
//                                 {"dark":"#b6b6ff", "light":"#e0e0ff"}];

//                var colorData = [{"dark":"#83a9cc", "light":"#dae5f0"},{"dark":"#a0d2a3", "light":"#e2f1e3"},{"dark":"#e09495", "light":"#f6dfdf"},
//                                 {"dark":"#c792e1", "light":"#eedef6"},{"dark":"#d6c283", "light":"#f3edda"},{"dark":"#25989c", "light":"#bde0e1"},
//                                 {"dark":"#458549", "light":"#c7dac8"},{"dark":"#954849", "light":"#dfc8c8"},{"dark":"#7b3e80", "light":"#d7c5d9"},
//                                 {"dark":"#aa6c42", "light":"#e5d3c6"}];
               
//	        	var colorData = [{"dark":"#6dc066", "light":"#cdffb0"},{"dark":"#c1a7a3", "light":"#f2d1cc"},{"dark":"#e29a8f", "light":"#f7e3e0"},
//                                 {"dark":"#8fe29a", "light":"#ccf2d1"},{"dark":"#7584f6", "light":"#ebedf9"},{"dark":"#4adbd0", "light":"#c9f0ed"},
//                                 {"dark":"#68b030", "light":"#d8f9bf"},{"dark":"#d3dd3e", "light":"#f7f9d8"},{"dark":"#31d2ce", "light":"#9bfbf8"},
//                                 {"dark":"#1ad6d2", "light":"#2cfdf8"},{"dark":"#eac011", "light":"#ffe577"},{"dark":"#c3a62d", "light":"#ffeea6"},
//                                 {"dark":"#fdf2c2", "light":"#d4ae11"},{"dark":"#df473f", "light":"#ffeae9"},{"dark":"#c52f27", "light":"#fff6f5"}];
                
	        	/*
                var colorData = [{"dark":"#499f17", "light":"#6dff19"},{"dark":"#ba490c", "light":"#ff7c35"},{"dark":"#047c8d", "light":"#14e0fd"},
                                 {"dark":"#0b16a1", "light":"#5b66ff"},{"dark":"#05ae2a", "light":"#12ff46"},{"dark":"#a50515", "light":"#fd4b5d"},
                                 {"dark":"#bcc703", "light":"#effd0e"},{"dark":"#ccb900", "light":"#fde60a"},{"dark":"#7b3e80", "light":"#d7c5d9"},
                                 {"dark":"#aa6c42", "light":"#e5d3c6"}];
               */

                var colorData = [{"dark":"#a73f05", "light":"#d08f6b"}, {"dark":"#104a8d", "light":"#7aa1ce"}, {"dark":"#837704", "light":"#ead61e"}, 
                                 {"dark":"#7b3e80", "light":"#d7c5d9"}, {"dark":"#aa6c42", "light":"#e5d3c6"}, {"dark":"#3d7200", "light":"#89c346"}, 
                                 {"dark":"#c55204", "light":"#e57b33"} ];
	        	
	        	
                var rand = Math.floor(Math.random() * colorData.length);
                var timeFormat = d3.time.format(attrs.xaxisformat);
                /* Not used below added by Divami hence commented */
/*                 
                function myRound(value, places) {
                	var multiplier = Math.pow(10, places);
                	return (Math.round(value * multiplier) / multiplier);
                }
                
*/

            	var tooltipLabel = attrs.tooltipLabel != undefined ? attrs.tooltipLabel : 'Value';
            	
    			var expressionHandler = scope.loadevent();
                
	            function generateAreaChartAsArrayInJSONFormart() {
	            	
	            	if(data.length==1){
	            		var dummyData={};
	            		//dummyData["T"] = d3.min(data, function(d) { return d.T; }) - (1000 * 2);
	            		dummyData["T"] = data[0].T  - (1000 * 2);
	            		dummyData["V"] = 0;

						data.unshift(dummyData);
	            		//data.push(dummyData);
	            		//data = data.sort(function(a,b) { return a.T - b.T; });
	            	}
	            	
	            	//data = data.sort(function(a,b) { return a.T - b.T; });
	            	
	            	var parentWidth ;
	            	var rightM = 8;
	            	var leftM = 8;
	            	var bisectDate = d3.bisector(function(d) { return d.T; }).left;
	            	var dotSize;
	            	var lineWidth;
	            	if (attrs.dotsize==null || attrs.dotsize==undefined)
	                {
	            		dotSize = 1.5;
	                }else{
	            		dotSize=attrs.dotsize;
	                }

	            	if (attrs.linewith==null || attrs.linewith==undefined)
	                {
	            		lineWidth = 2;
	                }else{
	                	lineWidth=attrs.linewith;
	                }
	            	
	                if (attrs.parrentnodeid==null || attrs.parrentnodeid=="undefined")
	                {
	                	parentWidth=300;
	                }
	                else 
	                {
	                	parentWidth=document.getElementById(attrs.parrentnodeid).offsetWidth;
	                	if(parentWidth>800){
	                		rightM = 15;
	                		leftM = 3;
	                	}
	                }

	                var minData = d3.min(data, function(d) { return d.V; });
                    var maxData = d3.max(data, function(d) { return d.V; });
                    
                    
                    maxData=Math.ceil(Number(maxData)+Number(maxData)*5/100); // adding 5% of max value to ensure graph is within boundry
                    minData=Number(minData)-Math.ceil(Number(minData)*5/100); // min value is reduced by 5% of min graph value to ensure boundry is intact
                    
                  //This is to ensure reading of values are clear in area chart having background color and area color                    
//                    if (maxData==0 && minData==0){minData= -1; maxData=1;} 
                    
	                var parentHt = 150;
	                //Fixed width does not go well with responsive design hence made as percentage of parent heigth
	                var margin = {top: parentHt*6/100, right: parentWidth*rightM/100, bottom: parentHt*20/100, left: parentWidth*leftM/100},
	                        width = parentWidth - margin.left - margin.right,
	                        height = parentHt - margin.top - margin.bottom, halfOfWidth = (width - margin.right) /2;

	                var x = d3.time.scale()
	                        //.range([0, width]);
	                		.range([0, width - margin.right]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    x.domain(d3.extent(data, function(d) { return d.T; }));
                    y.domain([minData, maxData]);
	                   
                   xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .ticks(5)
                        .tickFormat(timeFormat);

                   yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left").ticks(5);

                    area = d3.svg.area()
                        .interpolate("linear")
                        .x(function(d) { return x(d.T); })
                        .y0(height)
                        .y1(function(d) { return y(d.V); });
                        
                    var areaTop = d3.svg.area()
                        .interpolate("linear")
                        .x(function(d) { return x(d.T); })
                        .y0(0)
                        .y1(function(d) { return y(d.V); });

                    var line = d3.svg.line()
                        .interpolate("linear")
                        .x(function(d) {return x(d.T);})
                        .y(function(d){return y(d.V);});
                    
                    var svg = d3.select("#" + attrs.id).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        //.attr("transform","translate(" + margin.left*2 + "," + margin.top + ")")
                        .attr("transform","translate(" + margin.left * 3 / 2+ "," + margin.top + ")")
                    	.attr("onload","LoadHandler(evt)");
                    
                    svg.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", (0-margin.left-margin.right))
                        .attr("x", (0-(height / 2)))
                        .style("text-anchor", "middle")
                        .text('');

                    svg.append("path")
		                        .datum(data)
		                        .style("fill", colorData[rand].light)
		                        .attr("d", area);
                    
                    svg.append("path")
                  	.attr("class", "line")
                  	.attr("d", line(data))
                  	.attr("stroke", function(d) {return colorData[rand].dark;})
            	    .style("stroke-width", lineWidth);
            	  
	              if( attrs.linkstatus == "true" ){
	            	  
	            	  svg.selectAll("dot")
		                .data(data)
						.enter().append('circle')
						.style("cursor","pointer")
						.attr("cx",function(d) {return x(d.T);})
						.attr("cy",function(d){return y(d.V);})
						.attr("r", dotSize)
						.attr("fill",function(d) {return colorData[rand].dark;})
						.append("title")
						.text(function(d) {
							return 'Time : '+timeFormat(new Date(d.T))+'\nValue : '+d.V;  
						});
          		
						svg.selectAll("circle").on("click", function (d) {
						if(attrs.linkstatus=="true"){
						  expressionHandler(d.T, d.V, attrs.hiddenparamkey != undefined ? d[attrs.hiddenparamkey]: '');
							}
						});
	              }else{
	            	 
	            	  	if(data.length>0){
							var focus = svg.append("g")
							.attr("class", "focus")
							.style("display", "none");
						
							focus.append("circle")
								.attr("class", "y") 
								.attr("r", 4.5)
								.style("fill", colorData[rand].dark)
								.style("stroke", function(d) {return colorData[rand].dark;});
		
						    // place the value at the intersection
						    focus.append("text")
						        .attr("class", "y1")
						        .style("stroke", "white")
						        .style("stroke-width", "3.5px")
						        .style("opacity", 0.8)
						        //.attr("dx", 8)
						        //.attr("dy", "-.3em");
						    focus.append("text")
						        .attr("class", "y2")
						        //.attr("dx", 8)
						        //.attr("dy", "-.3em");

						    // place the date at the intersection
						    focus.append("text")
						        .attr("class", "y3")
						        .style("stroke", "white")
						        .style("stroke-width", "3.5px")
						        .style("opacity", 0.8)
						        //.attr("dx", 8)
						        //.attr("dy", "1em");
						    focus.append("text")
						        .attr("class", "y4")
						        //.attr("dx", 8)
						        //.attr("dy", "1em");

							svg.append("rect")
						      .attr("class", "overlay")
								.style("fill", "none")
								.style("pointer-events", "all")
						       .attr("width", width)
		                       .attr("height", height)
						      .on("mouseover", function() { focus.style("display", null); })
						      .on("mouseout", function() { focus.style("display", "none"); })
						      .on("mousemove", mousemove);
	            	  	}
	              }
	              
	              function mousemove() {
					    var x0 = x.invert(d3.mouse(this)[0]),
					    	i = bisectDate(data, x0, 1),
					    	d0 = data[i - 1],
					    	d1 = data[i];/*,
					    	d = x0 - d0.T > d1.T - x0 ? d1 : d0;*/


						if ( d0 != undefined && d1 != undefined ) {
							d = x0 - d0.T > d1.T - x0 ? d1 : d0;	
						}
						
						var dxFocus = x(d.T) > halfOfWidth ? -158 : 8, dy12Focus = y(d.V) > 30 ? -21 : 18, dy34Focus = y(d.V) > 30 ? -3 : 34;
						var xTooltipValue = 'Time : '+timeFormat(new Date(d.T)), yTooltipValue = tooltipLabel+' : '+d.V;
							
						focus.select("circle.y")
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")");


						focus.select("text.y1")
							.attr("dx", dxFocus)
							.attr("dy", dy12Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(yTooltipValue);


						focus.select("text.y2")
							.attr("dx", dxFocus)
							.attr("dy", dy12Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(yTooltipValue);


						focus.select("text.y3")
							.attr("dx", dxFocus)
							.attr("dy", dy34Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(xTooltipValue);


						focus.select("text.y4")
							.attr("dx", dxFocus)
							.attr("dy", dy34Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(xTooltipValue);

	              	}
	            }
	            
	            
				scope.$watch("chartdata", function(newValue, oldValue, scope) {
					if( newValue != undefined) {
						data = newValue;

						timeFormat = d3.time.format(attrs.xaxisformat);

						var svg = d3.select("#" + attrs.id).select("svg").remove();
						
						generateAreaChartAsArrayInJSONFormart();
					}
				});
	       });
        }
    };
}]);

appedoApp.directive('focus', function($timeout) {
  return {
    link: function(scope, element, attrs) {
        scope.$watch(attrs.focus, function(value) {
        if(value === true) { 
            element[0].focus(); 
        }
      });
    }
  };
});

appedoApp.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});
/*
appedoApp.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w.height(), 'w': w.width() };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
//            console.log("Inside resize");
//            console.log("New Value Height: "+newValue.h+" New Value Width: "+newValue.w+" Old Value Width: "+oldValue.w+" OldValue Height: "+oldValue.h);

            scope.style = function () {
                return { 
                    'height': (newValue.h - 100) + 'px',
                    'width': (newValue.w - 100) + 'px' 
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    };
});
*/

appedoApp.directive('license_summary', function() {
    return {
        restrict: "AE",
		//templateUrl: "modules/apm/dashboard/piechart2.html",
		controller: "d3chart_controller"
	};
});		


appedoApp.directive('checkPasswordMatch', function() {
	return {
    	restrict: "A",
    	require: 'ngModel',
    	scope: {
    		match: '='
    	},
    	link: function(scope, element, attrs, ctrl) {
    		//var matchGetter = attrs.match;

    		ctrl.$validators.match = function() {
    			// thinks to set error message for respective field ngMode;
    			var isValid = (ctrl.$viewValue === scope.match);
    			ctrl.$setValidity('match', isValid);
    			return isValid;
    		};
    		
    		/*
    		scope.$watch(attrs.ngModel, function(){
    			ctrl.$$parseAndValidate();
    		});*/
            scope.$watch(attrs.ngModel, function() {
            	ctrl.$validate();
            });
            scope.$watch('match', function() {
            	ctrl.$validate();
            });
    	}
	};
});

appedoApp.directive("uiFileUpload",[function(){
	return{
		restrict:"A",
		link:function(scope,ele){
			return ele.bootstrapFileInput()
		}
	};
}]);

appedoApp.directive('appedoBarchartWithoutAxis',['d3Service', function(d3Service){
	return {
		restrict: 'AE',
		scope: {
			//loadevent: '&'
		},
		link: function(scope, element, attrs) {
			var margin = parseInt(attrs.margin) || 20;
			
            //var width = 500, height = 60;
			//width = document.getElementById(attrs.parentid).offsetWidth - margin;
			var width = element.parent()[0].offsetWidth;
			var height = element.parent()[0].offsetHeight;
			
			var barheight = parseInt(attrs.barheight);
			
			var label = attrs.label || '';
			
			// data
			var bardata = [parseInt(attrs.bardata)];
			
			// 
			//var expressionHandler = scope.loadevent();
			
			d3Service.d3().then(function(d3) {

				var svg = d3.select(element[0])
							.append("svg")
							.attr("width", width)
							.attr("height", height)
							/*.on("click",  function(d, i) {
								expressionHandler(label);
							});*/
				
				svg.selectAll("rect")
					.data(bardata)
					.enter()
					.append("rect")
					.attr("width", function(d) {						
						// tried based value bar width to adjust
						return width * (d/100);
					})
					.attr("height", barheight)
					.attr("x", 0)
					.attr("y", 0)
					.attr("fill", "#31c0be")
					/* when rectangle bar clicked only reflected when text clicked not reflected
					 * .on("click",  function(d, i) {
						console.info('label: '+label);
						alert('label: '+label);
					})*/
					//.transition().ease("elastic")
					.transition();
					// thinks, transistion to place respective order either of attr(x)
					//.delay(function(d, i) { return i * 100; })
					//.duration(200)
					//.attr("transform", "translate(50, 100)")
					//.attr("transform", "translate(0," + (height - padding) + ")")
					//.attr("transform", "translate("+padding+"," + (height - padding) + ")");
					

				// label at start
				svg.selectAll("text.label")
					.data(bardata)
					.enter()
					.append("text")
					.text(label)
					.attr("x", 4)
					.attr("y", (barheight/2)+3)
					//.attr("transform", "translate(50, 100)")
					//.attr("transform", "translate("+padding+"," + (height - padding) + ")")
					//.attr("text-anchor", "middle")
					.attr("font-size", "12px")
					.attr("fill", "black");
					
			});
		}
	};
}]);


appedoApp.directive('appedoBarChart',['d3Service', function(d3Service){
	return {
		restrict: 'AE',
		scope: {
			bardata: '='
		},
		link: function(scope, element, attrs) {
			// vertical bar chart 
			
			// tried, width & height of svg
			var width = parseInt(attrs.svgwidth), height = parseInt(attrs.svgheight);
			
			// tried, `barwidth` is width of the bar; `barpadding` is gap between each bars
			var barwidth = parseInt(attrs.barwidth), barpadding = parseInt(attrs.barpadding);
			
			// tried, padding sets bar move from extreme ends of x and y axis to have sacles/labels  
			var padding = parseInt(attrs.svgpadding);
			
			var maxpercentage = parseInt(attrs.maxpercentage);
			
			d3Service.d3().then(function(d3) {
				
				var svg = d3.select(element[0])
							.append("svg")
							.attr("width", width)
							.attr("height", height);

					svg.selectAll("rect")
						.data(scope.bardata)
						.enter()
						.append("rect")
						.attr("width", barwidth)
						.attr("height", function(d) {
							return d.value;
						})
						.attr("x", function(d, i) {
							// for very datum index calculates x
							// tried, userDefined x axis caluclates manually based on index & barwidth, to have space between each bar barpadding added
							return i * (barwidth + barpadding);
						})
						.attr("y", function(d) {
							// bar goes downwards
							//return height;
							
							// bar in upwards
							return height - d.value;
						})
						.attr("fill", "teal")
						//.transition().ease("elastic")
						// thinks, transistion to place respective order either of attr(x)
						.transition()
						//.delay(function(d, i) { return i * 100; })
						//.duration(200)
						//.attr("transform", "translate(50, 100)")
						//.attr("transform", "translate(0," + (height - padding) + ")")
						.attr("transform", "translate("+padding+"," + (height - padding) + ")");
						

					svg.selectAll("text")
						.data(scope.bardata)
						.enter()
						.append("text")
						.text(function(d) {
							return d.value + '%';
						})
						.attr("x", function(d, i) {
							// text to show for respective bar
							return i * (barwidth + barpadding) + (barpadding + 10);
						})
						.attr("y", function(d) {
							//return height + 10;
							
							// for downwards bar data
							//return height + d.value;
							
							// for upwards bar data, point shows above bar 
							//return height - d.value;
							// for upwards bar data, point shows inside bar
							return height - d.value + 12;
						})
						//.attr("transform", "translate(50, 100)")
						.attr("transform", "translate("+padding+"," + (height - padding) + ")")
						.attr("text-anchor", "middle")
						.attr("font-size", "11px")
						.attr("fill", "black");
						
			});
        }
	};
}]);


appedoApp.directive('appedoBarChartHorizontal',['d3Service', function(d3Service){
	return {
		restrict: 'AE',
		scope: {
			bardata: '='
		},
		link: function(scope, element, attrs) {
			// vertical bar chart 
			
			// tried, width & height of svg
			var width = parseInt(attrs.svgwidth), height = parseInt(attrs.svgheight);
			
			// tried, `barwidth` is width of the bar; `barpadding` is gap between each bars
			var barheight = parseInt(attrs.barheight), barpadding = parseInt(attrs.barpadding);
			
			// tried, padding sets bar move from extreme ends of x and y axis to have sacles/labels  
			var padding = parseInt(attrs.svgpadding);
			
			// tried, to increase bar size
			var multiply = parseInt(attrs.multiply);
			
			var maxpercentage = parseInt(attrs.maxpercentage);
			
			d3Service.d3().then(function(d3) {
				
				
				var svg = d3.select(element[0])
							.append("svg")
							.attr("width", width)
							.attr("height", height);

					svg.selectAll("rect")
						.data(scope.bardata)
						.enter()
						.append("rect")
						.attr("width", function(d) {
							return d.value * multiply ;
						})
						.attr("height", barheight)
						.attr("x", function(d) {
							// bar in left
							//return width - d.value;
							
							return 0;
						})
						.attr("y", function(d, i) {
							// for very datum index calculates x
							// tried, userDefined x axis caluclates manually based on index & barwidth, to have space between each bar barpadding added
							return i * (barheight + barpadding);
						})
						.attr("fill", "teal")
						//.transition().ease("elastic")
						// thinks, transistion to place respective order either of attr(x)
						.transition()
						//.delay(function(d, i) { return i * 100; })
						//.duration(200)
						//.attr("transform", "translate(50, 100)")
						//.attr("transform", "translate(0," + (height - padding) + ")")
						.attr("transform", "translate("+padding+"," + (height - padding) + ")");
						
					// value at end
					svg.selectAll("text.value")
						.data(scope.bardata)
						.enter()
						.append("text")
						.text(function(d) {
							return d.value + '%';
						})
						.attr("x", function(d, i) {
							// text to show for respective bar
							return d.value * multiply;
						})
						.attr("y", function(d, i) {
							//return height + 10;
							
							// for downwards bar data
							//return height + d.value;
							
							// for upwards bar data, point shows above bar 
							//return height - d.value;
							// for upwards bar data, point shows inside bar
							return i * (barheight + barpadding) + (barpadding + 10);
						})
						//.attr("transform", "translate(50, 100)")
						.attr("transform", "translate("+padding+"," + (height - padding) + ")")
						.attr("text-anchor", "middle")
						.attr("font-size", "11px")
						.attr("fill", "black");
					
					
					// label at start
					svg.selectAll("text.label")
						.data(scope.bardata)
						.enter()
						.append("text")
						.text(function(d) {
							return d.label;
						})
						.attr("x", function(d, i) {
							// text to show for respective bar
							return 0;// i * (barwidth + barpadding) + (barpadding + 10);
						})
						.attr("y", function(d, i) {
							//return height + 10;
							
							// for downwards bar data
							//return height + d.value;
							
							// for upwards bar data, point shows above bar 
							//return height - d.value;
							// for upwards bar data, point shows inside bar
							return i * (barheight + barpadding) + (barpadding + 10);
						})
						//.attr("transform", "translate(50, 100)")
						.attr("transform", "translate("+padding+"," + (height - padding) + ")")
						//.attr("text-anchor", "middle")
						.attr("font-size", "11px")
						.attr("fill", "black");
						
			});
        }
	};
}]);

appedoApp.directive('validUrl', function() {
	return {
		restrict: 'A',
	    require: 'ngModel',
	    link: function(scope, ele, attrs, controller) {
	    	var urlRegExp = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
//	    	console.log('controller');
//	    	console.log(controller);
//	    	console.log('urlRegExp :'+urlRegExp);
			function dovalidation() {
//				console.log('controller.$modelValue :'+controller.$modelValue);
//				console.log('urlRegExp.test(controller.$modelValue) :'+urlRegExp.test(controller.$modelValue));
				// TODO: changed based global to apply every wherer, since used only in sum test from controller gets scope value
//					controller.$setValidity('validUrl', urlRegExp.test(controller.$modelValue));
//					console.log('controller inside dovalidation');
//					console.log(controller);
					scope.sumAddForm.$valid = urlRegExp.test(controller.$modelValue);
//					console.log(scope);
					
			}
			// add a parser that will process each time the value is
			// parsed into the model when the user updates it.
//	    	controller.$parsers.unshift(function(value) {
//				if(value){
//					console.log('value :'+value);
//					dovalidation();
//				}
//				return value;
//			});
	    	scope.$on('triggerURLValidation', dovalidation);
	    }
	};
});

appedoApp.directive('appedoMultiLineChartDirective',['$window', '$timeout', 'd3Service', function($window, $timeout, d3Service){
    return {
        restrict: "AE",
        scope: {
        	chartdata: '=',
        	loadevent: '&'
        },
        link: function(scope, element, attrs) {
        	var expressHandler = scope.loadevent();
        d3Service.d3().then(function(d3) {
        	var timeFormat = d3.time.format(attrs.xaxisformat);
            var data=[];
            function generateMultiLineChart()
            {   
            	var parentWidth ;
            	var dotSize;
            	if (attrs.dotsize==null || attrs.dotsize==undefined)
                {
            		dotSize = 3.5;
                }else{
            		dotSize=attrs.dotsize;
                }
                if (attrs.parrentnodeid==null || attrs.parrentnodeid=="undefined")
                {
                	parentWidth=300;
                }
                else 
                {
                	
                	parentWidth=document.getElementById(attrs.parrentnodeid).offsetWidth;
                }
                
                var parentHt = 150;
                
                //Fixed width does not go well with responsive design hence made as percentage of parent heigth
                var margin = {top: parentHt*6/100, right: parentWidth*15/100, bottom: parentHt*20/100, left: parentWidth*8/100},
                        width = parentWidth - margin.left - margin.right,
                        height = parentHt - margin.top - margin.bottom ;


            		var x = d3.time.scale()
            		    .range([0, width]);

            		var y = d3.scale.linear()
            		    .range([height, 0]);

            		var color = d3.scale.category10();

//            		var xAxis = d3.svg.axis()
//            		    .scale(x)
//            		    .orient("bottom");

            		xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(5)
                    .tickFormat(timeFormat);
            		
            		var yAxis = d3.svg.axis()
            		    .scale(y)
            		    .orient("left");

            		var line = d3.svg.line()
            		    .interpolate("linear")
            		    .x(function (d) {
            		    return x(d.Date);
            		})
            		    .y(function (d) {
            		    return y(d.Value);
            		});

            		var svg = d3.select("#" + attrs.id).append("svg")
            		    .attr("width", width + margin.left + margin.right)
            		    .attr("height", height + margin.top + margin.bottom)
            		    .append("g")
            		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            		color.domain(data.map(function (d) { return d.City; }));

            		data.forEach(function (kv) {
            		    kv.Data.forEach(function (d) {
            		        d.Time = new Date(d.Date);
            		        d.Name = kv.City;
            		    });
            		});
            		var cities = data;

            		var minX = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Time; }) });
            		var maxX = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Time; }) });
            		var minY = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Value; }) });
            		var maxY = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Value; }) });

            		maxY=Math.ceil(Number(maxY)+Number(maxY)*5/100); // adding 5% of max value to ensure graph is within boundry
                    minY=Number(minY)-Math.ceil(Number(minY)*5/100); // min value is reduced by 5% of min graph value to ensure boundry is intact

            		x.domain([minX, maxX]);
            		y.domain([minY, maxY]);

            		var legend = svg.selectAll('g')
            	      .data(cities)
            	      .enter()
            	    .append('g')
            	      .attr('class', 'legend');
            	    
            	  legend.append('rect')
            	      .attr('x', width - 0)
            	      .attr('y', function(d, i){ return i *  20;})
            	      .attr('width', 10)
            	      .attr('height', 10)
            	      .style('fill', function(d) { 
            	        return color(d.City);
            	      });
            	      
            	  legend.append('text')
            	      .attr('x', width + 12)
            	      .attr('y', function(d, i){ return (i *  20) + 9;})
            	      .text(function(d){ return d.City; });

            		svg.append("g")
            		    .attr("class", "x axis")
            		    .attr("transform", "translate(0," + height + ")")
            		    .call(xAxis);

            		svg.append("g")
	                    .attr("class", "axis")
	                    .call(yAxis)
	                    .append("text")
	                    .attr("transform", "rotate(-90)")
	                    .attr("y", (0-margin.left-margin.right))
	                    .attr("x", (0-(height / 2)))
	                    .style("text-anchor", "middle")
	                    .text('Count');

            		var city = svg.selectAll(".city")
            		    .data(cities)
            		    .enter().append("g")
            		    .attr("class", "city");

            		city.append("path")
            		    .attr("class", "line")
            		    .attr("d", function (d) {
	            		    return line(d.Data);
	            		})
            		    .style("stroke", function (d) {
	            		    return color(d.City);
	            		});

            		city.append("text")
            		    .datum(function (d) {
	            		    return {
	            		        name: d.City,
	            		        date: d.Data[d.Data.length - 1].Time,
	            		        value: d.Data[d.Data.length - 1].Value
	            		    };
	            		})
            		    .attr("transform", function (d) {
            		    return "translate(" + x(d.date) + "," + y(d.value) + ")";
            		});

            		city.selectAll('circle')
						.data(function(d){ return d.Data})
						.enter().append('circle')
						.style("cursor","pointer")
						.attr("cx", function(d) { return x(d.Time)})
						.attr("cy", function(d) { return y(d.Value)})
						.attr("r", dotSize)
						.style("fill", function(d) { return color(d.Name)})
						.append("title")
						.text(function(d) {
							return 'Time : '+timeFormat(new Date(d.Time))+'\nValue : '+d.Value; 
						});
	            		
            		city.selectAll("circle").on("click", function (d) {
						if(attrs.linkstatus=="true"){
								expressHandler(d.filename);
							}
						});
            }
            
            scope.$watch("chartdata", function(newValue, oldValue, scope) {
				if( newValue != undefined) {
					data = [];
					data = newValue;
					timeFormat = d3.time.format(attrs.xaxisformat);
					var svg = d3.select("#" + attrs.id).select("svg").remove();
					generateMultiLineChart();
				}
			});
            
       });
    }};
}]);

appedoApp.directive('backButton', function() {
	return {
    	restrict: "AE",
    	link: function(scope, element, attrs) {
    		$(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
        }
	};
});

appedoApp.directive('onlyNumbers', function(){
   return {
	   restrict: 'AE',
       require: '^ngModel',
       scope: {
           ngModel: "="
       },
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           //if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         
           return transformedInput;         
       });
     }
   };
});


appedoApp.directive('apdMap', function() {
	function link(scope, element, attrs) 
	{
		element[0].style.position = 'relative';
		element[0].style.display = 'block';
		var map = new Worldmap({
			element: element[0],
			width: element[0].offsetParent.offsetWidth,
			height: element[0].offsetParent.offsetHeight,
			responsive: true,
			projection: 'mercator',
			fills: {
				defaultFill: "#CED8E2",
				inactiveFill: "#70C524",
				activeFill: "#42A6DB" 
			},
			geographyConfig: {
				hideAntarctica: true,
				borderWidth: 1,
				borderColor: '#CED8E2',
				popupOnHover: false,
				highlightOnHover: false
			},
			bubblesConfig: {
				bubbleRadius: '15', //fixed
				borderColor: '',
				borderWidth: '',
				fillOpacity: "1",
				bubbleTextColor: '#ffffff',
				bubbleTextFontFamily: 'apd-rbtrgfnfmly',
				bubbleTextFontSize: '15'
			}
		});
		scope.$watch('data', function(data){
			map.bubbles(data);
		});
	}
	return {
		restrict: 'E',
		link: link,
		scope: {
		  data: '='
		}
	};
});

// tried as separate
appedoApp.directive('appedoAreaChartDiscontinuesPoint',['d3Service', function(d3Service){
    return {
    	restrict: "AE",
    	scope: {
        	chartdata: '='
        },
        link: function(scope, element, attrs) {

			// tried, width & height of svg
			//var width = parseInt(attrs.svgwidth), height = parseInt(attrs.svgheight);

        	
			var WIDTH = element[0].offsetWidth, HEIGHT = element[0].offsetHeight;
			var nLineWidth = 2;
			
			// TODO: Margin
			var MARGINS = {
					top: 20,
					right: 20,
					bottom: 20,
					left: 50
				};

            var aryColors = [{"dark":"#499f17", "light":"#6dff19"},{"dark":"#ba490c", "light":"#ff7c35"},{"dark":"#047c8d", "light":"#14e0fd"},
                             {"dark":"#0b16a1", "light":"#5b66ff"},{"dark":"#05ae2a", "light":"#12ff46"},{"dark":"#a50515", "light":"#fd4b5d"},
                             {"dark":"#bcc703", "light":"#effd0e"},{"dark":"#ccb900", "light":"#fde60a"},{"dark":"#7b3e80", "light":"#d7c5d9"},
                             {"dark":"#aa6c42", "light":"#e5d3c6"}];
            
            var nRandom = Math.floor(Math.random() * 10);
            

			d3Service.d3().then(function(d3) {
				//console.info(element);
				
				var darkColor = aryColors[nRandom].dark, lightColor = aryColors[nRandom].light;
                var timeFormat = d3.time.format(attrs.xaxisformat);

				function generateAreaChart() {
					var minData = d3.min(data, function(d) { return d.value; });
					var maxData = d3.max(data, function(d) { return d.value; });
					
					
	        		var xMin = d3.min(data, function (datum) { return d3.min(datum, function (d) { return d.time; }) });
	        		var xMax = d3.max(data, function (datum) { return d3.max(datum, function (d) { return d.time; }) });
	        		var yMin = d3.min(data, function (datum) { return d3.min(datum, function (d) { return d.value; }) });
	        		var yMax = d3.max(data, function (datum) { return d3.max(datum, function (d) { return d.value; }) });
					
					
					var xScale = d3.scale.linear()
									.range([MARGINS.left, WIDTH - MARGINS.right])
									//.domain( d3.extent(data, function(d) { return d.time; }) );
									.domain([xMin, xMax]);
					
					// d3.extent for calculates minimum and maximum value in an array
					var yScale = d3.scale.linear()
									.range([HEIGHT - MARGINS.top, MARGINS.bottom])
									//.domain( d3.extent(data, function(d) { return d.value; }) );
									.domain([yMin, yMax]);
									/*.domain([d3.min(data, function(d) {
										return d.value;
									}), d3.max(data, function(d) {
									    return d.value;
									})])*/;


					var xAxis = d3.svg.axis()
									.scale(xScale)
									.orient("bottom")
			                        //.ticks(5)
									//.tickFormat(timeFormat);
			                        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d.time)); });
									// TODO ticks, tickFormatter

					var yAxis = d3.svg.axis()
									.scale(yScale)
									.orient("left")
			                        .ticks(5);
					

					var lineGen = d3.svg.line()
									.interpolate("linear")
									.x(function(d) {return xScale(d.time);})
									.y(function(d){return yScale(d.value);});

	                var area = d3.svg.area()
								.interpolate("linear")
								.x(function(d) { return xScale(d.time); })
								.y0(HEIGHT)
								.y1(function(d) { return yScale(d.value); });

	                var svg = d3.select(element[0])
	                			.append("svg")
	                			.attr("width", WIDTH)
								.attr("height", HEIGHT)
								.attr("transform","translate(" + MARGINS.left + "," + MARGINS.top + ")");
								//.attr("width", WIDTH + MARGINS.left + MARGINS.right)
								//.attr("height", HEIGHT  + MARGINS.top + MARGINS.bottom);
								//.append("g")
			                   	//.attr("transform","translate(" + MARGINS.left*2 + "," + MARGINS.top + ")")
			                	//.attr("onload","LoadHandler(evt)");
								//.append("g");
	                

	                svg.append("g")
	                    //.attr("transform", "translate(0," + HEIGHT + ")")
                        //.attr("class", "axis")
                        .attr("transform", "translate(0, "+(HEIGHT - MARGINS.bottom)+")")
	                    .call(xAxis);
	                

	                svg.append("g")
	                    //.attr("class", "axis")
	                	.attr("transform", "translate("+(MARGINS.left)+", 0)")
	                    .call(yAxis);
	                
	                /* below comment working for single line
	                svg.append("path")
		                .datum(data)
		                .style("fill", lightColor)
		                .attr("d", area);
	                

	                svg.append("path")
						//.attr("class", "line")
						.attr("d", lineGen(data))
						//.attr("stroke", function(d) {return colorData[rand].dark;})
						.attr("stroke", darkColor)
						.style("stroke-width", nLineWidth);
	                */
	                data.forEach(function(d, i) {
						svg.append("path")
			                .datum(d)
			                .style("fill", lightColor)
			                .attr("d", area);
	                

		                svg.append("path")
							//.attr("class", "line")
							.attr("d", lineGen(d))
							//.attr("stroke", function(d) {return colorData[rand].dark;})
							.attr("stroke", darkColor)
							.style("stroke-width", nLineWidth);
					});
				}
				
	            
				scope.$watch("chartdata", function(newValue, oldValue, scope) {
					if( newValue != undefined) {
						data = newValue;

						//timeFormat = d3.time.format(attrs.xaxisformat);

						var svg = d3.select(element[0]).select("svg").remove();
						
						generateAreaChart();
					}
				});
			});
			
			
        }
    };
}]);


// tried added for counters instead of 0 append break points between
appedoApp.directive('appedoMultiAreaChartDirective',['d3Service', '$timeout', 'ajaxCallService', 'getURLService', '$appedoUtils', 'apmModulesFactory', function(d3Service, $timeout, ajaxCallService, getURLService, $appedoUtils, apmModulesFactory){
    return {
        restrict: "AE",
        scope: {
        	chartdata: '=',
        	pushdata: '=',
        	loadevent: '&'
        	//yaxislabel: '@'
        },
        link: function(scope, element, attrs) {
	        d3Service.d3().then(function(d3) {
	        	var divisor;
	        	var path, data, xAxis, yAxis, area, mergeData;
	        	

                var colorData = [{"dark":"#a73f05", "light":"#d08f6b"}, {"dark":"#104a8d", "light":"#7aa1ce"}, {"dark":"#837704", "light":"#ead61e"}, 
                                 {"dark":"#7b3e80", "light":"#d7c5d9"}, {"dark":"#aa6c42", "light":"#e5d3c6"}, {"dark":"#3d7200", "light":"#89c346"}, 
                                 {"dark":"#c55204", "light":"#e57b33"} ];
                
                var rand = Math.floor(Math.random() * colorData.length);
                var timeFormat = d3.time.format(attrs.xaxisformat);
                var tooltipTimeFormat = d3.time.format("%Y-%b-%d %H:%M:%S");
                
                /* Not used below added by Divami hence commented */
/*                 
                function myRound(value, places) {
                	var multiplier = Math.pow(10, places);
                	return (Math.round(value * multiplier) / multiplier);
                }
                
*/
            	var tooltipLabel = attrs.tooltipLabel != undefined ? attrs.tooltipLabel : 'Value';
            	// parse boolean, notinuse
            	//var bLastOneHourData = attrs.lastOneHourData != undefined ? (attrs.lastOneHourData === "true") : false;
            	
    			var expressionHandler = scope.loadevent();
                
	            function generateAreaChartAsArrayInJSONFormart() {

					var darkColor = colorData[rand].dark, lightColor = colorData[rand].light;
					
					
					// `T` is time (x-axis) & `V` is value (y-axis) 
					// 
					var nCounterSetsLength = apmModulesFactory.getCounterSetsLength(data);
					if( nCounterSetsLength === 1 ){
						var dummyData = {};
						dummyData["T"] = d3.min(data[0], function(d) { return d.T; }) - 1000; 
						dummyData["V"] = 0;
						// unshift add elemnt at first in array
						data[0].unshift(dummyData);
						//data[0].push([dummyData]);
						
						//data[0] = data[0].sort(function(a,b) { return a.T - b.T; });
					}
	            	
	            	//data = data.sort(function(a,b) { return a.T - b.T; });

					var parentWidth ;
					var rightM = 8;
					var leftM = 8;
					var bisectDate = d3.bisector(function(d) { return d.T; }).left;
					var dotSize;
					var lineWidth;

	            	if (attrs.dotsize==null || attrs.dotsize==undefined) {
	            		dotSize = 1.5;
	                } else {
	            		dotSize=attrs.dotsize;
	                }

	            	if (attrs.linewith==null || attrs.linewith==undefined) {
	            		lineWidth = 2;
	                } else {
	                	lineWidth=attrs.linewith;
	                }
	            	
	                if (attrs.parrentnodeid==null || attrs.parrentnodeid=="undefined") {
	                	parentWidth=300;
	                } else {
	                	
	                	parentWidth=document.getElementById(attrs.parrentnodeid).offsetWidth;
	                	if(parentWidth>800){
	                		rightM = 15;
	                		leftM = 3;
	                	}
	                }

                    
	                var parentHt = 150;
	                //Fixed width does not go well with responsive design hence made as percentage of parent heigth
	                var margin = {top: parentHt*6/100, right: parentWidth*rightM/100, bottom: parentHt*20/100, left: parentWidth*leftM/100},
	                        width = parentWidth - margin.left - margin.right,
	                        height = parentHt - margin.top - margin.bottom, halfOfWidth = (width - margin.right) /2;

	                

	        		var xMin = d3.min(data, function (datum) { return d3.min(datum, function (d) { return d.T; }) });
	        		var xMax = d3.max(data, function (datum) { return d3.max(datum, function (d) { return d.T; }) });
	        		var yMin = d3.min(data, function (datum) { return d3.min(datum, function (d) { return d.V; }) });
	        		var yMax = d3.max(data, function (datum) { return d3.max(datum, function (d) { return d.V; }) });
	        		

	        		if(yMin==yMax){
	        			yMax=Math.ceil(Number(yMax)+Number(yMax)*5/100); // adding 5% of max value to ensure graph is within boundry
	        			if(Number(yMin)!=0){
		        			yMin=Number(yMin)-Math.ceil(Number(yMin)*5/100); // min value is reduced by 5% of min graph value to ensure boundry is intact
	        			}
	        		}

	                var x = d3.time.scale()
	                			//.range([0, width])
		                		.range([0, width - margin.right])
	                			.domain([xMin, xMax])
	                			//.clamp(true) 
	                			//.nice();
	                			//.domain(d3.extent(data, function(d) { return d.time; }));
	                
                    var y = d3.scale.linear()
                    			.range([height, 0])
                    			.domain([yMin, yMax])
	                			//.clamp(true) 
	                			//.nice();
                    			//.domain(d3.extent(data, function(d) { return d.value; }) );
       
					xAxis = d3.svg.axis()
							.scale(x)
							.orient("bottom")
							.ticks(5)
							.tickFormat(timeFormat);

					yAxis = d3.svg.axis()
							.scale(y)
							.orient("left")
							.ticks(5);

					area = d3.svg.area()
							.interpolate("linear")
							.x(function(d) { return x(d.T); })
							.y0(height)
							.y1(function(d) { return y(d.V); });

					var areaTop = d3.svg.area()
									.interpolate("linear")
									.x(function(d) { return x(d.T); })
									.y0(0)
									.y1(function(d) { return y(d.V); });

                    var line = d3.svg.line()
		                        .interpolate("linear")
		                        .x(function(d) {return x(d.T);})
		                        .y(function(d){return y(d.V);});
                    
                    var svg = d3.select("#" + attrs.id).append("svg")
		                        .attr("width", width + margin.left + margin.right)
		                        .attr("height", height + margin.top + margin.bottom)
		                        //.append("g")
		                        //.attr("transform","translate(" + margin.left*2 + "," + margin.top + ")")
		                        //.attr("transform","translate(" + margin.left*3/2 + "," + margin.top + ")")
		                    	//.attr("onload","LoadHandler(evt)");

                    svg	.append("g")
                        .attr("class", "axis")
                        //.attr("transform", "translate(0," + height + ")")
                        .attr("transform", "translate(" + margin.left*3/2 + "," +(height + 5)+ ")")
                        .call(xAxis);

                    svg	.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate("+margin.left*3/2+", "+(0+5)+")")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", (0-margin.left-margin.right))
                        .attr("x", (0-(height / 2)))
                        .style("text-anchor", "middle")
                        .text('');
/* working for sinlge line, or continues points
                    svg	.append("path")
                        .datum(data)
                        .style("fill", lightColor)
                        .attr("d", area);
                    
                    svg	.append("path")
	                  	.attr("class", "line")
	                  	.attr("d", line(data))
	                  	//.attr("stroke", function(d) {return colorData[rand].dark;})
	                  	.attr("stroke", darkColor)
	            	    .style("stroke-width", lineWidth);
*/

	                data.forEach(function(datum, i) {
	                	svg	.append("path")
	                        .datum(datum)
	                        .attr("transform", "translate("+margin.left*3/2+", "+(0+5)+")")
	                        .style("fill", lightColor)
	                        .attr("d", area);
                    
	                    svg	.append("path")
		                  	.attr("class", "line")
	                        .attr("transform", "translate("+margin.left*3/2+", "+(0+5)+")")
		                  	.attr("d", line(datum))
		                  	//.attr("stroke", function(d) {return colorData[rand].dark;})
		                  	.attr("stroke", darkColor)
		            	    .style("stroke-width", lineWidth);
	                });
                    
	                
                	if( attrs.linkstatus == "true" ){
                		data.forEach(function(datum, i) {
							svg	.selectAll("dot")
								.data(datum)
								.enter().append('circle')
								.style("cursor","pointer")
								.attr("cx",function(d) {return x(d.T);})
								.attr("cy",function(d){return y(d.V);})
								.attr("r", dotSize)
								//.attr("fill",function(d) {return colorData[rand].dark;})
								.attr("fill", darkColor)
								.append("title")
								.text(function(d) {
									return 'Time : '+timeFormat(new Date(d.T))+'\n'+ tooltipLabel +' : '+d.V;  
								});
							
							svg.selectAll("circle").on("click", function (d) {
								if(attrs.linkstatus=="true"){
									expressionHandler(d.T, d.V, attrs.hiddenparamkey != undefined ? d[attrs.hiddenparamkey]: '');
								}
							});
                		});
                	} else {
            			if(data.length>0){
							var focus = svg	.append("g")
											.attr("class", "focus")
											.style("display", "none");

							focus.append("circle")
								.attr("class", "y") 
								.attr("r", 4.5)
								.style("fill", darkColor)
								//.style("fill", 'none')
								//.style("stroke", function(d) {return colorData[rand].dark;});
								.style("stroke", darkColor);
								//.style("stroke-width", '2px');
		
						    // place the value at the intersection
						    focus.append("text")
						        .attr("class", "y1")
						        .style("stroke", "white")
						        .style("stroke-width", "3.5px")
						        .style("opacity", 0.8)
						        //.attr("dx", 8)
						        /*.attr("dy", "-.3em")*/
						        //.attr("dy", "-1.3em");
						    focus.append("text")
						        .attr("class", "y2")
						        //.attr("dx", 8)
						        /*.attr("dy", "-.3em")*/
						        //.attr("dy", "-1.3em");

						    // place the date at the intersection
						    focus.append("text")
						        .attr("class", "y3")
						        .style("stroke", "white")
						        .style("stroke-width", "3.5px")
						        .style("opacity", 0.8)
						        //.attr("dx", 8)
						        /*.attr("dy", "1em")*/
						        //.attr("dy", "0em");
						    
						    focus.append("text")
						        .attr("class", "y4")
						        //.attr("dx", 8)
						        /*.attr("dy", "1em")*/
						        //.attr("dy", "0em");

							svg	.append("rect")
								.attr("class", "overlay")
								.style("fill", "none")
								.style("pointer-events", "all")
								.attr("width", width)
								.attr("height", height)
		                        .attr("transform", "translate("+margin.left*3/2+", "+(0+5)+")")
								.on("mouseover", function() { focus.style("display", null); })
								.on("mouseout", function() { focus.style("display", "none"); })
								.on("mousemove", mousemove);
	            	  	}
                	}
	              
	            	function mousemove() {
	            		//data.forEach(function(datum, i) {
	            		
							var x0 = x.invert(d3.mouse(this)[0]), 
								i = bisectDate(mergeData, x0, 1),
								d0 = mergeData[i - 1],
								d1 = mergeData[i];/*,
								d = x0 - d0.T > d1.T - x0 ? d1 : d0;*/
							
							if ( d0 != undefined && d1 != undefined ) {
								d = x0 - d0.T > d1.T - x0 ? d1 : d0;	
							}
							
	            			/* tried instead of mergeData, use chart plooting array data
							var x0 = x.invert(d3.mouse(this)[0]),
								d = data.map(function(dataSet) {
							        var i = bisectDate(dataSet, x0, 1),
							            d0 = dataSet[i - 1],
							            d1 = dataSet[i];
							        return x0 - d0.T > d1.T - x0 ? d1 : d0;
							    })[0];
							*/
							
							
							// 
							// dy12../dy34.. In cond. y(d.V) > 30, `30` is considerd as height of tooltip
							var dxFocus = x(d.T) > halfOfWidth ? -158 : 8, dy12Focus = y(d.V) > 30 ? -21 : 18, dy34Focus = y(d.V) > 30 ? -3 : 34;
							var xTooltipValue = 'Time : '+timeFormat(new Date(d.T)), yTooltipValue = tooltipLabel+' : '+d.V;
							

							
/*							
							// tried working, focus nearest point click, might future use,
							svg.select("rect.overlay")
								.on("click", function() {
									console.info('rect.overlay rect.overlay rect.overlay');
									console.info('time: '+tooltipTimeFormat(new Date(d.T))+' <> value: '+d.V);
								});
*/
							focus.select("circle.y")/*
								.on("mouseover", function() {
									//focus.style("display", null);
									console.info('mouseover circle.y circle.y circle.y');
									d3.select(this)
										.style("cursor", "pointer");	
								})*/
								//.attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")");
								.attr("transform", "translate(" + (x(d.T) + margin.left*3/2) + "," + (y(d.V) + 5) + ")");



							focus.select("text.y1")
								.attr("x", dxFocus)
								.attr("y", dy12Focus)
							    //.attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
							    .attr("transform", "translate(" + (x(d.T) + margin.left*3/2) + "," + (y(d.V) + 5) + ")")
							    .text(yTooltipValue);
		
							focus.select("text.y2")
								.attr("x", dxFocus)
								.attr("y", dy12Focus)
							    //.attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
							    .attr("transform", "translate(" + (x(d.T) + margin.left*3/2) + "," + (y(d.V) + 5) + ")")
							    .text(yTooltipValue);
		
							focus.select("text.y3")
								.attr("x", dxFocus)
								.attr("y", dy34Focus)
							    //.attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
							    .attr("transform", "translate(" + (x(d.T) + margin.left*3/2) + "," + (y(d.V) + 5) + ")")
							    .text(xTooltipValue);
		
							focus.select("text.y4")
								.attr("x", dxFocus)
								.attr("y", dy34Focus)
							    //.attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
							    .attr("transform", "translate(" + (x(d.T) + margin.left*3/2) + "," + (y(d.V) + 5) + ")")
							    .text(xTooltipValue);
	            		//});
	              	}
	            }
	            
	            
				scope.$watch("chartdata", function(newValue, oldValue, scope) {
					if( newValue != undefined) {
						//console.info('$watch $watch $watch $watch $watch $watch 11122223333333333');
						//$timeout(function() {
							data = newValue;
							// TODO: instead of using mergeData for focus point, focus point based on chartdata itself 
							mergeData = d3.merge(data);
							
							timeFormat = d3.time.format(attrs.xaxisformat);

							var svg = d3.select("#" + attrs.id).select("svg").remove();
							
							generateAreaChartAsArrayInJSONFormart();
						//}, 0, false);
					}
				});

				scope.$watchCollection("chartdata", function(newValue, oldValue, scope) {
					if( newValue != undefined) {
						//console.info('$watchCollection $watchCollection $watchCollection $watch $watch $watch 11122223333333333');
						//$timeout(function() {
							data = newValue;
							/*
							// for last 1 hour 
							if ( bLastOneHourData ) {
								data = $appedoUtils.appendZeroAtFirst(data);
							}*/
							// TODO: instead of using mergeData for focus point, focus point based on chartdata itself 
							mergeData = d3.merge(data);
							
							timeFormat = d3.time.format(attrs.xaxisformat);

							var svg = d3.select("#" + attrs.id).select("svg").remove();
							
							generateAreaChartAsArrayInJSONFormart();
						//}, 0, false);
					}
				});

	       });
        }
    };
}]);


appedoApp.directive('appedoAreaChartDirectiveLoadTest',['d3Service', 'sessionServices', function(d3Service, sessionServices){
    return {
        restrict: "AE",
        scope: {
        	chartdata: '=',
        	pushdata: '=',
        	loadevent: '&'
        	//yaxislabel: '@'
        },
        link: function(scope, element, attrs) {
	        d3Service.d3().then(function(d3) {
	        	var data, xAxis, yAxis, area;
	        	var d3ChartTimeFormatForLT = JSON.parse(sessionServices.get("d3ChartTimeFormatForLT"));
                var colorData = [{"dark":"#a73f05", "light":"#d08f6b"}, {"dark":"#104a8d", "light":"#7aa1ce"}, {"dark":"#837704", "light":"#ead61e"}, 
                                 {"dark":"#7b3e80", "light":"#d7c5d9"}, {"dark":"#aa6c42", "light":"#e5d3c6"}, {"dark":"#3d7200", "light":"#89c346"}, 
                                 {"dark":"#c55204", "light":"#e57b33"} ];
	        	
                var rand = Math.floor(Math.random() * colorData.length);
                var timeFormat = d3.time.format(attrs.xaxisformat);

            	var tooltipLabel = attrs.tooltipLabel != undefined ? attrs.tooltipLabel : 'Value';
            	
    			var expressionHandler = scope.loadevent();

            	var parentWidth ;
            	var rightM = 8;
            	var leftM = 8;
            	var bisectDate = d3.bisector(function(d) { return d.T; }).left;
            	var dotSize;
            	var lineWidth;
            	if (attrs.dotsize==null || attrs.dotsize==undefined)
                {
            		dotSize = 1.5;
                }else{
            		dotSize=attrs.dotsize;
                }

            	if (attrs.linewith==null || attrs.linewith==undefined)
                {
            		lineWidth = 2;
                }else{
                	lineWidth=attrs.linewith;
                }
            	
                if (attrs.parrentnodeid==null || attrs.parrentnodeid=="undefined")
                {
                	parentWidth=300;
                }
                else 
                {
                	parentWidth=document.getElementById(attrs.parrentnodeid).offsetWidth;
                	if(parentWidth>800){
                		rightM = 15;
                		leftM = 3;
                	}
                }
                var parentHt = 150;
                //Fixed width does not go well with responsive design hence made as percentage of parent heigth
                var margin = {top: parentHt*6/100, right: parentWidth*rightM/100, bottom: parentHt*20/100, left: parentWidth*leftM/100},
                        width = parentWidth - margin.left - margin.right,
                        height = parentHt - margin.top - margin.bottom, halfOfWidth = (width - margin.right) /2;

	            function generateAreaChartAsArrayInJSONFormart() {
	            	
	            	if(data.length==1){
	            		var dummyData={};
	            		dummyData["T"] = data[0].T  - (1000 * 2);
	            		dummyData["V"] = 0;

						data.unshift(dummyData);
	            	}
	            	
	            	//data = data.sort(function(a,b) { return a.T - b.T; });
	                var minData = d3.min(data, function(d) { return d.V; });
                    var maxData = d3.max(data, function(d) { return d.V; });
                    
                    maxData=Math.ceil(Number(maxData)+Number(maxData)*5/100); // adding 5% of max value to ensure graph is within boundry
                    minData=Number(minData)-Math.ceil(Number(minData)*5/100); // min value is reduced by 5% of min graph value to ensure boundry is intact
                    
	                var x = d3.time.scale()
	                		.range([0, width - margin.right]);

                    var y = d3.scale.linear()
                        .range([height, 0]);

                    x.domain(d3.extent(data, function(d) { return d.T; }));
                    y.domain([minData, maxData]);
	                   
                   xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .ticks(5)
                        .tickFormat(timeFormat);

                   yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left").ticks(5);

                    area = d3.svg.area()
                        .interpolate("linear")
                        .x(function(d) { return x(d.T); })
                        .y0(height)
                        .y1(function(d) { return y(d.V); });
                        
                    var areaTop = d3.svg.area()
                        .interpolate("linear")
                        .x(function(d) { return x(d.T); })
                        .y0(0)
                        .y1(function(d) { return y(d.V); });

                    var line = d3.svg.line()
                        .interpolate("linear")
                        .x(function(d) {return x(d.T);})
                        .y(function(d){return y(d.V);});
                    
                    var svg = d3.select("#" + attrs.id).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform","translate(" + margin.left * 3 / 2+ "," + margin.top + ")")
                    	.attr("onload","LoadHandler(evt)");
                    
                    svg.append("g")
                        .attr("class", "axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    svg.append("g")
                        .attr("class", "axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", (0-margin.left-margin.right))
                        .attr("x", (0-(height / 2)))
                        .style("text-anchor", "middle")
                        .text('');

                    svg.append("path")
		                        .datum(data)
		                        .style("fill", colorData[rand].light)
		                        .attr("d", area);
                    
                    svg.append("path")
                  	.attr("class", "line")
                  	.attr("d", line(data))
                  	.attr("stroke", function(d) {return colorData[rand].dark;})
            	    .style("stroke-width", lineWidth);
            	  
	              if( attrs.linkstatus == "true" ){
	            	  
	            	  svg.selectAll("dot")
		                .data(data)
						.enter().append('circle')
						.style("cursor","pointer")
						.attr("cx",function(d) {return x(d.T);})
						.attr("cy",function(d){return y(d.V);})
						.attr("r", dotSize)
						.attr("fill",function(d) {return colorData[rand].dark;})
						.append("title")
						.text(function(d) {
							var returnValue;
							for (var key in d) {
								if(key !="V"){
									if(returnValue==undefined){
										if(key == "T"){
											returnValue = 'Time : ' + timeFormat(new Date(d[key]));
										}else{
											returnValue = key + ' : ' + d[key];
										}
									}else{
										if(key == "T"){
											returnValue = returnValue + '\n' +'Time : ' + timeFormat(new Date(d[key]));
										}else{
											returnValue = returnValue + '\n' + key + ' : ' + d[key];
										}
									}
								}
							}
							return returnValue;  
						});
          		
						svg.selectAll("circle").on("click", function (d) {
							if(attrs.linkstatus=="true"){
								if(Number(attrs.chartdurationtype) < (d3ChartTimeFormatForLT.length-1)){
									expressionHandler(attrs.chartdurationtype,d.T);
								}
							}
						});
	              }else{
	            	 
	            	  	if(data.length>0){
							var focus = svg.append("g")
							.attr("class", "focus")
							.style("display", "none");
						
							focus.append("circle")
								.attr("class", "y") 
								.attr("r", 4.5)
								.style("fill", colorData[rand].dark)
								.style("stroke", function(d) {return colorData[rand].dark;});
		
						    // place the value at the intersection
						    focus.append("text")
						        .attr("class", "y1")
						        .style("stroke", "white")
						        .style("stroke-width", "3.5px")
						        .style("opacity", 0.8)
						    focus.append("text")
						        .attr("class", "y2")

						    // place the date at the intersection
						    focus.append("text")
						        .attr("class", "y3")
						        .style("stroke", "white")
						        .style("stroke-width", "3.5px")
						        .style("opacity", 0.8)
						    focus.append("text")
						        .attr("class", "y4")

							svg.append("rect")
						      .attr("class", "overlay")
								.style("fill", "none")
								.style("pointer-events", "all")
						       .attr("width", width)
		                       .attr("height", height)
						      .on("mouseover", function() { focus.style("display", null); })
						      .on("mouseout", function() { focus.style("display", "none"); })
						      .on("mousemove", mousemove);
	            	  	}
	              }
	              
	              function mousemove() {
					    var x0 = x.invert(d3.mouse(this)[0]),
					    	i = bisectDate(data, x0, 1),
					    	d0 = data[i - 1],
					    	d1 = data[i];

						if ( d0 != undefined && d1 != undefined ) {
							d = x0 - d0.T > d1.T - x0 ? d1 : d0;	
						}
						
						var dxFocus = x(d.T) > halfOfWidth ? -158 : 8, dy12Focus = y(d.V) > 30 ? -21 : 18, dy34Focus = y(d.V) > 30 ? -3 : 34;
						var xTooltipValue = 'Time : '+timeFormat(new Date(d.T)), yTooltipValue = tooltipLabel+' : '+d.V;
							
						focus.select("circle.y")
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")");

						focus.select("text.y1")
							.attr("dx", dxFocus)
							.attr("dy", dy12Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(yTooltipValue);

						focus.select("text.y2")
							.attr("dx", dxFocus)
							.attr("dy", dy12Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(yTooltipValue);

						focus.select("text.y3")
							.attr("dx", dxFocus)
							.attr("dy", dy34Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(xTooltipValue);

						focus.select("text.y4")
							.attr("dx", dxFocus)
							.attr("dy", dy34Focus)
						    .attr("transform", "translate(" + x(d.T) + "," + y(d.V) + ")")
						    .text(xTooltipValue);
	              	}
	            }
	            
				scope.$watch("chartdata", function(newValue, oldValue, scope) {
					if( newValue != undefined) {
						data = [];
						data = newValue;
						timeFormat = d3.time.format(attrs.xaxisformat);
						var svg = d3.select("#" + attrs.id).select("svg").remove();
						if(data.length>0){
							generateAreaChartAsArrayInJSONFormart();
						}else{
							noData(attrs.id,parentWidth,parentHt);
						}
					}
				});
	       });
        }
    };
}]);

appedoApp.directive('appedoMultiLineChartDirectiveLoadTest',['d3Service', 'sessionServices', function(d3Service, sessionServices){
    return {
        restrict: "AE",
        scope: {
        	chartdata: '=',
        	loadevent: '&'
        },
        link: function(scope, element, attrs) {
        	var expressionHandler = scope.loadevent();
        d3Service.d3().then(function(d3) {
        	var timeFormat = d3.time.format(attrs.xaxisformat);
            var data=[];
        	var d3ChartTimeFormatForLT = JSON.parse(sessionServices.get("d3ChartTimeFormatForLT"));
        	var parentWidth ;
        	var dotSize;
        	if (attrs.dotsize==null || attrs.dotsize==undefined)
            {
        		dotSize = 3.5;
            }else{
        		dotSize=attrs.dotsize;
            }
            if (attrs.parrentnodeid==null || attrs.parrentnodeid=="undefined")
            {
            	parentWidth=300;
            }
            else 
            {
            	
            	parentWidth=document.getElementById(attrs.parrentnodeid).offsetWidth;
            }
            
            var parentHt = 150;
            
            //Fixed width does not go well with responsive design hence made as percentage of parent heigth
            var margin = {top: parentHt*6/100, right: parentWidth*15/100, bottom: parentHt*20/100, left: parentWidth*8/100},
                    width = parentWidth - margin.left - margin.right,
                    height = parentHt - margin.top - margin.bottom ;

            function generateMultiLineChart()
            {   
            		var x = d3.time.scale()
            		    .range([0, width]);

            		var y = d3.scale.linear()
            		    .range([height, 0]);

            		var color = d3.scale.category10();

            		var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(5)
                    .tickFormat(timeFormat);
            		
            		var yAxis = d3.svg.axis()
            		    .scale(y)
            		    .orient("left");

            		var line = d3.svg.line()
            		    .interpolate("linear")
            		    .x(function (d) {
            		    return x(d.Date);
            		})
            		    .y(function (d) {
            		    return y(d.Value);
            		});

            		var svg = d3.select("#" + attrs.id).append("svg")
            		    .attr("width", width + margin.left + margin.right)
            		    .attr("height", height + margin.top + margin.bottom)
            		    .append("g")
            		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            		color.domain(data.map(function (d) { return d.City+'-'+d.loadgen_name; }));

            		data.forEach(function (kv) {
            		    kv.Data.forEach(function (d) {
            		        d.Time = new Date(d.Date);
            		        d.Name = kv.City+'-'+kv.loadgen_name;
            		        d.IP = kv.loadgen_name;
            		    });
            		});
            		
            		
            		var cities = data;

            		var minX = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Time; }) });
            		var maxX = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Time; }) });
            		var minY = d3.min(data, function (kv) { return d3.min(kv.Data, function (d) { return d.Value; }) });
            		var maxY = d3.max(data, function (kv) { return d3.max(kv.Data, function (d) { return d.Value; }) });

            		maxY=Math.ceil(Number(maxY)+Number(maxY)*5/100); // adding 5% of max value to ensure graph is within boundry
                    minY=Number(minY)-Math.ceil(Number(minY)*5/100); // min value is reduced by 5% of min graph value to ensure boundry is intact

            		x.domain([minX, maxX]);
            		y.domain([minY, maxY]);

            		var legend = svg.selectAll('g')
            	      .data(cities)
            	      .enter()
            	    .append('g')
            	      .attr('class', 'legend');
            	    
            	  legend.append('rect')
            	      .attr('x', width - 0)
            	      .attr('y', function(d, i){ return i *  20;})
            	      .attr('width', 10)
            	      .attr('height', 10)
            	      .style('fill', function(d) { 
            	        return color(d.City+'-'+d.loadgen_name);
            	      });
            	      
            	  legend.append('text')
            	      .attr('x', width + 12)
            	      .attr('y', function(d, i){ return (i *  20) + 9;})
            	      .text(function(d){ return d.City; });

            		svg.append("g")
            		    .attr("class", "x axis")
            		    .attr("transform", "translate(0," + height + ")")
            		    .call(xAxis);

            		svg.append("g")
	                    .attr("class", "axis")
	                    .call(yAxis)
	                    .append("text")
	                    .attr("transform", "rotate(-90)")
	                    .attr("y", (0-margin.left-margin.right))
	                    .attr("x", (0-(height / 2)))
	                    .style("text-anchor", "middle")
	                    .text('Count');

            		var city = svg.selectAll(".city")
            		    .data(cities)
            		    .enter().append("g")
            		    .attr("class", "city");

            		city.append("path")
            		    .attr("class", "line")
            		    .attr("d", function (d) {
	            		    return line(d.Data);
	            		})
            		    .style("stroke", function (d) {
	            		    return color(d.City+'-'+d.loadgen_name);
	            		});

            		city.append("text")
            		    .datum(function (d) {
	            		    return {
	            		        name: d.City,
	            		        date: d.Data[d.Data.length - 1].Time,
	            		        value: d.Data[d.Data.length - 1].Value
	            		    };
	            		})
            		    .attr("transform", function (d) {
            		    return "translate(" + x(d.date) + "," + y(d.value) + ")";
            		});

            		city.selectAll('circle')
						.data(function(d){ return d.Data})
						.enter().append('circle')
						.style("cursor","pointer")
						.attr("cx", function(d) { return x(d.Time)})
						.attr("cy", function(d) { return y(d.Value)})
						.attr("r", dotSize)
						.style("fill", function(d) { return color(d.Name)})
						.append("title")
						.text(function(d) {
							var returnValue;
							var checkKey = ["Value", "Time", "Name"]; 
							for (var key in d) {
								if(checkKey.indexOf(key)<0){
									if(returnValue==undefined){
										if(key == "Date"){
											returnValue = 'Time : ' + timeFormat(new Date(d[key]));
										}else{
											returnValue = key + ' : ' + d[key];
										}
									}else{
										if(key == "Date"){
											returnValue = returnValue + '\n' +'Time : ' + timeFormat(new Date(d[key]));
										}else{
											returnValue = returnValue + '\n' + key + ' : ' + d[key];
										}
									}
								}
							}
							return returnValue; 
						});
	            		
            		city.selectAll("circle").on("click", function (d) {
						if(attrs.linkstatus=="true"){
							if(Number(attrs.chartdurationtype) < (d3ChartTimeFormatForLT.length-1)){
								expressionHandler(attrs.chartdurationtype,d.Date);
							}
						}
					});
            }

            scope.$watch("chartdata", function(newValue, oldValue, scope) {
				if( newValue != undefined) {
					data = [];
					data = newValue;
					timeFormat = d3.time.format(attrs.xaxisformat);
					var svg = d3.select("#" + attrs.id).select("svg").remove();
					if(data.length>0){
						var dataListCount=0;
						data.forEach(function (kv) {
            		    	if(kv.Data!=null){
            		    		dataListCount = Number(dataListCount)+1;
            		    	}
	            		});
						if(Number(dataListCount)>0){
							generateMultiLineChart();
						}else{
							noData(attrs.id,parentWidth,parentHt);
						}
					}else{
						noData(attrs.id,parentWidth,parentHt);
					}
				}
			});
            
       });
    }};
}]);

function noData(id, width, height ){
    var svg = d3.select("#" + id).append("svg")
    .attr("width", width)
    .attr("height", height);
    
    svg.append('text').text('No Data')
    .attr('x', (width)/4)
    .attr('y', (height)/3)
    .attr("class","apd-rbtrgfnfmly font_18 clr3569a");
}

