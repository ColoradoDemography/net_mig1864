function PromiseTest(FIPS,YEAR,CTY){
//FIPS is a county-level FIPS code  (65 values)  value taken from a drop down on the main page
//YEAR is a year value between 2001 and 2019  value taken from a drop down on the main page
//CTY is a county Name string e.g. "Denver County"  

//Formats
var zero3 = d3.format("03d");
var zero5 = d3.format("05d");
 
var boundaryStr = "https://gis.dola.colorado.gov/lookups/wage_bound?county=" + FIPS + "&year=" + YEAR;
var jobsdataStr = "https://gis.dola.colorado.gov/lookups/jobs?county=" + eval(FIPS) + "&year=" + YEAR;
var wagedataStr = "https://gis.dola.colorado.gov/lookups/wage?county="+ FIPS + "&year=" + YEAR;
 d3.json(jobsdataStr).then(function(jobsData){
	 console.log(jobsData);
	 jobsData.forEach(function(d){
		  d.area_code = zero3(d.area_code);
		  d.sector_id = zero5(d.sector_id);
		  d.sector_name = d.sector_name;
		  d.population_year = d.population_year;
		  d.total_jobs = +d.total_jobs;
	 });
	 d3.json(wagedataStr).then(function(wageData){
		console.log(wageData);
		var chartData = buildData(jobsData,wageData); //These two function calls create the data set that will be charted
        var chartData2 = genData(chartData);
		console.log(chartData2);
		d3.json(boundaryStr).then(function(tabData){
		  genCountChart(chartData2,tabData,CTY,YEAR); //Generates a bar chart
		});
	 });
 });
 };  //end PromiseTest
 
//initialChart works, this  is the first run 
function initialChart() {  


var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var seldYEAR = eval(d3.select("#selYear").property('value'))

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};

PromiseTest(seldFIPS, seldYear, seldCTY);
 
}; // initialChart

//updateCountChart DSoes not work.  In this case, PromiseTest is run, but the promises are not invoked
function updateCountChart() {
debugger;

var seldCTY = d3.select('#selCty option:checked').text();  //selCty is a dropdown on the main page
var seldFIPS = switchFIPS(seldCTY);    //switchFIPS returns the FIPS code from the county text
var seldYEAR = eval(d3.select("#selYear").property('value'));  //selYear is a dropdown on the main page

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};
// Removes the chart

var graph = d3.select("svg").remove();

PromiseTest(seldFIPS, seldYear, seldCTY);
 
}; //updateCountChart