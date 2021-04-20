
library(tidyverse, quietly=TRUE)
library(blsAPI)

seriesID <-  c("LAUST080000000000003", "LAUCA082160000000005")

payload <- list(
  'seriesid' = seriesID,
  'startyear' = 1990,
  'endyear' = 2021,
  "registrationkey" = "3f082b93fd55405f913441246a798750")


f.BLS <- blsAPI(payload = payload, api_version = 2, return_data_frame =TRUE) %>% 
  mutate(type = substrRight(seriesID,1),
         year = as.numeric(year),
         value = as.numeric(as.character(value))) %>%
 # filter(year %in% c(endYR, prevYR, startRYR:endRYR)) %>%
  arrange(desc(year), period)

write.csv(f.BLS,"J:/Community Profiles/Shiny Demos/Unemployment/UER Shiny/BLS_data.csv")
