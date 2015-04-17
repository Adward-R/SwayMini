from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.shortcuts import render
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.core.files import File
import math
import re
from django.template.context import RequestContext

def hello(request):
        
        return HttpResponse("Hello world")

def home(request):
        return render(request,
                      'index.html') 
