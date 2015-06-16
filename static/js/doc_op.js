/**
 * Created by Adward on 15/6/16.
 */

function docSave(doc_id) {
    document.getElementById("js_info").innerHTML = "Changed body...";
    //var htmlstring = document.documentElement.outerHTML;
    var htmlstring = document.getElementById("workingArea").outerHTML;
    var s_len = htmlstring.length;

    var section_len = 65535;
    for (var i = 0; i < s_len; i += section_len) {
        var sub_s = htmlstring.substring(i, (i+section_len-1>=s_len)?s_len:i+section_len);
        var ctrl_url = "";
        if (i==0) ctrl_url = "/save/"+doc_id+"1/"; //ctrl bit 1 for start
        else if (i+section_len-1>=s_len) ctrl_url = "/save/"+doc_id+"2/"; //ctrl bit 2 for end
        else ctrl_url = "/save/"+doc_id+"0/"; //ctrl bit 0 for carry
        $.post(
            ctrl_url,
            {"sub_s": sub_s},
            function(data, status) {
                alert("Saved!");
                //console.log(sub_s);
            }
        );
    }
}

function docPublish(doc_id) {
    $.post(
        "/publish/"+doc_id+"/",
        {},
        function(data, status) {
            if (data==1) {
                alert("Please Try Again!")
            }
            else {
                alert("Published!")
            }
        }
    );
}

function docUnpublish(doc_id) {
    $.post(
        "/unpublish/"+doc_id+"/",
        {},
        function(data, status) {
            if (data==1) {
                alert("Please Try Again!")
            }
            else {
                alert("Unpublished!")
            }
        }
    );
}

function docRollback(doc_id) {
    var conf = confirm("Sure to rollback this doc to a previous version?");
    if (conf==true) {
        window.location.href = "/rollback/"+doc_id+"/";
    }
}

function docDelete(doc_id) {
    var conf = confirm("Sure to delete this doc?");
    if (conf==true) {
        window.location.href = "/delete/"+doc_id+"/";
    }
}

function backHome(doc_id) {
    docSave(doc_id); //TODO: callback to block returning, waiting for saving?
    window.location.href = "/home/";
}