from rest_framework import serializers

from .views import Group, Payment, Person

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'
        
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        
class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'
        
class PaymentDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['amount', 'name', 'created_at']
        
class GroupListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']