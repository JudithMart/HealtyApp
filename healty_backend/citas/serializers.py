from rest_framework import serializers
from .models import Cita

class CitaSerializer(serializers.ModelSerializer):
    
     paciente_nombre = serializers.SerializerMethodField()
   
     class Meta:
        model = Cita
        fields = '__all__'  

         
     def get_paciente_nombre(self, obj):
        return f"{obj.paciente.nombre} {obj.paciente.apellido}"