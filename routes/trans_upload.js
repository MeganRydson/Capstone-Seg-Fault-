var db      = require("mysql");
var router  = require("express").Router();

var con = db.createConnection({
    host     : 'db-segfault-cap.cae0l6rwojdw.us-east-1.rds.amazonaws.com',
    port     : '3306',
    user     : 'Segfaultcapstone',
    password : 'S3gfault2019',
    database : 'db-segfault-cap'
});

var tbl_arry = [];


//-Transactions Grid -----------------------------------------------------------

router.get("/trans_upload", function(req, res){
    con.query("SELECT Trans_Errors_Log.*, DATE_FORMAT(tre_TransDt, '%m/%d/%Y %l:%i %p') AS TransDt, " +
              "DATE_FORMAT(tre_CurDt, '%m/%d/%Y %l:%i %p') AS ImpDt, " + 
              "CONCAT('$ ',FORMAT(tre_TransAmt, 2)) AS Amount " +
              "FROM Trans_Errors_Log ORDER BY tre_CurDt DESC, trerror_ID ASC ", function (err, result, fields) {
        if (err) throw err;
        res.render("trans_upload", {transactions: result});
    });
});

//-------------------------------------------------------------------------------



// Loading File

router.post("/trans_upload", function(req, res){
    // Read file
    var fileinput = req.body.tr_File;
    // Read file with Node.js API
    var fs = require('fs');
    // var return_device_id;
    var return_event_id;
    fs.readFile(fileinput, 'utf8', function(err, data) {  
        if (err) {
            console.log("Invalid File!!!");
        }else{
            var validate = 0;
            var lines = 0;
            let splitLine = data.toString().split("\n");
            let split_ = splitLine.toString().split(",");
    
    
            // creating file object
            let device_tmp;
            let date_tmp;
            for (let i = 0; i < split_.length; i += 4) {
                
                if(split_[i]) {
                    date_tmp = split_[i+1]; 
                    let n_date = new Date(date_tmp).toISOString().split('T')[0];
                    let parse_date = new Date(date_tmp);
                    let minutes = parse_date.getMinutes();
                    if (minutes < 10){
                        minutes = "0" + minutes;
                    }
                    let time =  parse_date.getHours() + ':' + minutes;
                    date_tmp =  n_date + ' ' + time;
                    let status = 1;
                    line_details = {
                        'device_name' : split_[i],
                        'date_tmp': date_tmp,
                        'amt': split_[i + 2].split('$')[1],
                        'description': split_[i+3],
                        'status': status
                    }
                    get_device_info(con, line_details, function(return_device_id, result2){
                    })
                }
            }
        }
       
    });
    res.redirect("/trans_upload");
}); 

module.exports = router;

function get_device_info (con, line_details, callback) {
    
    var transactErrorDeleteAll = "DELETE FROM Trans_Errors_Log";
    con.query(transactErrorDeleteAll, function(err, result, fields) {
        if (err) throw err;
    });

    let return_device_id;
    let return_event_id;
    dev_id_qry = `
        SELECT
            dev_ID 
        FROM
            Devices 
        WHERE
            dev_Name = ?
    `
    con.query(dev_id_qry, [line_details['device_name']], function (err, result, fields) {
            if (err) throw err;
                return_device_id = result[0].dev_ID;
            if (return_device_id == null){
                callback(err);
            } else {
                qry = `SELECT ev_ID FROM Events_Has_Devices WHERE dev_ID = ? AND ev_dtBegin <= ? AND ev_dtEnds >= ? AND NOT ev_DtReturn = ''`
                con.query(qry, [return_device_id, line_details['date_tmp'], line_details['date_tmp']], function (err, result2, fields) {
                            if (err) throw err;
                            try {
                                return_event_id = result2[0].ev_ID;
                                var sqlEvent = "SELECT ev_ID FROM Events WHERE ev_ID = ? AND ev_Status = '3'";
                                con.query( sqlEvent, [return_event_id], function(err, result3, fields) {
                                    if (err) throw err;
                                    if (!err){
                                        if ( result3.length > 0){
                                            if (result3[0].ev_ID > 0 && return_device_id > 0 ){
                                                tbl_arry = [[
                                                    new Date(),
                                                    line_details['date_tmp'],
                                                    line_details['description'],
                                                    line_details['amt'],
                                                    return_device_id,
                                                    return_event_id,
                                                    line_details['status']
                                                ]];
                                                var sql = "INSERT INTO Transactions (tr_ImportDate, tr_Date, tr_Description, tr_Amt, tr_DevID, tr_EvID, tr_Status) VALUES ?";
                                                con.query( sql, [tbl_arry], function (err, result, fields) {
                                                        if (err) throw err;
                                                });
                                            }
                                        }
                                        var eventUpdate = "UPDATE Events SET ev_Status = '5' WHERE ev_ID = ?";
                                        con.query( eventUpdate, [return_event_id], function(err, result, fields) {
                                              if (err) throw err;
                                        });
                                    }
                                });
                            } catch(err) {
                                tbl_arry_error = [[
                                    line_details['date_tmp'],
                                    line_details['description'],
                                    line_details['amt'],
                                    'Device ID: ' + return_device_id + ' Event ID: ' + return_event_id,
                                    new Date()
                                ]];
                                var transError = "INSERT INTO Trans_Errors_Log (tre_TransDt, tre_DevDescr, tre_TransAmt, tre_ErrorDescr, tre_CurDt) VALUES ?";
                                con.query( transError, [tbl_arry_error], function(err, result, fields) {
                                    if (err) throw err;
                                });
                                callback(err);
                            }
                });                       
            }
    });
}