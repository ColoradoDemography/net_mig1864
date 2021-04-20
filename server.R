source("setup.R")

function(input, output, session) {

observeEvent( input$goButton,{
    cty <- popPlace(DOLAPool)
    selcty <- input$county
    selseries <- input$series
  
  OutPlot <- GenPlot(DBPool=DOLAPool, ctyfips=cty, ctyname= selcty, seriestype= selseries)
 
output$CHOutput <-  renderPlotly({OutPlot[["CHOutput"]]})

# Add Download Image...

output$CHDATA=downloadHandler(
    filename= function(){
      paste0("Net Migration ",selseries, " ",selcty,".csv")
    },
    content= function(file){
      write_csv(OutPlot[["CHDATA"]], file)
    }
 )
})
}
