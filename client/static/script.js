$(function() {
    $( 'input[name="date_pick_from"]' ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
            $( "#date_pick_to" ).datepicker( "option", "minDate", selectedDate );
        }
    });
    
    $( 'input[name="date_pick_to"]' ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        onClose: function( selectedDate ) {
            $( "#date_pick_from" ).datepicker( "option", "maxDate", selectedDate );
        }
        });

    $('#dropdown_menu_biomimic_type').change( function () {
        biomimic_type = $("#dropdown_menu_biomimic_type option:selected").text();
        $.getJSON('/_parse_data', {
            select_type: "biomimic_type",
            select_value: biomimic_type
        })
        .done(function(data){              
            $('#dropdown_menu_country_name').empty();
            $("#dropdown_menu_country_name").append('<option value="">Please select Country Name</option>')
            $.each(data, function(country){ 
                $("#dropdown_menu_country_name").append('<option value=\"'+country+'\">'+country+'</option>')
            });
        });
    });
    
    $('#dropdown_menu_country_name').change( function () {
        country_name = $("#dropdown_menu_country_name option:selected").text();
        $.getJSON('/_parse_data', {
            select_type: "country_name",
            select_value: country_name
        }).done(function(data) {
            $('#dropdown_menu_state_name').empty()
            $("#dropdown_menu_state_name").append('<option value="">Please select State Name</option>')
            $.each(data, function(state) {
                $("#dropdown_menu_state_name").append('<option value=\"'+state+'\">'+state+'</option>')
            });
        });
    });
    
    $('#dropdown_menu_state_name').change( function () {
        state_name = $("#dropdown_menu_state_name option:selected").text();
        $.getJSON('/_parse_data', {
            select_type: "state_name",
            select_value: state_name
            }).done(function(data) {
            $('#dropdown_menu_location_name').empty()
            $("#dropdown_menu_location_name").append('<option value="">Please select Location Name</option>')
            $.each(data, function(location) {
                $("#dropdown_menu_location_name").append('<option value=\"'+location+'\">'+location+'</option>')
            });
        });
    });
    
    $('#dropdown_menu_location_name').change( function () {
        //location_name = $("#dropdown_menu_location_name option:selected").text();
        $.getJSON('/_parse_data', {
            select_type: "lt_for_zone",
            select_value: biomimic_type
        }).done(function(data) {
            $('#dropdown_menu_zone_name').empty()
            $("#dropdown_menu_zone_name").append('<option value="">Please select Zone Name</option>')
            $("#dropdown_menu_zone_name").append('<option value="1">All</option>')
            $.each(data, function(zone) {
                $("#dropdown_menu_zone_name").append('<option value=\"'+zone+'\">'+zone+'</option>')
            });
        });
    });
    
    $('#dropdown_menu_zone_name').change( function () {
        $.getJSON('/_parse_data', {
            select_type: "lt_for_subzone",
            select_value: biomimic_type
            }).done(function(data) {
            $('#dropdown_menu_sub_zone_name').empty()
            $("#dropdown_menu_sub_zone_name").append('<option value="">Please select Sub Zone</option>')
            $("#dropdown_menu_sub_zone_name").append('<option value="1">All</option>')
            $.each(data, function(sub_zone) {
                $("#dropdown_menu_sub_zone_name").append('<option value=\"'+sub_zone+'\">'+sub_zone+'</option>')
            });
        });
    });
        
    $('#dropdown_menu_sub_zone_name').change( function () {
        $.getJSON('/_parse_data', {
            select_type: "lt_for_wave_exp",
            select_value: biomimic_type
            }).done(function(data) {
            $('#dropdown_menu_wave_exp_name').empty()
            $("#dropdown_menu_wave_exp_name").append('<option value="">Please select Wave Exposure</option>')
            $("#dropdown_menu_wave_exp_name").append('<option value="1">All</option>')
            $.each(data, function(wave_exp) {
                $("#dropdown_menu_wave_exp_name").append('<option value=\"'+wave_exp+'\">'+wave_exp+'</option>')
            });
        });
    });
    function fieldValidation(){
        var query_field1 = $("#dropdown_menu_biomimic_type option:selected").text()
        var query_field2 = $("#dropdown_menu_country_name option:selected").text()
        var query_field3 = $("#dropdown_menu_state_name option:selected").text()
        var query_field4 = $("#dropdown_menu_location_name option:selected").text()
        var query_field5 = $("#dropdown_menu_zone_name option:selected").text()
        var query_field6 = $("#dropdown_menu_zone_name option:selected")
        var query_field7 = $("#dropdown_menu_wave_exp_name option:selected").text()
        var query_field8 = $("#date_pick_from").val()
        var query_field9 = $("#date_pick_to").val()
        var valid = false
        if ((query_field1 != "Please select Biomimic Type") && (query_field2 != "Please select Country Name") && (query_field3 != "Please select State Name") && (query_field4 != "Please select Location Name") && (query_field5 != "Please select Zone Name") && (query_field6 != "Please select Sub zone") && (query_field7 != "Please select Wave Exposure") && (query_field8 != '') && (query_field9 != '')){
            valid = true
        }
        return valid
    }

    $('#button_submit_query').click(function () {
    if (fieldValidation())
        {
            $.getJSON('/_submit_query', {
                biomimic_type: $("#dropdown_menu_biomimic_type option:selected").text(),
                country: $("#dropdown_menu_country_name option:selected").text(),
                state_province: $("#dropdown_menu_state_name option:selected").text(),
                location: $("#dropdown_menu_location_name option:selected").text(),
                zone: $("#dropdown_menu_zone_name option:selected").text(),
                sub_zone: $("#dropdown_menu_sub_zone_name option:selected").text(),
                wave_exp: $("#dropdown_menu_wave_exp_name option:selected").text(),
                start_date: $("#date_pick_from").val(),
                end_date: $("#date_pick_to").val(),
            }) 
            .done(function(data){
                console.log(data.list_of_results)
                var values = (data.list_of_results)
                var options = $("#hidden-table");
                var button = $("#download-button");
                var title = $("#title")
                button.empty()
                options.empty()
                if (values == ''){
                    button.empty()
                    options.empty()
                    options.append("<h3 class=text-danger>  Search was unsucessfull, please try again with different select options<h3>")
                } 
                else {
                    options.empty()
                    title.append("<h4>Data preview</h4>")
                    options.append("<thead><tr><th>Timestamp</th><th>Temperature</th></tr></thead><tbody>")
                    $.each(data.list_of_results, function(key, value) {
                        options.append("<tr><td>"+value[0]+"</td><td>"+value[1]+"</td></tr>")
                    });
                    options.append("</tbody>")
                    options.append("</table>")
                    button.empty()
                    button.append("<a href=\"/download\" class=\"btn btn-info btn-lg\" role=\"button\"><span class=\"glyphicon glyphicon-download\"></span> Download All Data</a>")
                }
            });
        }
    });

    $(document).ready(function(){
        $('[data-toggle="popover"]').popover(); 
    });
});