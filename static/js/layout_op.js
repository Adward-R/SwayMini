/**
 * Created by Adward on 15/6/17.
 */

var new_row_num = 0;
var box_clicked = null;
var block_id = null;
/*when chContentMute is true, clicking the blocks cannot change their contents;
    this is for control or test html5 audio/video controllers
 */
var chContentMute = false;

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
        $(cols.get(i)).css("background-color", "#ffffff"); //white
    }
}

function highlightCol(col_id) {
    $("#"+col_id).css("background-color", "#c0c0c0"); //light grey
}

function unlightCol(col_id) {
    $("#"+col_id).css("background-color", "#ffffff"); //white
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
        var new_col = $("<div><br/><br/><br/></div>")
            .attr("class", "col-xs-"+col_ratio[idx]+" col-sm-"+col_ratio[idx])
            //TODO: match different screen sizes
            .attr("id", col_id)
            .attr("onclick", "insContent('"+col_id+"')")//TODO: when click on col blocks
            .attr("onmouseover", "highlightCol('"+col_id+"')")
            .attr("onmouseout", "unlightCol('"+col_id+"')")
            .css("background-color", "#ffffff"); //white
            //.css("box-shadow", "inset 1px -1px 1px #444, inset -1px 1px 1px #444")
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
    if (chContentMute) {
        return;
    }
    for (var idx=0; idx<4; idx++) {
        if (idx==col_id[0]) {
            $("#colType" + idx).attr("class", "active"); //highlight pre-chosen type
        }
        else {
            $("#colType" + idx).attr("class", ""); //unlight
        }
    }
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

function checkFormat(src, dataType) {
    /*
     dateType: 0 for text, 1 for img, 2 for audio, 3 for video
     */
    var postfix = src.substring(src.lastIndexOf('.')+1, src.length-1);
    switch (dataType) {
        case 1: {
            if (postfix=="jpg"
                || postfix=="jpeg"
                || postfix=="png"
                || postfix=="gif"
            ) return postfix;
        }
            break;
        case 2: {
            if (postfix=="mp3"
                || postfix=="ogg"
                || postfix=="wav"
            ) return postfix;
        }
            break;
        case 3: {
            if (postfix=="mp4"
                || postfix=="webm"
                || postfix=="ogg"
            ) return postfix;
        }
            break;
        default : {
            return "."; //indicates wrong type
        }
            break;
    }
}

//the following content-insertion func read from global var [block_id]
function insText() {
    if (block_id[0]!='0') { //was not text type
        new_block_id = '0' + block_id.substring(1, block_id.length);
        $("#"+block_id)
            .attr({"id": new_block_id,
                    "onclick": "insContent('"+new_block_id+"')"});
        block_id = new_block_id;
        $("#chText").val("Default text...");
    }
    else {
        $("#chText").val($("#" + block_id).text());
    }
    $("#insTextModal").modal({backdrop:true},{keyboard:true}); //show modal
    //////
    //$("#chText").val($("#"+block_id).text());
    //$("#insTextModal").modal({backdrop:true},{keyboard:true}); //show modal
}

function chText() {
    var ins = $("#chText").val();
    if (ins.length>1024) { //limitation
        alert("Too long text!");
    }
    else {
        $("#"+block_id).text(ins);
        $("#insTextModal").modal('hide');
        block_id = null;
    }
}

function insImage() {
    if (block_id[0]!='1') { //was not img type
        new_block_id = '1' + block_id.substring(1, block_id.length);
        $("#"+block_id)
            .attr({"id": new_block_id,
                    "onclick": "insContent('"+new_block_id+"')",
                    "onmouseover": "highlightCol('"+new_block_id+"')",
                    "onmouseout": "unlightCol('"+new_block_id+"')"
            });
        block_id = new_block_id;
        $("#imgLink").val("http://");
    }
    else {
        //$("#imgLink").val($("#" + block_id).text().attr("src"));
        //TODO: previous src url in right format corresponds to extern/local type
    }
    $("#insImgModal").modal({backdrop:true},{keyboard:true}); //show modal
}

function chImage() {
    var isChecked = false;
    var src = "";
    var inputs = $("#imgLink").val().trim();
    if (inputs == "") {
        alert("Empty src!");
        return;
    } //legal cmp??

    if (document.getElementById("imgSrcExtern").checked) {
        isChecked = true;
        src = inputs;
    }
    else if (document.getElementById("imgSrcLocal").checked) {
        isChecked = true;
        username = document.getElementById("userName").innerHTML.trim();
        src = "../../static/data/" + username + "/res/" + inputs + "/";
    }

    if (!isChecked) {
        alert("You must choose one url src type!");
    }
    else {
        //legal src get
        var imgFormat = checkFormat(src, 1);
        if (imgFormat == ".") {
            alert("Image must be .jpg/.jpeg, .gif or .png!");
        }
        else {
            var block = $("#" + block_id);
            block.empty();
            var thumbnail = $("<div class=\"thumbnail\"></div>");
            var img = $("<img src=\"" + src + "\" class=\"img-responsive img-rounded\">");
            thumbnail.append(img);
            block.append(thumbnail);
            $("#insImgModal").modal('hide');
            block_id = null;
        }
    }
}

function insAudio() {
    if (block_id[0]!='2') { //was not audio type
        new_block_id = '2' + block_id.substring(1, block_id.length);
        $("#"+block_id)
            .attr({
                "id": new_block_id,
                "onclick": "insContent('" + new_block_id + "')",
                "onmouseover": "highlightCol('" + new_block_id + "')",
                "onmouseout": "unlightCol('" + new_block_id + "')"
            });
        block_id = new_block_id;
        $("#audioLink").val("http://");
    }
    else {
        //$("#"+block_id).val($("#" + block_id).text().attr("src"));
        //TODO: previous src url in right format corresponds to extern/local type
    }
    $("#insAudioModal").modal({backdrop:true},{keyboard:true}); //show modal
}

function chAudio() {
    var isChecked = false;
    var src = "";
    var inputs = $("#audioLink").val().trim();
    if (inputs=="") {
        alert("Empty src!");
        return;
    } //legal cmp??

    if (document.getElementById("audioSrcExtern").checked) {
        isChecked = true;
        src = inputs;
    }
    else if (document.getElementById("audioSrcLocal").checked) {
        isChecked = true;
        username = document.getElementById("userName").innerHTML.trim();
        src = "../../static/data/"+username+"/res/"+inputs+"/";
    }

    if (!isChecked) {
        alert("You must choose one url src type!");
    }
    else {
        //legal src get
        //TODO: audio controller size problem
        var audFormat = checkFormat(src, 2);
        if (audFormat==".") {
            alert("Audio must be .mp3, .ogg or .wav!");
        }
        else {
            var block = $("#" + block_id);
            //var span_num = block.attr("class").toString().split(" ")
            block.empty();
            var audWrap = $("<div class=\"audio-container\"></div>");
            var audCtrl = $("<audio controls> 您的浏览器不支持audio元素 </audio>");
            var audSrc = $("<source src=\"" + src + "\" type=\"audio/"+audFormat+"\">");
            audCtrl.append(audSrc);
            audWrap.append(audCtrl);
            block.append(audWrap);
            $("#insAudioModal").modal('hide');
            block_id = null;
        }
    }
}

function insVideo() {
    if (block_id[0]!='3') { //was not video type
        new_block_id = '3' + block_id.substring(1, block_id.length);
        $("#"+block_id)
            .attr({
                "id": new_block_id,
                "onclick": "insContent('" + new_block_id + "')",
                "onmouseover": "highlightCol('" + new_block_id + "')",
                "onmouseout": "unlightCol('" + new_block_id + "')"
            });
        block_id = new_block_id;
        $("#videoLink").val("http://");
    }
    else {
        //$("#videoLink").val($("#" + block_id).text().attr("src"));
    }
    $("#insVideoModal").modal({backdrop:true},{keyboard:true}); //show modal
}

function chVideo() {
    var isChecked = false;
    var src = "";
    var inputs = $("#videoLink").val().trim();
    if (inputs=="") {
        alert("Empty src!");
        return;
    } //legal cmp??

    if (document.getElementById("videoSrcExtern").checked) {
        isChecked = true;
        src = inputs;
    }
    else if (document.getElementById("videoSrcLocal").checked) {
        isChecked = true;
        username = document.getElementById("userName").innerHTML.trim();
        src = "../../static/data/"+username+"/res/"+inputs+"/";
    }

    if (!isChecked) {
        alert("You must choose one url src type!");
    }
    else {
        //legal src get
        var vidFormat = checkFormat(src, 3);
        if (vidFormat==".") {
            alert("Video must be .mp4, .ogg or .webm!");
        }
        else {
            var block = $("#" + block_id);
            //var span_num = block.attr("class").toString().split(" ")
            block.empty();
            var vidWrap = $("<div class=\"video-container\"></div>");
            var vidCtrl = $("<video controls> 您的浏览器不支持video元素 </video>");
            var vidSrc = $("<source src=\"" + src + "\" type=\"video/"+vidFormat+"\">");
            vidCtrl.append(vidSrc);
            vidWrap.append(vidCtrl);
            block.append(vidWrap);
            $("#insAudioModal").modal('hide');
            block_id = null;
        }
    }
}

//end of content-insertion func

function toggleMute() {
    chContentMute = !chContentMute;
}

$(function () {
    var firstUp = true;
    //first progressall then done
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            var alertArea = $("#uploadAlert");
            if (firstUp) {
                alertArea
                    .attr("class", "alert alert-success")
                    .text("Uploads all Succeeded!");
                alertArea.append("<br/>"+"You may refer to these files directly by their names:");
                firstUp = false;
            }
            alertArea.append("<br/>"+data.files[0]['name']);
        },
        progressall: function (e, data) {

            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        }
    });
});

