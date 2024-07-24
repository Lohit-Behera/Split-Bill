from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import Group, Payment, Person
from .serializers import GroupSerializer, PaymentSerializer, PersonSerializer, PaymentDetailsSerializer, GroupListSerializer, PaymentListSerializer,ForLiquidationSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })

class StandardResultsSetPaginationGroupList(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'results': data
        })

@api_view(['PUT'])
def create_group(request):
    try:
        data = request.data
        group_name = data['name'].strip().capitalize()
        
        
        if len(data['members']) < 2:
            return Response({"error": "Group should have at least 2 members"}, status=status.HTTP_400_BAD_REQUEST)
        
        group = Group.objects.create(name=group_name)
        
        for name in data['members']:
            member_name = name.strip().capitalize()
            person, created = Person.objects.get_or_create(name=member_name, group=group)
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
        groups = Group.objects.all().order_by('-created_at')
        paginator = StandardResultsSetPaginationGroupList()
        result_page = paginator.paginate_queryset(groups, request)
        serializer = GroupListSerializer(result_page, many=True)
        response_data = {
            'total_pages': paginator.page.paginator.num_pages,
            'current_page': paginator.page.number,
            'group_list': serializer.data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def list_payment(request, pk):
    try:
        payments = Payment.objects.filter(group=pk).order_by('-created_at')
        liquidation = ForLiquidationSerializer(payments, many=True)
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(payments, request)
        serializer = PaymentListSerializer(result_page, many=True)
        response_data = {
            'total_pages': paginator.page.paginator.num_pages,
            'current_page': paginator.page.number,
            'liquidation': liquidation.data,
            'results': serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    

@api_view(['DELETE'])
def delete_group(request, pk):
    try:
        group = Group.objects.get(id=pk)
        person = group.members.all()
        for p in person:
            p.delete()
        group.delete()
        return Response({"message": "Group deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def delete_payment(request, pk):
    try:
        payment = Payment.objects.get(id=pk)
        payment.delete()
        return Response({"message": "Payment deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
def update_group_name(request, pk):
    try:
        group = Group.objects.get(id=pk)
        group.name = request.data['name']
        group.save()
        return Response({"message": "Group name updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_payment(request, pk):
    try:
        data = request.data
        payment = Payment.objects.get(id=pk)
        
        if data['name'] != None:
            payment.name = data['name']
        
        if data['amount'] != None:
            payment.amount = data['amount']
            
        payment.save()
        return Response({"message": "Payment updated successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)