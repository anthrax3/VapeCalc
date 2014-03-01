/**
 * Created by justin herter on 2/12/14.
 */
var config = {
    latest_file: 1392779191,
    author: 'Justin Herter'
}

var formula_calc = {
    flavor_base: null,
    flavor_percentage: null, // percentage of flavor in formula
    flavor_volume: null, // total volume of flavor in formula
    info: {
        flavor_pg_content: 'This is the percentage of PG that makes up the base flavor liquid.',
        flavor_percentage: 'This is the percentage of flavoring you will use in the final formulation',
        nic_pg_ratio: 'This is the percentage of PG that makes up the base nicotine liquid.',
        nic_start_mg: 'This is the initial strength of the nicotine to be used in formulation (in milligrams)',
        nic_target_mg: 'This is the desired strength of nicotine in the filal formulation',
        nic_vg_ratio: 'This is the percentage of VG that makes up the base nicotine liquid.',
        pg_ratio: 'This is the percentage of PG that will comprise the final formulation',
        target_volume: 'This is the amount of E-Liquid you wish to make',
        vg_ratio: 'This is the percentage of PG that will comprise the final formulation'
    },
    info_click: function (input) {

        document.getElementById('results').innerHTML = this.info[input];
    },
    keypad: {
        click: function (num) {
            console.log('num: ', num);
            var text = $(this.selected_input).val();
            console.log('this text: ', text);
            console.log('this.selected_input: ', this.selected_input);
            var new_value = text + '' + num;
            $(this.selected_input).val(new_value);
        },
        selected_input: null,
        next: function () {
            var element = $(this.selected_input).next('input[type=text]');
            element.focus();
        }



    },
    nic_pg_ratio: null, // PG ratio in Nicotine concentrate
    nic_start_mg: null, // Nicotine level in concentrate (mg)
    nic_target_mg: null, // Target nicotine strength in (mg)
    nic_vg_ratio: null, // VG ratio in Nicotine concentrate
    nic_volume: null, // Nicotine volume in formula
    pg_ratio: null, // PG ratio in formula
    pg_volume: null, // PG volume in formula
    target_volume: null, // Total volume to formulate
    vg_volume: null, // VG volume in formula
    vg_ratio: null, // VG ratio in formula

    display_ratio: null,
    calc: function () {
        this.target_volume = document.getElementById('target_volume').value;
        this.display_ratio = 325 / this.target_volume;
        this.nic_start_mg = document.getElementById('nic_start_mg').value;
        this.nic_target_mg = document.getElementById('nic_target_mg').value;
        this.nic_pg_ratio = document.getElementById('nic_pg_ratio').value;
        this.nic_vg_ratio = document.getElementById('nic_vg_ratio').value;
        this.pg_ratio = document.getElementById('pg_ratio').value;
        this.vg_ratio = document.getElementById('vg_ratio').value;
        this.flavor_percentage = document.getElementById('flavor_percentage').value;
        this.flavor_base = document.getElementById('flavor_base').value;
        this.nic_volume = (this.nic_target_mg / this.nic_start_mg) * this.target_volume;
        this.flavor_volume = ((this.flavor_percentage / 100) * this.target_volume);
        this.pg_volume = ((this.pg_ratio / 100) * this.target_volume) - ((this.nic_pg_ratio / 100) * this.nic_volume);
        this.vg_volume = ((this.vg_ratio / 100) * this.target_volume) - ((this.nic_vg_ratio / 100) * this.nic_volume);
        if (this.flavor_base) {
            if (this.flavor_base === 'pg') {
                this.pg_volume -= this.flavor_volume;
            } else if (this.flavor_base === 'vg') {
                this.vg_volume -= this.flavor_volume;
            } else {
                var split_fv = this.flavor_volume / 2;
                this.pg_volume -= split_fv;
                this.vg_volume -= split_fv;
            }
        }
        console.log('Object Values: ', this);
        if (this.nic_volume && this.flavor_volume && this.pg_volume && this.vg_volume) {
            $('.nicotine_display').height(Math.ceil(this.nic_volume.toPrecision(3) * this.display_ratio));
            $('.flavoring_display').height(Math.ceil(this.flavor_volume.toPrecision(3) * this.display_ratio));
            $('.pg_display').height(Math.ceil(this.pg_volume.toPrecision(3) * this.display_ratio));
            $('.vg_display').height(Math.ceil(this.vg_volume.toPrecision(3) * this.display_ratio));
            document.getElementById('results').innerHTML =
                '<p>Formulation:</p>' +
                'Nicotine Volume: ' + this.nic_volume.toPrecision(3) + ' ml' + '<br />' +
                'Flavoring Volume: ' + this.flavor_volume.toPrecision(3) + ' ml' + '<br />' +
                'PG Volume: ' + this.pg_volume.toPrecision(3) + ' ml' + '<br />' +
                'VG Volume: ' + this.vg_volume.toPrecision(3) + ' ml' + '<br />'
            ;
        }
    }
}
// flavor profile
//
//

