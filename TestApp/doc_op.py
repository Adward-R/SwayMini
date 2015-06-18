__author__ = 'Adward'

from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponseRedirect
from django.core.files import File
import re
import os
import time
import shutil
from django.template.context import RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from TestApp.models import Published
#from django.utils import json
from django.http import JsonResponse
from TestApp.json2html import json2html

@login_required
def new_doc(request):
    data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                            'static/data/')
    user_path = os.path.join(data_path, request.user.username)
    if not os.path.exists(user_path):
        os.mkdir(user_path)
    _doc_id = str(int(time.time()))
    doc_path = os.path.join(user_path, _doc_id)
    os.mkdir(doc_path)
    #create latest.html
    shutil.copy(os.path.join(os.path.dirname(__file__), 'templates', 'edit_panel.html'),
                os.path.join(doc_path, 'latest.html'))
    #insert the record into database
    db_insert = Published(doc_id=_doc_id, doc_name=request.POST['fname'], username=request.user.username)
    db_insert.save()

    return HttpResponseRedirect('../edit/'+_doc_id+'/')

def test_edit_panel(request):
    return render_to_response('edit_panel.html')

@login_required
def edit(request, doc_id="0000000000"):
    isPublic = Published.objects.get(doc_id=doc_id).isPublic
    docName = Published.objects.get(doc_id=doc_id).doc_name
    username = request.user.username
    doc_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                            'static/data/', username, doc_id)
    t = get_template(os.path.join(doc_path, 'latest.html'))
    c = RequestContext(request,
                       {"isEditMode": 1, "doc_id": doc_id, "username": username,
                        "isPublic": isPublic, "docName": docName})
    return HttpResponse(t.render(c))

def show(request, doc_id="0000000000"):
    try:
        record = Published.objects.get(doc_id=doc_id)
    except:
        #TODO [doc does not exist error] page
        return HttpResponse("<p>Doc does not exist!</p>")

    if not record.isPublic:
        #TODO [doc has not been published] error page
        return HttpResponse("<p>Doc has not been published!</p>")
    else: #normally show the published doc
        author = record.username
        #doc_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
         #                   'static/data/', author, doc_id)
        t = get_template(author+'/'+doc_id+'/latest.html')
        #c = RequestContext(request, {"isEditMode": 0})
        return HttpResponse(t.render())

@login_required
def save(request, doc_id="00000000000"): #11 bits, 10+1 ctrl
    save_path = os.path.join('static', 'data', request.user.username, doc_id[0:10])
    latest_path = os.path.join(save_path, 'latest.html')

    if int(doc_id[-1])==1: #start section
        prev_path = os.path.join(save_path, 'previous.html')
        panel_head_path = os.path.join('TestApp', 'templates', 'panel_head.html')
        if os.path.exists(prev_path):
            os.remove(prev_path)
        if os.path.exists(latest_path):
            os.rename(latest_path, prev_path)
        shutil.copy(panel_head_path, latest_path)

    with open(latest_path, 'a', encoding='utf-8') as fa:
        fa.write(str(request.POST["sub_s"]))
        fa.write("\n    </body>\n</html>")

    #if int(doc_id[-1])==2: #end section
    if True:
        panel_foot_path = os.path.join('TestApp', 'templates', 'panel_foot.html')
        with open(latest_path, 'a', encoding='utf-8') as dest:
            with open(panel_foot_path, encoding='utf-8') as src:
                shutil.copyfileobj(src, dest)
    return HttpResponse("") #TODO: multi html code page POST transfer and re-org

@login_required
def publish(request, doc_id="0000000000"):
    try:
        record = Published.objects.get(doc_id=doc_id)
        record.isPublic = True
        record.save()
        return HttpResponse(0)
    except:
        return HttpResponse(1)

@login_required
def unpublish(request, doc_id="0000000000"):
    try:
        record = Published.objects.get(doc_id=doc_id)
        record.isPublic = False
        record.save()
        return HttpResponse(0)
    except:
        return HttpResponse(1)

@login_required
def rollback(request, doc_id="0000000000"):
    save_path = os.path.join('static', 'data', request.user.username, doc_id)
    latest_path = os.path.join(save_path, 'latest.html')
    prev_path = os.path.join(save_path, 'previous.html')
    if not os.path.exists(prev_path): #no previous version to rollback
        pass
    else: #has prev ver, implements rolling back operation
        os.remove(latest_path)
        os.rename(prev_path, latest_path)
        t = get_template(
                        os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                     'static/data/',
                                     request.user.username,
                                     doc_id,
                                     'latest.html'
                        )
        )
    #TODO: use a context variable to indicate it is already the oldest ver to user
    return HttpResponseRedirect("/edit/"+doc_id+"/", t.render())

@login_required
def delete(request, doc_id="0000000000"):
    _username = request.user.username
    save_path = os.path.join('static', 'data', _username, doc_id)
    if os.path.exists(save_path):
        shutil.rmtree(save_path)
    Published.objects.filter(doc_id=doc_id).delete()
    t = get_template("home.html")
    lst = Published.objects.filter(username=_username) #SELECT * FROM PUBLISHED WHERE ...
    c = RequestContext(request, {"username": _username, "doc_lst": lst})
    return HttpResponseRedirect("/home/", t.render(c))