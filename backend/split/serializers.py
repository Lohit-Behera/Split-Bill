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
        fields = ['group', 'amount', 'name', 'created_at']
        
class GroupListSerializer(serializers.ModelSerializer):
    members = PersonSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ['id', 'name', 'members', 'total_amount']
        
class PaymentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'name', 'payer_name', 'amount', 'created_at']
        
class PersonNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ['name']

class ForLiquidationSerializer(serializers.ModelSerializer):
    payer = PersonNameSerializer()
    
    class Meta:
        model = Payment
        fields = ['payer', 'amount']
