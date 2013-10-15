Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
       var that = this;
       this._series = [];
       var c = Ext.create('Ext.Container', {
            items: [
                {
                    xtype  : 'rallybutton',
                    text      : 'reload with new data',
                    id: 'b1',
		    margin: 10,
                    handler: function() {
                        that._updateChart();
                    }
                }
            ]
    });
       var container = Ext.create('Ext.Container', {
	id:'container',
	border: 5,
	style: {
	    borderColor: 'red',
	    borderStyle: 'solid'
	},
	height: 450,
	width:600
       });
       this.add(c);
       this.add(container);
       this._play();
       

    },
    _play:function(){
        this._data = [[],[]];
        var rounds = 10;
        var players = 2;
        var playersArr = ['Player 1', 'Player 2'];
        this._moves = [[],[]];
        var notRandom = ['keep going','swerve','swerve','swerve','swerve'];
        for (var p=0;p<players;p++) {
            for (var i = 0; i<rounds; i++) {
                var x = Math.floor(Math.random()*notRandom.length);
                this._moves[p].push(notRandom[x]);
                if (p===players-1) { 
                   if ((this._moves[p][i] == "keep going")&&(this._moves[p-1][i] === "keep going")) {
                    this._data[p][i]=[i, -10,this._moves[p][i]];
                    this._data[p-1][i]=[i, -10,this._moves[p-1][i]];
                    
                   }
                   else if ((this._moves[p][i] == "swerve")&&(this._moves[p-1][i] === "keep going")) {
                    this._data[p][i]=[i, -2,this._moves[p][i]];
                    this._data[p-1][i]=[i, 2,this._moves[p-1][i]];
                    
                   }
                   else if ((this._moves[p][i] == "keep going")&&(this._moves[p-1][i] === "swerve")) {
                    this._data[p][i]=[i, 2,this._moves[p][i]];
                    this._data[p-1][i]=[i, -2,this._moves[p-1][i]];
                   }
                   else if ((this._moves[p][i] == "swerve")&&(this._moves[p-1][i] === "swerve")) {
                    this._data[p][i]=[i, 0,this._moves[p][i]];
                    this._data[p-1][i]=[i, 0,this._moves[p-1][i]];
                   }
                }    
            }
        }
        this._series.push({
		    	name: playersArr[0],
		    	data: this._data[0],
                        color: 'rgba(223, 83, 83, .5)'
				})
        this._series.push({
		    	name: playersArr[1],
		    	data: this._data[1],
                        color: 'rgba(119, 152, 191, .5)'
				})
        
        console.log("series", this._series);
        this._makeChart();
        
    },
    
    
     _updateChart:function(){
       if (this.down("#chart")) {
        console.log("chart exists. Removing chart...");
	this.down("#chart").removeAll(); //not enough. series and data has to be emptied in the next two lines
        this._series.length = 0;
        this._data.length = 0;
        this._play();
       } 
       
    },
    
    _makeChart:function(){
        this.down('#container').add(
        {
            xtype: 'rallychart',
            viewConfig: {
                loadMask: false
            },
            id: 'chart',
            height: 800,
            chartConfig: {
                chart:{
		type: 'scatter',
                zoomType: 'xy'
		},
		title:{
		    text: 'The Game Of Chicken'
		},
		xAxis: {
                    title: {
                        enabled: true,
                        tickInterval: 1,
                        text: 'Rounds'
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                allowDecimals: false,
                },
		yAxis:{
		    title: {
                        text: 'Payoff'
                },
                allowDecimals: false
		},
                tooltip: {
                        formatter: function() {
                            var info = this.series.name  + '<b> ' + this.point.config[2]  + '</b>' + '<br> ' + ' ' + 'round: <b>'+ this.x +'</b> payoff <b>'+ this.y +'</b>';
                            return info;
                        }
        },
                plotOptions: {
                    scatter: {
                        marker: {
                            radius: 10,
                            states: {
                                hover: {
                                    enabled: true,
                                    lineColor: 'rgb(100,100,100)'
                                }
                            }
                        },
                        states: {
                            hover: {
                                marker: {
                                    enabled: false
                                }
                            }
                        }
                    }
                },
            },
                            
            chartData: {
                series: this._series
            }
          
        });
	console.log('chart height', this.down('#chart').height);
	console.log('container height', this.down('#container').height);
        this.down('#chart')._unmask();
	
    }
});