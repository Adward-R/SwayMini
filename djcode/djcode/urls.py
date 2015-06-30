from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'djcode.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^hello', 'djcode.demo_views.hello'),
    url(r'^$','djcode.demo_views.home'),
    url(r'^admin/', include(admin.site.urls)),
)
