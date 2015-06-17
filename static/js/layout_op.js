/**
 * Created by Adward on 15/6/17.
 */

var new_row_num = 0;
var box_clicked = null;

$(document).ready(function() {
        //Load row info to navigation bar
        var rows = $("#gridContent").children();
        for (var idx=0; idx<rows.length; idx++) {
            var row_id = $(rows.get(idx)).attr("id"); //converted DOM obj to jQuery obj
            var del_itm = $("<li><a onclick=\"delRow('"+row_id+"')\">"+row_id+"</a></li>");
            $("#delRowMenu").append(del_itm);
        }
    });

function addRowModal() {
    document.getElementById("col_ratio").value = "3:4:5";
    $("#addRowModal").modal({backdrop:true},{keyboard:true});
}

function addRow() {
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
    if (sum_of_ratio!=12) { //
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
        col_id = row_id+"-colno-"+idx;
        var new_col = $("<div>New comer!!!</div>")
            .attr("class", "col-xs-"+col_ratio[idx]+" col-sm-"+col_ratio[idx])
            //TODO: match different screen sizes
            .attr("id", col_id)
            .attr("onclick", "changeContent('"+col_id+"')")//TODO: when click on col blocks
            .css("background-color", "#dedef8")
            .css("box-shadow", "inset 1px -1px 1px #444, inset -1px 1px 1px #444")
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
    var del_itm = $("<li><a onclick=\"delRow('"+row_id+"')\">"+row_id+"</a></li>");
    $("#delRowMenu").append(del_itm);
}

//referenced when loading doc for editing, and when adding new row
function delRow(row_id) {
    $("#"+row_id).remove();
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