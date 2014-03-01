/**
 * Created by justin herter on 2/12/14.
 */

var formula_calc = {
    flavor_pg_content: 100, // if this is less than 100% the pg/vg volume calculation will need to reflect (if no pg or vg divide the flavor volume by 2 and subtract from pg/vg volume)
    flavor_percentage: null, // percentage of flavor in formula
    flavor_volume: null, // total volume of flavor in formula
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

    calc: function () {
        this.target_volume = document.getElementById('target_volume').value;
        this.nic_start_mg = document.getElementById('nic_start_mg').value;
        this.nic_target_mg = document.getElementById('nic_target_mg').value;
        this.nic_pg_ratio = document.getElementById('nic_pg_ratio').value;
        this.nic_vg_ratio = document.getElementById('nic_vg_ratio').value;
        this.pg_ratio = document.getElementById('pg_ratio').value;
        this.vg_ratio = document.getElementById('vg_ratio').value;
        this.flavor_percentage = document.getElementById('flavor_percentage').value;
        this.nic_volume = (this.nic_target_mg / this.nic_start_mg) * this.target_volume;
        this.flavor_volume = ((this.flavor_percentage / 100) * this.target_volume);
        this.pg_volume = ((this.pg_ratio / 100) * this.target_volume) - ((this.flavor_pg_content / 100) * this.flavor_volume) - ((this.nic_pg_ratio / 100) * this.nic_volume);
        this.vg_volume = ((this.vg_ratio / 100) * this.target_volume) - ((this.nic_vg_ratio / 100) * this.nic_volume);
        console.log('Object Values: ', this);
        if (this.nic_volume && this.flavor_volume && this.pg_volume && this.vg_volume) {
            document.getElementById('results').innerHTML =
                'Nicotine Volume: ' + this.nic_volume.toPrecision(2) + 'ml' + '<br />' +
                'Flavoring Volume: ' + this.flavor_volume + 'ml' + '<br />' +
                'PG Volume: ' + this.pg_volume + 'ml' + '<br />' +
                'VG Volume: ' + this.vg_volume + 'ml' + '<br />'
            ;
        }
    }
}

$('select').selectpicker();



