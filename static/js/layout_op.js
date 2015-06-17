/**
 * Created by Adward on 15/6/17.
 */

var new_row_num = 0;
var box_clicked = null;
var block_id = null;

$(document).ready(function() {
        //Load row info to navigation bar
        var rows = $("#gridContent").children();
        for (var idx=0; idx<rows.length; idx++) {
            var row_id = $(rows.get(idx)).attr("id"); //converted DOM obj to jQuery obj
            var del_itm = $("<li><a onclick=\"delRow('"+row_id+"')\">"+row_id+"</a></li>");
            $("#delRowMenu").append(del_itm);
        }
    });

//referenced when loading doc for editing, and when adding new row
function delRow(row_id) {
    $("#"+row_id).remove();
    $("#"+row_id+"-del-handle").remove();
}

function highlightRow(row_id) {
    cols = $("#"+row_id).children();
    for (var i=0; i<cols.length; i++) {
        $(cols.get(i)).css("background-color", "#ff5050"); //red
    }
}

function unlightRow(row_id) {
    cols = $("#"+row_id).children();
    for (var i=0; i<cols.length; i++) {
        $(cols.get(i)).css("background-color", "#cccccc"); //white
    }
}

function changeContent(col_id) {
    box_clicked = document.getElementById(col_id);
    document.getElementById("modal_content").value = box_clicked.innerHTML.trim().replace("<p>","").replace("</p>","");
    $("#myModal").modal({backdrop:true},{keyboard:true});
}

function writeContent() {
    var box_content = document.getElementById("modal_content").value;
    if (box_content==''||box_content==' ') {}
    else {
        box_clicked.innerHTML = box_content;
    }
    box_clicked = null;
}

function addRowModal() {
    document.getElementById("col_ratio").value = "3:4:5";
    $("#addRowModal").modal({backdrop:true},{keyboard:true});
}

function addRow() {
    //input data sanity check
    var sum_of_ratio = 0;
    var col_ratio = $("#col_ratio").val().split(":")
        .map(function(num) {
            var ratio = parseInt(num);
            if (Object.is(ratio, NaN)) {
                //cannot use "==="
                alert("Format Error!");
                return;
            }
            else {
                sum_of_ratio += ratio;
                return ratio;
            }
        });
    if (sum_of_ratio!=12) {
        alert("Sum of ratio must equal to 12!")
        return;
    }
    //console.log(col_ratio);
    var row_id = "rowno-"+new_row_num;
    new_row_num += 1;
    var new_row = $("<div class='row'></div>")
        .attr("id", row_id);
    $("#gridContent").append(new_row);

    var col_id = "";
    for (var idx=0; idx<col_ratio.length; idx++) {
        col_id = "0-"+row_id+"-colno-"+idx;
        //first digit of col_id indicates its content type, default 0
        //0 for text, 1 for image, 2 for audio, 3 for video, 4 for carousel
        var new_col = $("<div>New comer!!!</div>")
            .attr("class", "col-xs-"+col_ratio[idx]+" col-sm-"+col_ratio[idx])
            //TODO: match different screen sizes
            .attr("id", col_id)
            .attr("onclick", "insContent('"+col_id+"')")//TODO: when click on col blocks
            .css("background-color", "#cccccc") //light grey
            //.css("box-shadow", "inset 1px -1px 1px #444, inset -1px 1px 1px #444")
            .text("default text");
        $("#"+row_id).append(new_col);
    }
    //now col_id contains last col's id
    /*var delRowButton = $("<button>del</button>")
        .attr("type", "button")
        .attr("class", "btn btn-warning btn-xs pull-right") //warning-like, extra-small
        .attr("onclick", "delRow('"+row_id+"')");
    $("#"+col_id).append(delRowButton);*/

    //now add row-deleting handle into navigation bar
    var del_itm = $("<li><a onclick=\"delRow('"+row_id+"')\">"+row_id+"</a></li>")
        .attr("id", row_id+"-del-handle")
        .attr("onmouseover", "highlightRow('"+row_id+"')")
        .attr("onmouseout", "unlightRow('"+row_id+"')");
    $("#delRowMenu").append(del_itm);
}

//toggle the modal for media content insertion
function insContent(col_id) {
    $("#colType"+col_id[0]).attr("class", "active"); //highlight pre-chosen type
    block_id = col_id; //record the number of block(col) under ctrl in a extern var
    $("#insModal").modal({backdrop:true},{keyboard:true}); //show modal
}

function insContentBranch(colType) {
    //hide modal which is toggled up in insContent()
    $("#insModal").modal('hide');
    switch (colType) {
        case 0: insText();break;
        case 1: insImage();break;
        case 2: insAudio();break;
        case 3: insVideo();break;
        default :;
    }
}

//the following content-insertion func read from global var [block_id]
function insText() {
    $("#chText").val($("#"+block_id).text());
    $("#insTextModal").modal({backdrop:true},{keyboard:true}); //show modal
}

function chText() {
    $("#"+block_id).text($("#chText").val());
    $("#insTextModal").modal('hide');
    block_id = null;
}

function insImage() {

}

function chImage() {

}

function insAudio() {

}

function chAudio() {

}

function insVideo() {

}

function chVideo() {

}

//end of content-insertion func