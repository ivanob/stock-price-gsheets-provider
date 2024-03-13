
function atOpen(e) {
  var response = UrlFetchApp.fetch("https://5885jcf9zc.execute-api.eu-west-1.amazonaws.com/prod/price");
  const pricesData = JSON.parse(response.getContentText())
  console.log(pricesData);
  var sheet = SpreadsheetApp.getActiveSheet();

  // Static rows
  var rowValentum = 50;

  var sheetName = sheet.getName();
  if(sheetName == "Cartera"){
    console.log('Writing cartera sheet')
    for(let i = 0; i<6; i++){
      sheet.getRange(rowValentum+i, 4).setValue(pricesData[1+i].price);
      sheet.getRange(rowValentum+i, 5).setValue(pricesData[1+i].dailyChange);
    }
  } if(sheetName == 'WATCHLIST'){
    console.log('Writing watchlist sheet')
    var stockFish = pricesData[8];
    writeStock(stockFish, sheet)
    var stockTax = pricesData[9];
    writeStock(stockTax, sheet)
    var stockKarelia = pricesData[7];
    writeStock(stockKarelia, sheet)
  }
  // Dynamic rows
  
  var stockKri = pricesData[0];
  var stock4Mass = pricesData[11];
  var stockKtimas = pricesData[10];
  writeStock(stockKri, sheet);
  writeStock(stock4Mass, sheet);
  writeStock(stockKtimas, sheet);
}

function writeStock(stockInfo, sheet) {
  var data = sheet.getDataRange().getValues();
  Logger.log(stockInfo.stock)
  var pos = 0
  for(var i = 0; i<data.length;i++){
    if(data[i][1] == stockInfo.stock){ //[1] because column B
      pos = i+1;
      //return i+1;
    }
  }
  sheet.getRange(pos, 4).setValue(stockInfo.price);
  sheet.getRange(pos, 5).setValue(stockInfo.dailyChange);
}