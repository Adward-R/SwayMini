# -*- coding: utf-8 -*-
from django.db import models

class Published(models.Model):
    doc_id = models.CharField(max_length=10, primary_key=True)
    doc_name = models.CharField(max_length=100)
    username = models.CharField(max_length=20)
    isPublic = models.BooleanField(default=False)