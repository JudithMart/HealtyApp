from django.db import models

# Create your models here.
from django.db import models
from pacientes.models import Paciente

class Cita(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('asistida', 'Asistida'),
        ('cancelada', 'Cancelada'),
    )
    TIPOS = (
        ('primera', 'Primera vez'),
        ('seguimiento', 'Seguimiento'),
    )


    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='citas')
    fecha = models.DateField()
    hora = models.TimeField()
    motivo = models.CharField(max_length=255)
    tipo = models.CharField(max_length=20, choices=TIPOS, default='primera')
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    created_at = models.DateTimeField(auto_now_add=True)
    #agregado
    actividad_psicologica = models.TextField(null=True, blank=True)
    afirmacion = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-fecha', '-hora']

    def __str__(self):
        return f'{self.paciente} - {self.fecha} {self.hora}'