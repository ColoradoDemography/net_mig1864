# Unemployment Rate Dashboard  Support functions
# Adam Bickford January 2020
# 

library(tidyverse, quietly=TRUE)
library(stringr)
library(readr)
library(readxl, quietly=TRUE)
library(RPostgreSQL)
library(blsAPI)
library(plotly)
library(scales, quietly=TRUE)
library(shiny, quietly=TRUE)
library(shinydashboard, quietly=TRUE)
library(shinyjs, quietly=TRUE)
library(RColorBrewer)


# Additions for Database pool
library('pool') 
library('DBI')
library('stringr')
library('config')

# Set up database pool 
config <- get("database")
DOLAPool <-  dbPool(
  drv <- dbDriver(config$Driver),
  dbname = config$Database,
  host = config$Server,
  port = config$Port,
  user = config$UID,
  password = config$PWD
)



onStop(function(){
  poolClose(DOLAPool)
})


# Support Functions
# NumFmt formats a numberic variable to a whold number, comma separated value
#
NumFmt <- function(inval){
  outval <- format(round(inval ,digits=0),  big.mark=",")
  return(outval)
}

# Percent returns a percentage value
percent <- function(x, digits = 1, format = "f", ...) {
  paste0(formatC( x, format = format, digits = digits, ...), "%")
}

# simpleCap produces string in Proper case
simpleCap <- function(x) {
  s <- strsplit(x, " ")[[1]]
  paste(toupper(substring(s, 1,1)), tolower(substring(s, 2)),
        sep="", collapse=" ")
}

#YrSelect  Generates the selections for the type dropdown
typSelect <- function() {
  curYR <- as.integer(format(Sys.Date(), "%Y"))
  curMO <- as.integer(format(Sys.Date(), "%m"))
  if (curMO <= 2) {
    endYR <- curYR - 1
  } else{
    endYR <- curYR
  }
  startYR <- endYR - 7
  
  str5 <- paste0("Past Five Years (", startYR," to ",endYR - 2,")")
  strGR <- "Prior Unemployment Peak (2009 to 2012)"
  
  outList <- c(str5, strGR)
  
  return(outList)   
}

# popPlace list of county names
popPlace <- function(DBPool) {
  
  
  # Create Connection Strings
  clookupStr <- paste0("SELECT DISTINCT countyfips, municipalityname FROM estimates.county_muni_timeseries WHERE placefips = 0;")
  
  # f.cLookup contains the county records
  f.cLookup <- dbGetQuery(DBPool, clookupStr)
  
  # Counties   
  f.cLookup <- arrange(f.cLookup, countyfips)
  f.cLookup[,2] <- sapply(f.cLookup[,2], function(x) simpleCap(x))
  f.cLookup$municipalityname <- str_replace(f.cLookup$municipalityname,"Colorado State","Colorado")
  
  
  return(f.cLookup)
}

#listToFips retuns a fips code from a county name

listTofips <- function(df, inList1){
  # Function to produce a vector of FIPS codes from an input list of names and codes
  fipsl <- df[which(df$municipalityname == inList1),1]
  return(fipsl)
} #end listTofips

# Substring Right
substrRight <- function(x, n){
  substr(x, nchar(x)-n+1, nchar(x))
}




# GenPlot returns the Plots
GenPlot <- function(DBPool, ctyfips, ctyname, seriestype) {

  if(seriestype == "Total Population") {
    chartSQL <- "SELECT fips, county, year, netMigration_tot FROM estimates.\"netMigration_1864\" WHERE fips IN ("
  } else {
    chartSQL <- "SELECT fips, county, year, netMigration_1864 FROM estimates.\"netMigration_1864\" WHERE fips IN ("
  }
  
  titleSTR <- paste0("Net Migration by Year: ")
  # Populating chartSQL and title String
  for(i in 1:length(ctyname)){
    cty <- listTofips(ctyfips,ctyname[i])
    
    
    if(i == length(ctyname)) {
      chartSQL <- paste0(chartSQL,"'",str_pad(cty,3,pad="0"), "');")
      titleSTR = paste0(titleSTR," and ",ctyname[i], ":<br>",seriestype)
    } else
    {
      chartSQL <- paste0(chartSQL,"'",str_pad(cty,3,pad="0"), "', ")
      titleSTR = paste0(titleSTR," ",ctyname[i], ", ")
    }
    
  }
 

 
  f.chartData <- dbGetQuery(DBPool, chartSQL)
  names(f.chartData) <- c("fips", "county", "year", "netmigration")
  
  # legend entries and caption
  
  captionSTR <- paste0("Data and Visualization by the Colorado State Demography Office, Print Date: ", format(Sys.Date(), "%m/%d/%Y"))
  
  # tool tip text
  f.chartData$valueText <- paste0("County: ",f.chartData$county, "<br>Year: ",f.chartData$year, "<br>Net Migration: ",NumFmt(f.chartData$netmigration))
  
  #output file name
  total_tit <- paste0("Net Migration ",seriestype,".png")
  

   # Plotting

   fig <- plot_ly(width=1500, height=500, f.chartData, x = ~year, y = ~netmigration, 
                  type = 'scatter', mode = 'lines+markers',
                  color = ~county,
                  colors= "Dark2",
                  name = ~county, text = ~valueText, hoverinfo = 'text') %>% 
     config( toImageButtonOptions = list(format = "png", filename = total_tit))

  
  fig <- fig %>% add_segments(x = min(f.chartData$year), xend = max(f.chartData$year), y = 0, yend = 0, color = I("black"),
                              showlegend = F)
  
  fig <- fig %>% layout( margin = list(l = 50, r = 50, t = 60, b = 105),
                        bargap = 0,
                        autosize = T,
                        title = titleSTR,
                        paper_bgcolor='rgb(255,255,255)', plot_bgcolor='rgb(229,229,229)',
                        hoverlabel = "right",
                        xaxis = list(title = "Year",
                                     gridcolor = I("black"),
                                     showgrid = TRUE,
                                     showline = FALSE,
                                     showticklabels = TRUE,
                                     tickcolor = I("black"),
                                     ticks = 'outside',
                                     zeroline = FALSE),
                        yaxis = list(title = "Net Migration",
                                     gridcolor = I("black"),
                                     showgrid = TRUE,
                                     showline = FALSE,
                                     showticklabels = TRUE,
                                     separators = ',',
                                     tickcolor = I("black"),
                                     ticks = 'outside',
                                     zeroline = FALSE),
                        legend = list(orientation = 'h'),
                        annotations = list(text=captionSTR, 
                                           xref = 'paper', x = 0,
                                           yref = 'paper', y = -0.25,
                                           align='left', showarrow=FALSE,
                                           font=list(size=10)))
  
  #Final Formatting of  f.chartDataOUt
  minyr = as.character(min(f.chartData$year))
  maxyr = as.character(max(f.chartData$year))
  
 f.chartDataout <- f.chartData %>% mutate(netmigration = NumFmt(netmigration)) %>%
         select(fips, county, year, netmigration) %>%
         spread(year, netmigration) %>%
         mutate(series = seriestype) %>%
         select(series, fips, county, minyr:maxyr)
  
 
 

  
  outlist <- list("CHOutput" = fig, "CHDATA" = f.chartDataout)
  return(outlist)
}


