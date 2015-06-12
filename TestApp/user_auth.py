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
from django.template.context import RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from TestApp.models import Published

def signup(request):
    return render(request, 'signup.html')

def signed_up(request):
    _username = request.POST['username']
    _passwd = request.POST['passwd']
    User.objects.create_user(username=_username, password=_passwd)
    t = get_template('home.html')
    user = authenticate(username=_username, password=_passwd)
    login(request, user)
    return HttpResponseRedirect('../home', t.render())

def signin(request):
    return render(request, 'signin.html')

def signed_in(request):
    _username = request.POST['username']
    _passwd = request.POST['passwd']
    t = get_template('signup.html')
    user = authenticate(username=_username, password=_passwd)
    if user is not None:
        if user.is_active: #valid, active and authenticated
            login(request, user)
            return HttpResponseRedirect('../home/')
        else:
            print("User disabled, yet passwd valid") #not likely
    else:
        #TODO when login in error occurs
        print("Info provided does not match")
    #return HttpResponse(str(request.POST))

def signout(request):
    logout(request)
    return HttpResponseRedirect('../signin/')

@login_required
def home(request):
    t = get_template("home.html")
    _username = request.user.username
    lst = Published.objects.filter(username=_username) #SELECT * FROM PUBLISHED WHERE ...
    c = RequestContext(request, {"username": _username, "doc_lst": lst})
    return HttpResponse(t.render(c))

