$(document).ready(function() {
  /* EXAMPLE API CALL

  https://www.quandl.com/api/v3/datasets/WIKI/FB.json?api_key=Wygwb7Xp33xj2NSe9-sL&order=asc&exclude_column_names=true&start_date=2015-01-30&end_date=2016-01-29&column_index=4

   */

  var socket = io(),
      symbol,
      today = new Date(),
      startYear = (today.getFullYear() - 1).toString(),
      endYear = today.getFullYear().toString(),
      month = (today.getMonth() + 1).toString(),
      date = today.getDate().toString(),
      startDate,
      endDate;

  if (month.length < 2) {
    month = '0' + month;
  }

  if (date.length < 2) {
    date = '0' + date;
  }

  startDate = startYear + '-' + month + '-' + date;
  endDate = endYear + '-' + month + '-' + date;

  var url = 'https://www.quandl.com/api/v3/datasets/WIKI/';
  var endUrl = '.json?api_key=Wygwb7Xp33xj2NSe9-sL&order=asc&exclude_column_names=true&start_date=' + startDate + '&end_date=' + endDate + '&column_index=4';



  $('#get-quote').on('click', function() {
    symbol = $('#search').val();
    var response = $.get(url + symbol + endUrl, function(data) {
    })
      .done(function(data) {
        console.log(data.dataset.data);
      });
  });

});
