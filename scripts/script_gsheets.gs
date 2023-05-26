function atOpen(e) {
  var response = UrlFetchApp.fetch("https://5885jcf9zc.execute-api.eu-west-1.amazonaws.com/prod/price");
  const pricesData = JSON.parse(response.getContentText())
  console.log(pricesData);
  var sheet = SpreadsheetApp.getActiveSheet();

  // Static rows
  var rowValentum = 54;

  var sheetName = sheet.getName();
  if(sheetName == "Cartera"){
    for(let i = 0; i<6; i++){
      sheet.getRange(rowValentum+i, 4).setValue(pricesData[1+i].price);
      sheet.getRange(rowValentum+i, 5).setValue(pricesData[0+i].dailyChange);
    }
  }

  // Dynamic rows
  var data = sheet.getDataRange().getValues();
  var stockTiker = pricesData[0].stock;
  Logger.log(stockTiker)
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
  sheet.getRange(pos, 5).setValue(pricesData[0].dailyChange);
}
