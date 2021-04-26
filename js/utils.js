//UTILITY FUNCTIONS

function hideDD() { //Hides the Custom Dropdowns
 document.getElementById("begLabel").style.visibility = "hidden";
  document.getElementById("endLabel").style.visibility = "hidden";
  document.getElementById("begYear").disabled = true;
  document.getElementById("endYear").disabled = true;
  document.getElementById("begYear").style.visibility = "hidden";
  document.getElementById("endYear").style.visibility = "hidden";
}; // end of hideDD

function showDD(yrs) {
debugger;
	   document.getElementById("begLabel").style.visibility = "visible";
       document.getElementById("endLabel").style.visibility = "visible";
	   document.getElementById("begYear").style.visibility = "visible";
       document.getElementById("endYear").style.visibility = "visible";
       document.getElementById("begYear").disabled = false;
	   document.getElementById("endYear").disabled = false;
	   
	   //Update Dropdowns
	   d3.select("#begYear")
			.selectAll('option')
			.data(yrs)
			.enter()
			.append('option')
			.attr('value', function(d) {return d;}) 
			.text(function(d) {return d;});
	   d3.select("#endYear")
			.selectAll('option')
			.data(yrs)
			.enter()
			.append('option')
			.attr('value', function(d) {return d;}) 
			.text(function(d) {return d;});
}; //end of showDD
//Join function from http://learnjsdata.com/combine_data.html

function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
}

//genData processes the data for the static chart
function genData(indata) {  

// Creating label array  
  var barLabels = [ { 'sector_id' : '00000', 'job_title' : 'Total Jobs'},
                    { 'sector_id' : '01000', 'job_title' : 'Agriculture'},
					{ 'sector_id' : '02000', 'job_title' : 'Mining'},
					{ 'sector_id' : '03000', 'job_title' : 'Utilities'},
					{ 'sector_id' : '04000', 'job_title' : 'Construction'},
					{ 'sector_id' : '05000', 'job_title' : 'Manufacturing'},
					{ 'sector_id' : '06000', 'job_title' : 'Wholesale Trade'},
					{ 'sector_id' : '07000', 'job_title' : 'Retail Trade'},
					{ 'sector_id' : '08000', 'job_title' : 'Transportation and Warehousing'},
					{ 'sector_id' : '09000', 'job_title' : 'Information'},
					{ 'sector_id' : '100000', 'job_title' : 'Financial Activities'},
					{ 'sector_id' : '10150', 'job_title' : 'Real Estate'},
					{ 'sector_id' : '11000', 'job_title' : 'Professional and Technical Services'},
					{ 'sector_id' : '11025', 'job_title' : 'Management of Companies '},
					{ 'sector_id' : '11050', 'job_title' : 'Administration and Waste'},
					{ 'sector_id' : '12000', 'job_title' : 'Private Education'},
					{ 'sector_id' : '12015', 'job_title' : 'Health Services'},
					{ 'sector_id' : '13000', 'job_title' : 'Arts, Entertainment & Recreation'},
					{ 'sector_id' : '13015', 'job_title' : 'Accommodation and Food'},
					{ 'sector_id' : '14000', 'job_title' : 'Other Services'},
					{ 'sector_id' : '15010', 'job_title' : 'Federal Government'},
					{ 'sector_id' : '15014', 'job_title' : 'Military'},
					{ 'sector_id' : '15020', 'job_title' : 'State Government'},
					{ 'sector_id' : '15030', 'job_title' : 'Local Government'}];
					
var barColors = [ {'category' : 'Low', 'bar_color' : '#D85F02'},
                  {'category' : 'Mid', 'bar_color' : '#757083'},
				  {'category' : 'High', 'bar_color' : '#1B9E77'}
				  ];
				  
//joining label array to data set
var outdata = join(barLabels,indata,"sector_id","sector_id",function(dat,col){
            return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: dat.county,
			   job_title: (col !== undefined) ? col.job_title : null,
			   population_year: dat.population_year,
			   total_jobs: dat.total_jobs,
			   category : dat.category
			   };
			   }).filter(function(d) {return d.job_title != null;})
			     .filter(function(d) {return d.total_jobs > 0;})
				 .filter(function(d) {return d.sector_id != "00000";});
				 
var outdata = join(barColors,outdata,"category","category", function(dat,col){
           return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: dat.county,
			   job_title: dat.job_title,
			   population_year: dat.population_year,
			   total_jobs: dat.total_jobs,
			   category : dat.category,
			   bar_color: (col !== undefined) ? col.bar_color : null  
			   };
			   }).filter(function(d) {return d.job_title != null;})
			     .filter(function(d) {return d.total_jobs > 0;});

