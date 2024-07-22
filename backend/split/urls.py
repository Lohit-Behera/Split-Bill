from django.urls import path
from . import views

urlpatterns = [
    path('group/create/', views.create_group,name='create_group'),
    path('group/list/', views.list_group,name='list_group'),
    
    path('group/<str:pk>/', views.get_group,name='get_group'),
    path('create/payment/<str:pk>/', views.create_payment,name='create_payment'),
    path('payment/<str:pk>/', views.get_payment,name='get_payment'),
    path('list/payment/<str:pk>/', views.list_payment,name='list_payment'),
    path('delete/group/<str:pk>/', views.delete_group,name='delete_group'),
    path('delete/payment/<str:pk>/', views.delete_payment,name='delete_payment'),
    path('update/group/name/<str:pk>/', views.update_group_name,name='update_group_name'),
    path('update/payment/<str:pk>/', views.update_payment,name='update_payment'),
]