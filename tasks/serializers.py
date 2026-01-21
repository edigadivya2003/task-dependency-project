from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def validate_dependencies(self, value):
        # This is the "Circular Dependency" check for the assignment
        task_id = self.instance.id if self.instance else None
        
        for dep in value:
            # Check if any selected dependency already depends on THIS task
            if task_id and self.is_descendant(dep, task_id):
                raise serializers.ValidationError(
                    f"Circular dependency detected: {dep.title} already depends on this task."
                )
        return value

    def is_descendant(self, potential_descendant, target_id):
        # A simple search to see if a task is already in the 'family tree'
        for dep in potential_descendant.dependencies.all():
            if dep.id == target_id:
                return True
            if self.is_descendant(dep, target_id):
                return True
        return False