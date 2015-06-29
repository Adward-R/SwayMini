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
import time
from django import forms
from django.forms.util import ErrorList

from TestApp.models import Published

class SigninForm(forms.Form):
    username = forms.CharField(max_length=20)
    passwd = forms.CharField(max_length=20, min_length=6)

#    def clean_username(self):
 #       _username = self.cleaned_data['username']
  #      if not User.objects.filter(username=_username):
   #         raise forms.ValidationError('用户不存在')
    #    return _username

    def clean(self):
        cleaned_data = super(SigninForm, self).clean()
        _username = cleaned_data.get('username', '')
        _passwd = cleaned_data.get('passwd', '')
        if not User.objects.filter(username=_username):
            error_msg = ["用户不存在！"]
            super(SigninForm, self).errors['passwd'] = ErrorList(error_msg)
        else:
            user = authenticate(username=_username, password=_passwd)
            if user is None:
                error_msg = ["密码错误!"]
                super(SigninForm, self).errors['passwd'] = ErrorList(error_msg)
                #raise forms.ValidationError('密码错误')
        return cleaned_data

class SignupForm(forms.Form):
    username = forms.CharField(max_length=20)
    passwd = forms.CharField(max_length=20, min_length=6)
    repasswd = forms.CharField(max_length=20, min_length=6)

    def clean(self):
        cleaned_data = super(SignupForm, self).clean()
        _username = cleaned_data.get('username', '')
        _passwd = cleaned_data.get('passwd', '')
        _repasswd = cleaned_data.get('repasswd', '')
        if User.objects.filter(username=_username):
            error_msg = ["该用户名已存在"]
            super(SignupForm, self).errors['passwd'] = ErrorList(error_msg)
        else:
            if _passwd != _repasswd:
                error_msg = ["两次输入密码不一致!"]
                super(SignupForm, self).errors['passwd'] = ErrorList(error_msg)
        return cleaned_data

def signup(request):
    form = SignupForm()
    t = get_template('signup.html')
    c = RequestContext(request, {"form": form})
    return HttpResponse(t.render(c))

def signed_up(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
    else:
        form = SignupForm()

    if form.is_valid():
        _username = form.cleaned_data['username']
        _passwd = form.cleaned_data['passwd']
        User.objects.create_user(username=_username, password=_passwd)
        user = authenticate(username=_username, password=_passwd)
        login(request, user)
        return HttpResponseRedirect('../home')

    t = get_template('signup.html')
    c = RequestContext(request, {'form': form})
    return HttpResponse(t.render(c))


def signin(request):
    bg_path = os.path.join(os.path.dirname(__file__), '../static/img/bg/')
    fnames = os.listdir(bg_path)
    fname = ""
    while True:
        idx = int(time.time()) % 7
        fname = fnames[idx]
        if fname!=".DS_Store":
            break
    form = SigninForm()
    t = get_template("signin.html")
    c = RequestContext(request, {"bgFileName": fname, "form": form})
    return HttpResponse(t.render(c))

def signed_in(request):
    bg_path = os.path.join(os.path.dirname(__file__), '../static/img/bg/')
    fnames = os.listdir(bg_path)
    fname = ""
    while True:
        idx = int(time.time()) % 7
        fname = fnames[idx]
        if fname!=".DS_Store":
            break

    form = ""
    if request.method == 'POST':
        form = SigninForm(request.POST)
    else:
        form = SigninForm()

    if form.is_valid(): #has their own exits
            _username = form.cleaned_data['username']
            _passwd = form.cleaned_data['passwd']
            user = authenticate(username=_username, password=_passwd)
            if user is not None:
                if user.is_active: #valid, active and authenticated
                    login(request, user)
                    return HttpResponseRedirect('../home/') #most likely exit here
                else:
                    print("User disabled, yet passwd valid") #not likely
            else:
                #TODO when login in error occurs
                print("Info provided does not match")
        #return HttpResponse(str(request.POST)) #for debug

    # else, back to login page
    t = get_template('signin.html')
    c = RequestContext(request, {'form': form, 'bgFileName': fname})

    return HttpResponse(t.render(c))


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

