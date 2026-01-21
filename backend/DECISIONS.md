# Project Decisions

## Technology Stack
* **Django & Django REST Framework:** Chosen for the backend because of the robust built-in validation system. It allowed for easy implementation of the circular dependency check within the Serializer layer.
* **React:** Chosen for the frontend to provide a dynamic, real-time experience when adding tasks and visualizing dependencies without refreshing the page.

## Circular Dependency Logic
To prevent infinite loops in tasks, I implemented a validation check in the `TaskSerializer`. 
* **Logic:** When a user attempts to add a dependency, the system performs a recursive search through all existing parent/child relationships.
* **Result:** If the task identifies itself anywhere in the dependency chain, it raises a `serializers.ValidationError`, blocking the save and returning an HTTP 400 error.

## Database
* **SQLite:** Used for local development simplicity and ease of portability for this assignment.
*