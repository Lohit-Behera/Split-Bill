from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from .models import Group, Payment, Person
from .serializers import GroupSerializer, PaymentSerializer, PersonSerializer, PaymentDetailsSerializer, GroupListSerializer

@api_view(['PUT'])
def create_group(request):
    try:
        data = request.data
        if len(data['members']) < 2:
            return Response({"error": "Group should have at least 2 members"}, status=status.HTTP_400_BAD_REQUEST)
        
        group = Group.objects.create(name=data['name'])
        
        for name in data['members']:
            person, created = Person.objects.get_or_create(name=name, group=group)
            group.members.add(person)
        group.save()
        
        serializer = GroupSerializer(group, many=False)
        persons = Person.objects.filter(group=group)
        persons_serializer = PersonSerializer(persons, many=True)
        
        return Response({'group': serializer.data, 'persons': persons_serializer.data}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    

@api_view(['GET'])
def get_group(request, pk):
    try:
        group = Group.objects.get(id=pk)
        serializer = GroupSerializer(group, many=False)
        persons_serializer = PersonSerializer(group.members, many=True)
        return Response({'group':serializer.data, 'persons':persons_serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_payment(request,pk):
    try:
        data = request.data
        group = Group.objects.get(id=pk)
        payer = Person.objects.get(id=data['payer'])
        payment = Payment.objects.create(amount=data['amount'], group=group , name=data['name'], payer=payer)
        
        for person in data['payment_for']:
            payment.payment_for.add(Person.objects.get(id=person))
        payment.save()
        
        serializer = PaymentSerializer(payment, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_payment(request, pk):
    try:
        payment = Payment.objects.get(id=pk)
        payment_for = payment.payment_for.all()
        payer = payment.payer
        amount = payment.amount
        split_amount = amount / len(payment_for)
        payment_for = PersonSerializer(payment_for, many=True).data
        payer = PersonSerializer(payer, many=False).data
        payment_details = PaymentDetailsSerializer(payment, many=False).data
        return Response({'payment_for':payment_for, 'payer':payer, 'split_amount':round(split_amount, 2), 'payment_details': payment_details}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def list_group(request):
    try:
        groups = Group.objects.all()
        serializer = GroupListSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def list_payment(request, pk):
    try:
        payments = Payment.objects.filter(group=pk)
        payers = payments.values_list('payer', flat=True).distinct()
        payers = Person.objects.filter(id__in=payers)
        serializer = PaymentSerializer(payments, many=True)
        person_serializer = PersonSerializer(payers, many=True)
        return Response({'payments': serializer.data, 'payers': person_serializer.data}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['DELETE'])
def delete_group(request, pk):
    try:
        group = Group.objects.get(id=pk)
        group.delete()
        return Response({"message": "Group deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)