function atOpen(e) {
  var response = UrlFetchApp.fetch("https://jov7hrlgi3.execute-api.eu-west-1.amazonaws.com/share-prices");
  const pricesData = JSON.parse(response.getContentText())
  var sheet = SpreadsheetApp.getActiveSheet();

  var rowValentum = 45;
  var rowIWDA = 46;
  var sheetName = sheet.getName();
  if(sheetName == "Cartera"){
    sheet.getRange(rowValentum, 4).setValue(pricesData[2].price);
    sheet.getRange(rowIWDA, 4).setValue(pricesData[1].price);
  }

  var data = sheet.getDataRange().getValues();
  var stockTiker = pricesData[0].ticker;
  var pos = 0
  for(var i = 0; i<data.length;i++){
    if(data[i][1] == stockTiker){ //[1] because column B
      Logger.log((i+1))
      pos = i+1;
      //return i+1;
    }
  }
  Logger.log(pos)
  sheet.getRange(pos, 4).setValue(pricesData[0].price);
}