var flavor_profile = {
        base_flavoring: null,
        json_data: null,
        load_data: function (file) {
            var filename = file.replace('C:\\fakepath\\', '');
            console.log('file: ', filename);
            $.getJSON( 'data/' + filename, function( data ) {

                flavor_profile.json_data = data;
                console.log('data: ', flavor_profile.json_data);
                flavor_profile.base_flavoring = data.base_flavoring;

            }).complete( function () {
                    flavor_profile.populate_ui(flavor_profile.json_data);
                })

        },
        populate_ui: function (data) {
            if ($('.factory_li')) {
                $('.factory_li').remove();
            }
            for ( var i = 0; i < data.base_flavoring.length; i++ ) {
                $('.flavor_profile_container ul').append('<li id="base_flavoring_' + i + '" class="factory_li flavor">' + data.base_flavoring[i].name + '<button class="btn btn-sm btn-success" onclick="flavor_profile.new_formula.add_flavors('+ i +')"><i class="glyphicon glyphicon-chevron-right"></i></button>' + '</li>');
            }
            for ( var i = 0; i < data.formulated_flavors.length; i++ ) {
                $('.factory_content ul').append('<li id="formulated_flavor_' + i + '" class="factory_li flavor">' + data.formulated_flavors[i].name + '<button onclick="flavor_profile.show_flavorings(' + i + ')" class="btn btn-sm btn-success">+</button><button onclick="remove_flavor('+ i +')" class="btn btn-sm btn-danger">-</button>' + '</li>');
            }
        },
        show_flavorings: function (i) {
//            var li = $('.factory_li').length - i; // TODO get flavors to appear below formula.
//            console.log('li', li);
//            var formula_number = '#formulated_flavor_' + i;
//            $(formula_number).append('<ul class="show_flavors"></ul>');

            for ( var ii = 0; ii < flavor_profile.json_data.formulated_flavors[i].base_flavors.length; ii++ ) {
                console.log('$(".factory_content ul").eq(i)', $('.factory_content ul').eq(i));
                $('.factory_content ul option:eq('+i+')').after('<li class="mini_li">'+ flavor_profile.json_data.formulated_flavors[i].base_flavors[ii].name +'</li>');
            }



        },
        save: function () {
            var json = JSON.stringify(flavor_profile.json_data);
            var encoded = btoa(json);
            $.post("scripts/save_to_disc.php", {json: encoded});

        },
        new_formula: {
            add_flavors: function (i) {
                console.log('flavor_profile.json_data.base_flavorings[i]', flavor_profile.json_data.base_flavoring);
                this.new_data.base_flavors.push(flavor_profile.json_data.base_flavoring[i]);

                $('.added_flavors').append('<li>' + flavor_profile.json_data.base_flavoring[i].name + '</li>');
            },
            new_data: {
                id: null,
                name: null,
                base_flavors: []
            },
            add_li: function () {
                this.new_data.id = flavor_profile.json_data.formulated_flavors.length;
                $('.factory_content ul').append('<li class="factory_li no_pad flavor"><input class="form-control inline_input" id="formula_name" placeholder="Name"><button class="btn btn-sm btn-success confirm" onclick="flavor_profile.new_formula.confirm_data()"><i class="glyphicon glyphicon-ok"></i></button>'
                    + '<br />'
                    + '<ul class="added_flavors"></ul>'
                    + '</li>');

            },
            confirm_data: function () {
                this.new_data.name = $('#formula_name').val();
                if (this.new_data.name && this.new_data.base_flavors) {
                    flavor_profile.json_data.formulated_flavors.push(this.new_data);
                } else {
                    console.log('you are missing an element');
                }
                flavor_profile.populate_ui(flavor_profile.json_data);
            }


        }

}

var remove_flavor = function (i) {
    flavor_profile.json_data.formulated_flavors.splice(i, 1);
    flavor_profile.populate_ui(flavor_profile.json_data);
}

$('.selectpicker').selectpicker();

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('input').keypad();
}

$('input[type=text]').focus( function () {
    formula_calc.keypad.selected_input = $(this);
    console.log('formula_calc.keypad.selected_input:', formula_calc.keypad.selected_input);
});

$('#nic_pg_ratio').change('change', function () {
    var nicRatio = 100 - $('#nic_pg_ratio').val();
    $('#nic_vg_ratio').val(nicRatio);
});
$('#pg_ratio').change('change', function () {
    var vgRatio = 100 - $('#pg_ratio').val();
    $('#vg_ratio').val(vgRatio);
});

$(function() {
    $('#file').change(function(){
        console.log('file selected', this.id);
        flavor_profile.load_data($('#file').val());
        $(this).siblings('.text').text()
    });
})
//$("input").change(function() {
//    var inputs = $(this).closest('.calc_inputs').find(':input');
//    inputs.eq( inputs.index(this)+ 1 ).focus();
//});

