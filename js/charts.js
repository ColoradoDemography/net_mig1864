//Net Migration by Age main functions   Plotly Version
//Things to do 
//add data download proc
//add png download



//DATA MANIPULATION FUNCTIONS

//extendAxis extends the data array values to nearest whole 1000...
function extendAxis(indata){
		var MinVal = Number(indata[0]);
		var MaxVal = Number(indata[1]);

	// Adjusting MinVal
	if(Math.abs(MinVal) > 10000){
			var adjMin = (Math.floor(MinVal/10000)*10000) ;
	} else if(Math.abs(MinVal) > 1000){
			var adjMin = (Math.floor(MinVal/1000)*1000);
	  } else if(Math.abs(MinVal) > 100) {
			var adjMin = (Math.floor(MinVal/100)*100);
	  } else {
			var adjMin = (Math.floor(MinVal/10)*10);
	   };
	   
	// Adjusting MaxVal
	if(Number(MaxVal) > 10000){
			var adjMax = (Math.ceil(MaxVal/10000)*10000);
	} else if(Number(MaxVal) > 1000){
			var adjMax = (Math.ceil(MaxVal/1000)*1000);
	  } else if(Number(MaxVal) > 100) {
			var adjMax = (Math.ceil(MaxVal/100)*100);
	  } else {
			var adjMax = (Math.ceil(MaxVal/10)*10);
	   };
	var outArray = [adjMin,adjMax];
	return(outArray);
}

//captionTxt specifies the chart caption

function captionTxt(posY) {

	//Date Format
   var formatDate = d3.timeFormat("%m/%d/%Y");
   
   var capTxt = "Data and Visualization by the State Demography Office, Print Date: "+ formatDate(new Date);

return(capTxt);
}; //End of captionTxt

//function domValues gathers the selected values from the DOM objects (in this case, DOM select objects)
function domValues() {
	
	var select = document.getElementById('selCty');
	//County name
	var cty = [...select.selectedOptions].map(option => option.text);
	//County FIPS Code				
	var fips = [...select.selectedOptions].map(option => option.value);

	var select = document.getElementById('series');
	//data series value
	var series = [...select.selectedOptions].map(option => option.value);

	var select = document.getElementById('chartSel');
	//Chart type
	var chart = [...select.selectedOptions].map(option => option.value);
	
    return [cty, fips, series, chart];
}

//CHART DATA FUNCTIONS
//genChartPromise Creates execures promises and created charts

//genDownloadCountPromise Creates execures promises and downloads data

 
//DATA AND IMAGE DOWNLOAD FUNCTIONS
function dataDownload(indata){

	var varArray = domValues();
//Building FileName
	var FileName = "Net Migration by Year "
	if(varArray[0].length == 1) {
	FileName = FileName + varArray[0][0];
   } else { 
	   for (i = 1; i <= varArray[0].length; i++){
			 FileName = FileName + " " + varArray[0][i-1];
		 }
       };
	 FileName = FileName + ".csv";
//Filtering data and output
	var dataOut = indata.filter(d => varArray[1].includes(d.fips));
	debugger;
 	exportToCsv(FileName, dataOut);
}; //end of dataDownload


function exportToCsv(filename, rows) {
        var csvFile = d3.csvFormat(rows);

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };


function imageDownload(outFileName,dimChart,chartType) {

if(chartType == 0) {
	var count_node = d3.select("svg").node();
	count_node.setAttribute("viewBox", "0 0 925 500");
	saveSvgAsPng(count_node, outFileName);
	updateCountChart(dimChart);
} else if(chartType == 1) {
	var pct_node = d3.select("svg").node();
	pct_node.setAttribute("viewBox", "0 0 925 500");
	saveSvgAsPng(pct_node, outFileName);
	updatePCTChart(dimChart);
} else {
	var diff_node = d3.select("svg").node();
	diff_node.setAttribute("viewBox", "130 0 925 500");
	saveSvgAsPng(diff_node, outFileName);
	updateDiffChart(dimChart);
};
}; //End of imageDownload


//CHART FUNCTIONS

//updateCountChart reads information from the dropdowns, updates the title block and generates the updated static chart
function updateCountChart(dimChart,indata) {

var formatDate = d3.timeFormat("%m/%d/%Y");
var varArray = domValues();

var plotdata = indata.filter(d => varArray[1].includes(d.fips))  //Selecting counties by fips code


// Removes the chart

var graph = d3.select("svg").remove();
//Building Chart Title and filename

var titStr = "Net Migration by Year: ";
if(varArray[0].length == 1) {
	titStr = titStr + varArray[0][0];
   } else { 
	   for (i = 1; i <= varArray[0].length; i++){
		 if(i == varArray[0].length){
			 titStr = titStr + " and " + varArray[0][i-1];
		 } else {
		if (varArray[0].length == 2){
			titStr = titStr +  varArray[0][i-1] + " ";
		} else {
          titStr = titStr +  varArray[0][i-1] + ", ";
		 }
       }
	   }
   }; 
//Creating second line of title
   if(varArray[2] == "total"){
          titStr = titStr + "<br>Total Population Counts";
   } else if(varArray[2] == "total_rate") {
          titStr = titStr + "<br>Total Population Rate per 100";
   } else if(varArray[2] == "age_1864") {
	      titStr = titStr + "<br>Working Age Population Counts (Age 18-64)";
   } else {
	      titStr = titStr + "<br>Working Age Population Rate per 100 (Age 18-64)";
     };

//Caption String
var captionSTR = "Data and Visualization by the Colorado State Demography Office, Print Date: " + formatDate(new Date);
 

//building traces for charts


if(varArray[3] == "bar") {
	chType = "bar";
} else {
	chType = "lines+markers"
};

//assigning traces 
var ArrLen = varArray[0].length;
var dataArr = new Array(ArrLen);
for(j = 0; j < ArrLen; j++){
	if(ArrLen == 1){
		cname = varArray[0][0];
	} else{
		cname = varArray[0][j];
	};
	
var seldata = plotdata.filter(function(d) {return d.county == cname;});
if(varArray[2] == "age_1864_rate"){
	var seldata = plotdata.filter(function(d) {return d.year >= 1990;});
}
var xval = [];
for(var i=0; i < seldata.length; i++){
          xval.push(seldata[i]['year']);
       };

var yval = [];
for(var i=0; i < seldata.length; i++){
	   if(varArray[2] == "total") {
          yval.push(seldata[i]['netmigration_total']);
       } else if(varArray[2] == "total_rate") {
          yval.push(seldata[i]['rate_total']);
       } else if (varArray[2] == "age_1864") {
	      yval.push(seldata[i]['netmigration_1864']);
	   } else {
	      yval.push(seldata[i]['rate_1864']);
     };
       };

var ctyname = [];
for( var i = 0; i < seldata.length; i++) {
	ctyname.push(seldata[i]['county']);
    };
	

  dataArr[j] = {
        "type": chType,
        "x": xval,
        "y": yval,
		"name" : cname,
		//"text" : ctyname,
		     };
};  //end Trace Loop


var layout = {
			title: titStr,
			barmode: 'group',
			showlegend: true,
			annotations : [
			{text :captionSTR, 
                            xref : 'paper', 
							x : 0,
                            yref : 'paper', 
							y : -0.25,
                            align : 'left', 
							showarrow : false
			}
			]
			};

Plotly.newPlot('chart', dataArr, layout, {displayModeBar: true})

 
}; //updateCountChart
