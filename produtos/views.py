from django.views.decorators.http import require_http_methods
from .models import Produto

@require_http_methods('POST')
def view(request):
    pass

@require_http_methods('POST')
def view_all(request):
    pass

@require_http_methods('POST')
def add(request):
    pass

@require_http_methods('POST')
def rm(request):
    pass

@require_http_methods('POST')
def put(request):
    pass