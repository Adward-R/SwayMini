__author__ = 'Adward'

from django.http import HttpResponse
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
    db_insert = Published(doc_id=_doc_id, doc_name="TestDoc", username=request.user.username)
    db_insert.save()

    return HttpResponseRedirect('../edit/'+_doc_id+'/')

def test_edit_panel(request):
    return render_to_response('edit_panel.html')

@login_required
def edit(request, doc_id="0000000000"):
    username = request.user.username
    doc_path = os.path.join(os.path.dirname(os.path.dirname(__file__)),
                            'static/data/', username, doc_id)
    t = get_template(os.path.join(doc_path, 'latest.html'))
    c = RequestContext(request, {"isEditMode": 1})
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
        return HttpResponse(t.render(c))