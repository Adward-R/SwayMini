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
def uploadfile(request):
    f = request.FILES["files[]"]
    username = request.user.username
    save_path = os.path.join(os.path.dirname(__file__),
                             '../static/data', username, 'res')
    if not os.path.exists(save_path):
        os.mkdir(save_path)
    #print(f.content_type)
    #TODO: limit upload file formats
    #TODO: process bar correction
    with open(os.path.join(save_path, str(f)), 'wb+') as dest:
        for chunk in f.chunks():
            dest.write(chunk)
    return JsonResponse({"loaded": 3, "fname": str(f)}) #any num for [loaded] by far

@login_required
def resLib(request):
    username = request.user.username
    save_path = os.path.join(os.path.dirname(__file__),
                             '../static/data', username, 'res')
    if not os.path.exists(save_path):
        os.mkdir(save_path)
    file_lst = os.listdir(save_path)
    fnames = []
    for f in file_lst:
        fnames.append(f)
    t = get_template('res_lib.html')
    c = RequestContext(request, {"username":username, "fnames": fnames})
    return HttpResponse(t.render(c))