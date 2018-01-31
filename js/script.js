function ready(callback){
  // in case the document is already rendered
  if (document.readyState!='loading') callback();
  // modern browsers
  else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
  // IE <= 8
  else document.attachEvent('onreadystatechange', function(){
      if (document.readyState=='complete') callback();
  });
}

ready(function(){

  var fuelCNG = 'CNG';
  var fuelLNG = 'LNG';
  var fuel = fuelCNG;

  $("input[name='fuel']").change(function() {
    var fueltype = $(this).val();
    $("input[name='measurement'][value='DGE']").parent('label').removeClass('disabled');
    $("input[name='measurement'][value='MMBTU']").parent('label').removeClass('disabled')
    $("input[name='measurement'][value=GGE]").attr("disabled", false);
    $("input[name='measurement'][value=DGE]").attr("disabled", false);
    $("input[name='measurement'][value='MMBTU']").attr("disabled", false);

    $("input[name='fuel']").parent('label').removeClass('checked');
    $("input[name='fuel']").attr('checked', false);
    $(this).parent('label').addClass('checked');
    $(this).attr('checked', true);

    if (fuel === 'LNG') {
      $("input[name='measurement'][value=DGE]").attr("disabled", true);
      $("input[name='measurement'][value='MMBTU']").attr("disabled", true);
      $("input[name='measurement'][value='GGE']").click();
      $("input[name='measurement'][value='DGE']").parent('label').addClass('disabled');
      $("input[name='measurement'][value='MMBTU']").parent('label').addClass('disabled');

    }
  });

    $('#fuel-type').change(function(){
    fuel = $("input[name='fuel']:checked").val();
    $("input[name='measurement'][value='DGE']").parent('label').removeClass('disabled');
    $("input[name='measurement'][value='MMBTU']").parent('label').removeClass('disabled')
    $("input[name='measurement'][value=GGE]").attr("disabled", false);
    $("input[name='measurement'][value=DGE]").attr("disabled", false);
    $("input[name='measurement'][value='MMBTU']").attr("disabled", false);

    $("input[name='measurement'][value='GGE']").click();
    $("input[name='measurement'][value='MMBTU']").click();
    $("input[name='measurement'][value='DGE']").click();

    if (fuel === 'LNG') {
      $("input[name='measurement'][value=DGE]").attr("disabled", true);
      $("input[name='measurement'][value='MMBTU']").attr("disabled", true);
      $("input[name='measurement'][value='GGE']").click();
      $("input[name='measurement'][value='DGE']").parent('label').addClass('disabled');
      $("input[name='measurement'][value='MMBTU']").parent('label').addClass('disabled');

    }

  });

  $("#average-miles-slider").slider({
    range: "min",
    min: 10000,
    max: 250000, //maximum value
    value: 100000, //default value
    step: 5000,
    slide: function(event, ui) {
      var avgMiles = (ui.value),
          ngCost = $("#natural-gas-cost-slider").slider("value");
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#average-miles").val(avgMiles).formatCurrency({ symbol: '', roundToDecimalPlace: 0 });

    },
    change: function(event, ui) {
      var avgMiles = (ui.value),
          ngCost = $("#natural-gas-cost-slider").slider("value");
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#average-miles").val(avgMiles).formatCurrency({ symbol: '', roundToDecimalPlace: 0 });
    }
  });


  $("#average-mpg-slider").slider({
    range: "min",
    min: 1,
    max: 15, //maximum value
    value: 7, //default value
    step: .25,
    slide: function(event, ui) {
      var avgMpg = (ui.value),
          ngCost = $("#natural-gas-cost-slider").slider("value");
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#average-mpg").val(avgMpg);

    },
    change: function(event, ui) {
      var avgMpg = (ui.value),
          ngCost = $("#natural-gas-cost-slider").slider("value");
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#average-mpg").val(avgMpg);
    }
  });

  $("#diesel-cost-slider").slider({
    range: "min",
    min: 2.00,
    max: 5.00, //maximum value
    step: .01,
    value: 4.00, //default value
    slide: function(event, ui) {
      var dCost = (ui.value),
          ngCost = $("#natural-gas-cost-slider").slider("value");
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#diesel-cost").val(dCost).formatCurrency();

    },
    change: function(event, ui) {
      var dCost = (ui.value),
          ngCost = $("#natural-gas-cost-slider").slider("value");
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#diesel-cost").val(dCost).formatCurrency();
    }
  });

  $("#natural-gas-cost-slider").slider({
    range: "min",
    min: 1,
    max: 5, //maximum value
    step: .01,
    value: 1.75, //default value
    slide: function(event, ui) {
      var ngCost = (ui.value);
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#natural-gas-cost").val(ngCost).formatCurrency();

    },
      change: function(event, ui) {
        var ngCost = (ui.value);
        refreshValuesCNG(fuel, ngCost, "DGE");

        $("#natural-gas-cost").val(ngCost).formatCurrency();
    }
  });



  $("input[name='measurement']").change(function() {
    var measurement = $(this).val();
    $("input[name='measurement']").parent('label').removeClass('checked');
    $("input[name='measurement']").attr('checked', false);
    $(this).parent('label').addClass('checked');
    $(this).attr('checked', true);

    //Default Selection
    if (measurement == 'DGE'){
      $("#natural-gas-cost-slider").slider('destroy');
      var ngCost = 1.75;
      $("#natural-gas-cost").val(ngCost.toString()).formatCurrency();
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#natural-gas-cost-slider").slider({
        range: "min",
        min: 1,
        max: 5, //maximum value
        step: .01,
        value: ngCost, //default value
        slide: function(event, ui) {
          var ngCost = (ui.value);
          $("#natural-gas-cost").val(ngCost).formatCurrency();

          refreshValuesCNG(fuel, ngCost, "DGE");

        }
      });
    }
    else if (measurement == 'MMBTU'){
      $("#natural-gas-cost-slider").slider('destroy');
      var ngCost = 4.00;
      $("#natural-gas-cost").val(ngCost.toString()).formatCurrency();
      refreshValuesCNG(fuel, ngCost, "MMBTU");

      $("#natural-gas-cost-slider").slider({
        range: "min",
        min: 1,
        max: 5, //maximum value
        step: .01,
        value: ngCost, //default value
        slide: function(event, ui) {
          var ngCost = (ui.value);
          $("#natural-gas-cost").val(ngCost).formatCurrency();

          refreshValuesCNG(fuel, ngCost, "MMBTU");
        }
      });
    }
    else if (measurement == 'GGE'){
      $("#natural-gas-cost-slider").slider('destroy');
      var ngCost = 2.00;
      $("#natural-gas-cost").val(ngCost.toString()).formatCurrency();
      refreshValuesCNG(fuel, ngCost, "DGE");

      $("#natural-gas-cost-slider").slider({
        range: "min",
        min: 1,
        max: 5, //maximum value
        step: .01,
        value: ngCost, //default value
        slide: function(event, ui) {
          var ngCost = (ui.value);
          $("#natural-gas-cost").val(ngCost).formatCurrency();

          refreshValuesCNG(fuel, ngCost, "GGE");
        }
      });
    }
  });

  var refreshValuesCNG = function(fuel, ngCost, measurement){
    var gge = (1.136),
        mmBtu = (0.13),
        avgMiles = $("#average-miles-slider").slider("value"),
        avgMpg = $("#average-mpg-slider").slider("value"),
        dCost = $("#diesel-cost-slider").slider("value"),
        totalDieselConsumed = (avgMiles / avgMpg),
        totalDieselCost = ((avgMiles / avgMpg) * dCost);


    if (fuel === 'LNG') {
      switch(measurement) {
        case "DGE":
          var cneCostTotal = (totalDieselConsumed * ngCost);
          break;
        case "MMBTU":
          var cneCostTotal = (totalDieselConsumed * ngCost);
          break;
        case "GGE":
          var cneCostTotal = (totalDieselConsumed * ngCost);

          break;
      }
    }
    else {
      switch(measurement) {
        case "DGE":
          var cneCostTotal = (totalDieselConsumed * ngCost);
          break;
        case "MMBTU":
          var cneCostTotal = (totalDieselConsumed * (ngCost * mmBtu));
          break;
        case "GGE":
          var cneCostTotal = (totalDieselConsumed * (ngCost * gge));
          break;
      }
    }

    var savingsTotal = (totalDieselCost - cneCostTotal);

    //Calculate Total Price
    $("#diesel-consumed").val(totalDieselConsumed).formatCurrency({ symbol: '', roundToDecimalPlace: 0 });
    $("#diesel-cost-total").val(totalDieselCost).formatCurrency({roundToDecimalPlace: 0 });
    $("#cne-cost-total").val(cneCostTotal).formatCurrency({roundToDecimalPlace: 0 });
    $("#savings").val(savingsTotal).formatCurrency({roundToDecimalPlace: 0 });
  }


  // Show Default Calculations
  $('#calculator-form').each(function(){
    var gge = (1.136),
        mmBtu = (0.13),
        avgMiles = $("#average-miles-slider").slider("value"),
        avgMpg = $("#average-mpg-slider").slider("value"),
        dCost = $("#diesel-cost-slider").slider("value"),
        ngCost = $("#natural-gas-cost-slider").slider("value"),
        totalDieselConsumed = (avgMiles / avgMpg),
        totalDieselCost = ((avgMiles / avgMpg) * dCost),
        cneCostTotal = (totalDieselConsumed * ngCost),
        savingsTotal = (totalDieselCost - cneCostTotal),
        cneCostTotal = (totalDieselConsumed * ngCost),
        savingsTotal = (totalDieselCost - cneCostTotal);



    $("#average-miles").val(avgMiles).formatCurrency({ symbol: '', roundToDecimalPlace: 0 });
    $("#average-mpg").val(avgMpg);
    $("#diesel-cost").val(dCost).formatCurrency();
    $("#natural-gas-cost").val(ngCost).formatCurrency();

    //Calculate Total Price
    $("#diesel-consumed").val(totalDieselConsumed).formatCurrency({ symbol: '', roundToDecimalPlace: 0 });
    $("#diesel-cost-total").val(totalDieselCost).formatCurrency({roundToDecimalPlace: 0 });
    $("#cne-cost-total").val(cneCostTotal).formatCurrency({roundToDecimalPlace: 0 });
    $("#savings").val(savingsTotal).formatCurrency({roundToDecimalPlace: 0 });
  });

});