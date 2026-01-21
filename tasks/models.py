from django.db import models

class Task(models.Model):
    # Using the specific statuses from your assignment image
    STATUS_CHOICES = [
        ('pending', 'pending'),
        ('in_progress', 'in_progress'),
        ('completed', 'completed'),
        ('blocked', 'blocked'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    dependencies = models.ManyToManyField('self', symmetrical=False, related_name='dependents', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title