var counter = 1;
var row_conter = 1;
var renum = 1;
var totalenergy = 0;
var totalenergy_save = 0;
var totalwatts_save = 0;
var val1 = $('[name="custom_value1"]').val();
var bs = 0;
var sr = 0;
$(document).ready(function () {
    
    
    $("#addrow").on("click", function () {
        counter++;
        row_conter++;
        
        var newRow = $("<tr>");
        var cols = "";
        cols += '<td><input type="number" class="slno" name="slno'  + counter + '" id="slno' + counter + '" disabled/></td>';
        cols += '<td><input type="text" class="eqname" name="eqname' + counter + '" id="eqname' + counter + '"/></td>';
        cols += '<td><input type="number" class="qty" name="qty' + counter + '" id="qty' + counter + '"/></td>';
        cols += '<td><input type="number" class="watts" name="watts' + counter + '" id="watts' + counter + '"/></td>';
        cols += '<td><input type="number" class="use_hour" name="use_hour' + counter + '" id="use_hour' + counter + '"/></td>';
        cols += '<td><input type="number" class="wpd" name="wpd' + counter + '" id="wpd' + counter + '" disabled/></td>';
        cols += '<td><input type="number" class="epd" name="epd' + counter + '" id="epd' + counter + '" disabled/></td>';
        cols += '<td class="delete-sign"><a class="deleteRow"> <span class="glyphicon glyphicon-minus-sign"></span> </a></td>';
        newRow.append(cols);
        
        $("table.order-list").append(newRow);
        // $('#slno'+row_conter).val(row_conter);
        renum = 1;
        $(".slno").each(function() {
            $(this).val(renum);
            renum++;
        });
    });
    
    $("table.order-list").on("change", 'input[name^="watts"], input[name^="qty"], input[name^="use_hour"]',  function (event) {
        calculateRow($(this).closest("tr"));
        calculatetotalwatts();
        calculatetotalenergy();
        calculate_solar_rating();
        calculate_battery_sizing();
    });
    
    $("table.order-list").on("click", "a.deleteRow", function (event) {
        row_conter--;
        $(this).closest("tr").remove();
        calculatetotalwatts();
        calculatetotalenergy();
        calculate_solar_rating();
        calculate_battery_sizing();
        renum = 1;
        $(".slno").each(function() {
            $(this).val(renum);
            renum++;
        });  
    });

    $(".calc-rows").on("change", 'input[name^="custom_value1"], input[name^="custom_value2"], input[name^="sel"]',  function (event) {
        calculate_solar_rating();
    });

    $(".calc-rows").on("change", 'input[name^="custom_value1"], input[name^="dod"], input[name^="doa"],input[type=radio][name=optradio]',  function (event) {
        calculate_battery_sizing();
    });
    $('input[type=radio][name=optradio]').change(function() {
            if (this.value == 'ac') {
               val1 = $('[name="custom_value1"]').val();
            }
            else if (this.value == 'dc') {
                val1 = $('[name="custom_value2"]').val();
            }
            calculate_solar_rating();
            calculate_battery_sizing();
    });
    $( "#sbs" ).change(function() {
       calculate_battery_number();
    });

    $( "#panel_val" ).change(function() {
       calculate_panel_number();
    });
});
    


function calculateRow(row) {
    var watts = +row.find('input[name^="watts"]').val();
    var qty = +row.find('input[name^="qty"]').val();
    var wpd = watts * qty;
    var use_hour = +row.find('input[name^="use_hour"]').val();
    if (use_hour=="") {use_hour=1;}
    row.find('input[name^="wpd"]').val((wpd).toFixed(2));
    row.find('input[name^="epd"]').val((wpd * use_hour).toFixed(2));
}
    
function calculatetotalwatts() {
    var totalwatts = 0;
    $("table.order-list").find('input[name^="wpd"]').each(function () {
        totalwatts_save += +$(this).val();
        $("#totalwatts").text(totalwatts_save.toFixed(2));
    });
    totalwatts=totalwatts_save;
    totalwatts_save=0;
}

function calculatetotalenergy() {
    $("table.order-list").find('input[name^="epd"]').each(function () {
        totalenergy_save += +$(this).val();
    $("#totalenergy").text(totalenergy_save.toFixed(2));
    });
    totalenergy=totalenergy_save;
    totalenergy_save=0;
}

function calculate_solar_rating() {
    // var val1 = $('[name="custom_value1"]').val();
    // var val2 = $('[name="custom_value2"]').val();
    var sel = $('[name="sel"]').val();
    sr = (totalenergy)/(val1*sel/100);
    $('[name="sr"]').val(sr);
}

function calculate_battery_sizing() {
    var dod = $('[name="dod"]').val();
    var doa = $('[name="doa"]').val();
    // if (dod=="") {dod=50;$('[name="dod"]').val(dod);}
    // if (doa=="") {doa=1;$('[name="doa"]').val(doa);}
    bs = (totalenergy*1.5*doa)/(12*dod/100);
    $('[name="bs"]').val(bs);
}

function calculate_battery_number() {
    var battery_rating = $( "#sbs" ).val();
    if (battery_rating!=="") {
    console.log("Battery num before rounding =",bs/battery_rating);
    var battery_num = Math.round(bs/battery_rating);
    if (isNaN(battery_num)) {battery_num=""}
    $('[name="bat_num"]').val(battery_num);
    }
}

function calculate_panel_number() {
    var panel_rating = $( "#panel_val" ).val();
    console.log("Panel num before rounding =",sr/panel_rating);
    var panel_num = Math.round(sr/panel_rating);
    if (isNaN(panel_num)) {panel_num=""}
    $('[name="pan_num"]').val(panel_num);
}