//  sorting data in descending order

outdata.sort(function(a, b){ return d3.descending(+a['total_jobs'], +b['total_jobs']); })

return outdata;
} //end of genData

//genPctData calculates percentage from processed data...
function genPctData(indata,jobsdata){
var jobsN = +jobsdata[0].sum_jobs;
for(i = 0; i < indata.length; i++) {
   indata[i]["pct_jobs"] = indata[i].total_jobs/jobsN;
   };
return indata;
};  //end of genPctData

//diffData calculates differences between two data sets
function diffData(ds1, ds2) {

debugger;
  
  var outData = join(ds1,data2,"sector_id","sector_id", function(dat,col){
           return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: dat.county,
			   job_title: dat.job_title,
			   population_year: dat.population_year,
			   total_jobs: dat.total_jobs,
			   total_jobs2 : col.total_jobs,
			   category : dat.category,
			   bar_color: dat.bar_color  
			   };
});


function dataDownload(datain){

	var seldCTY = d3.select('#selCty option:checked').text();
	var seldFIPS = switchFIPS(seldCTY);
	var seldYEAR = eval(d3.select("#selYear").property('value'));
	var fileName = "Jobs by Sector " + seldCTY + " " + seldYEAR + ".csv";

	var datafiltered = datain.filter(function(d) {
		 if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
	 })
	var dataOut = genData(datafiltered);
	
	dataOut.forEach(function(e){
      if (typeof e === "object" ){
          e["county_name"] = seldCTY;
    }
   });
   
      const dataOut2 = dataOut.map(item => ({
		fips_code : item.area_code,
		county: item.county_name,
		job_category : item.job_title,
		year: item.population_year,
		jobs: item.total_jobs}));
	 

	exportToCsv(fileName, dataOut2);

} //end of dataDownload

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
    }

function imageDownload(outFileName) {
      // Retrieve svg node
	  const svg = d3.select("svg");
      const svgNode = svg.node();

        // Get image quality index (basically,  index you can zoom in)
        const quality = 3;
        // Create image
        const image = new Image();
        image.onload = () => {
	   // Create image canvas
          const canvas = document.createElement('canvas');
          // Set width and height based on SVG node
          const rect = svgNode.getBoundingClientRect();
          canvas.width = rect.width * quality;
          canvas.height = rect.height * quality;

          // Draw background
          const context = canvas.getContext('2d');
          context.fillStyle = '#FAFAFA';
          context.fillRect(0, 0, rect.width * quality, rect.height * quality);
          context.drawImage(image, 0, 0, rect.width * quality, rect.height * quality);

          // Set some image metadata
          let dt = canvas.toDataURL('image/png');

          // Invoke saving function
          saveAs(dt, outFileName);

        };


        var url = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(serializeString(svgNode));

        image.src = url// URL.createObjectURL(blob);
      

      // This function invokes save window
      function saveAs(uri, filename) {
	  
        // create link
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          document.body.appendChild(link); // Firefox requires the link to be in the body
          link.download = filename;
          link.href = uri;
          link.click();
          document.body.removeChild(link); // remove the link when done
        } else {
          location.replace(uri);
        }
      }

      // This function serializes SVG and sets all necessary attributes
      function serializeString(svg) {
	 
        const xmlns = 'http://www.w3.org/2000/xmlns/';
        const xlinkns = 'http://www.w3.org/1999/xlink';
        const svgns = 'http://www.w3.org/2000/svg';
        svg = svg.cloneNode(true);
        const fragment = window.location.href + '#';
        const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT, null, false);
        while (walker.nextNode()) {
          for (const attr of walker.currentNode.attributes) {
            if (attr.value.includes(fragment)) {
              attr.value = attr.value.replace(fragment, '#');
            }
          }
        }
        svg.setAttributeNS(xmlns, 'xmlns', svgns);
        svg.setAttributeNS(xmlns, 'xmlns:xlink', xlinkns);
        const serializer = new XMLSerializer();
        const string = serializer.serializeToString(svg);
        return string;
      }
    }


