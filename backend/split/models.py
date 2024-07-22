from django.db import models

# Create your models here.

class Person(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Group(models.Model):
    name = models.CharField(max_length=200)
    members = models.ManyToManyField(Person)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.name
    
    @property
    def total_amount(self):
        return sum(payment.amount for payment in self.payment_set.all())
    
class Payment(models.Model):
    name = models.CharField(max_length=200)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    payer = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='payer')
    payment_for = models.ManyToManyField(Person, related_name='payments_made_for')
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    @property
    def payer_name(self):
        return self.payer.name