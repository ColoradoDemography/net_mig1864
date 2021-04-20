# Unemployment Analysis Dashboard
# Adam Bickford January 2021
# This program will pull current unemployment rate and labor force data from the BLS API
# and produce a plotly chart that shows three monthly data series for a selected county.
# 
library(plotly)
library(shiny)

source("setup.R")

  ctylist  <- popPlace(DOLAPool)
  defaultCty <- "Select County From List..."
  seriessel <- c("Total Population", "Working Age Population (ages 18 to 64)")
  typeList <- typSelect()


function(req) {
  htmlTemplate("index.html",
                county=selectInput("county","Click Box to Select one or more counties:", choices= ctylist[,2],multiple = TRUE),  # Build this from data set
                series=selectInput("series","Select data series:",choices= seriessel), 
                goBtn = actionButton("goButton","Generate Chart"),
                out_chart = plotlyOutput("CHOutput"),
                dlBtn = downloadButton("CHDATA","Download Data (CSV)"))
 }



 
