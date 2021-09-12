function atOpen(e) {
  var response = UrlFetchApp.fetch("https://jov7hrlgi3.execute-api.eu-west-1.amazonaws.com/share-prices");
  const pricesData = JSON.parse(response.getContentText())
  var sheet = SpreadsheetApp.getActiveSheet();

  // Static rows
  var rowValentum = 48;
  var rowIWDA = 49;
  var rowVUSA = 50;
  var rowEMIM = 51;
  var rowNQSE = 52;

  var sheetName = sheet.getName();
  if(sheetName == "Cartera"){
    sheet.getRange(rowValentum, 4).setValue(pricesData[0].price);
    sheet.getRange(rowIWDA, 4).setValue(pricesData[2].price);
    sheet.getRange(rowVUSA, 4).setValue(pricesData[3].price);
    sheet.getRange(rowEMIM, 4).setValue(pricesData[4].price);
    sheet.getRange(rowNQSE, 4).setValue(pricesData[5].price);
  }

  // Dynamic rows
  var data = sheet.getDataRange().getValues();
  var stockTiker = pricesData[1].ticker;
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