function jobsHdr(indata,yr){

//Comma format
var formatComma = d3.format(",.2f");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
var jobsN = +indata[0].sum_jobs;
var wageN = +indata[0].total_wage;

//round jobs value and output string
if(jobsN >= 1000000) {
   var jobFrac = jobsN/1000000;
   var jobVal = formatComma(jobFrac.toFixed(2));
   var jobStr = jobVal + " Million Total Estimated Jobs";
 } else {
       var jobStr = formatDecimalComma(jobsN) + " Total Estimated Jobs";
	}
 
var wageVal = formatDollar(wageN);
var wageStr = wageVal + " Average Annual Wage";
var yrStr = yr + " Employment Share by Wage";

var outArr = [jobStr, wageStr, yrStr];

return outArr;
}


function switchFIPS(county){
   switch(county){
		case "Adams County":	
		fips = "001";	
		break;
		case "Alamosa County":	
		fips = "003";	
		break;
		case "Arapahoe County":	
		fips = "005";	
		break;
		case "Archuleta County":	
		fips = "007";	
		break;
		case "Baca County":	
		fips = "009";	
		break;
		case "Bent County":	
		fips = "011";	
		break;
		case "Boulder County":	
		fips = "013";	
		break;
		case "Broomfield County":	
		fips = "014";	
		break;
		case "Chaffee County":	
		fips = "015";	
		break;
		case "Cheyenne County":	
		fips = "017";	
		break;
		case "Clear Creek County":	
		fips = "019";	
		break;
		case "Conejos County":	
		fips = "021";	
		break;
		case "Costilla County":	
		fips = "023";	
		break;
		case "Crowley County":	
		fips = "025";	
		break;
		case "Custer County":	
		fips = "027";	
		break;
		case "Delta County":	
		fips = "029";	
		break;
		case "Denver County":	
		fips = "031";	
		break;
		case "Dolores County":	
		fips = "033";	
		break;
		case "Douglas County":	
		fips = "035";	
		break;
		case "Eagle County":	
		fips = "037";	
		break;
		case "Elbert County":	
		fips = "039";	
		break;
		case "El Paso County":	
		fips = "041";	
		break;
		case "Fremont County":	
		fips = "043";	
		break;
		case "Garfield County":	
		fips = "045";	
		break;
		case "Gilpin County":	
		fips = "047";	
		break;
		case "Grand County":	
		fips = "049";	
		break;
		case "Gunnison County":	
		fips = "051";	
		break;
		case "Hinsdale County":	
		fips = "053";	
		break;
		case "Huerfano County":	
		fips = "055";	
		break;
		case "Jackson County":	
		fips = "057";	
		break;
		case "Jefferson County":	
		fips = "059";	
		break;
		case "Kiowa County":	
		fips = "061";	
		break;
		case "Kit Carson County":	
		fips = "063";	
		break;
		case "Lake County":	
		fips = "065";	
		break;
		case "La Plata County":	
		fips = "067";	
		break;
		case "Larimer County":	
		fips = "069";	
		break;
		case "Las Animas County":	
		fips = "071";	
		break;
		case "Lincoln County":	
		fips = "073";	
		break;
		case "Logan County":	
		fips = "075";	
		break;
		case "Mesa County":	
		fips = "077";	
		break;
		case "Mineral County":	
		fips = "079";	
		break;
		case "Moffat County":	
		fips = "081";	
		break;
		case "Montezuma County":	
		fips = "083";	
		break;
		case "Montrose County":	
		fips = "085";	
		break;
		case "Morgan County":	
		fips = "087";	
		break;
		case "Otero County":	
		fips = "089";	
		break;
		case "Ouray County":	
		fips = "091";	
		break;
		case "Park County":	
		fips = "093";	
		break;
		case "Phillips County":	
		fips = "095";	
		break;
		case "Pitkin County":	
		fips = "097";	
		break;
		case "Prowers County":	
		fips = "099";	
		break;
		case "Pueblo County":	
		fips = "101";	
		break;
		case "Rio Blanco County":	
		fips = "103";	
		break;
		case "Rio Grande County":	
		fips = "105";	
		break;
		case "Routt County":	
		fips = "107";	
		break;
		case "Saguache County":	
		fips = "109";	
		break;
		case "San Juan County":	
		fips = "111";	
		break;
		case "San Miguel County":	
		fips = "113";	
		break;
		case "Sedgwick County":	
		fips = "115";	
		break;
		case "Summit County":	
		fips = "117";	
		break;
		case "Teller County":	
		fips = "119";	
		break;
		case "Washington County":	
		fips = "121";	
		break;
		case "Weld County":	
		fips = "123";	
		break;
		case "Yuma County":	
		fips = "125";	
		break;
		case "Colorado":	
		fips = "000";	
		break;
}
return fips;
};
