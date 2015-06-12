"""SwayMini URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    # url(r'^$', 'djcode.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^test_back/$', 'TestApp.demo_views.test_back'),
    url(r'^test_front/$', 'TestApp.demo_views.test_front'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^signup/', 'TestApp.user_auth.signup'),
    url(r'^signin/', 'TestApp.user_auth.signin'),
    url(r'^signed_up/', 'TestApp.user_auth.signed_up'),
    url(r'^signed_in/', 'TestApp.user_auth.signed_in'),
    url(r'^signout', 'TestApp.user_auth.signout'),
    url(r'^home/', 'TestApp.user_auth.home'),
    url(r'^new_doc/', 'TestApp.doc_op.new_doc'),
    url(r'^edit_panel/', 'TestApp.doc_op.test_edit_panel'), #test page arrangement
    url(r'^edit/(?P<doc_id>[0-9]{10})/$', 'TestApp.doc_op.edit'),
    url(r'^show/(?P<doc_id>[0-9]{10})/$', 'TestApp.doc_op.show'),
]
