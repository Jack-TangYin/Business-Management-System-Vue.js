from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Staff, Task, Assignment
import json

def index(request):
    """
    Renders the index page for the API.

    Args:
        request: The HTTP request object.

    Returns:
        HttpResponse: The rendered HTML template for the index page.
    """
    return render(request, 'api/index.html')  # Render and return the 'index.html' template

@csrf_exempt
def handle_staff(request):
    """
    Handles CRUD operations for the Staff model.

    Supports:
    - GET: Retrieves all staff records.
    - POST: Creates a new staff record with provided data.
    - PUT: Updates an existing staff record based on ID.
    - DELETE: Deletes a staff record based on ID.

    Args:
        request: The HTTP request object.

    Returns:
        JsonResponse: A JSON response with appropriate data and status codes.
    """
    
    if request.method == 'GET':  # Check if the request is a GET request
        data = list(Staff.objects.values())  # Retrieve all staff records and convert them to a list of dictionaries
        return JsonResponse({'data': data})  # Return the data as JSON

    elif request.method == 'POST':  # Check if the request is a POST request
        data = json.loads(request.body)  # Parse the JSON data from the request body
        staff = Staff.objects.create(  # Create a new staff record with the parsed data
            name=data['name'],
            role=data['role'],
            is_active=data['is_active'],
            date_joined=data['date_joined']
        )
        return JsonResponse({'message': 'Created', 'id': staff.id}, status=201)  # Return success message and new staff ID

    elif request.method == 'PUT':  # Check if the request is a PUT request
        data = json.loads(request.body)  # Parse the JSON data from the request body
        staff = Staff.objects.get(id=data['id'])  # Retrieve the staff record with the specified ID
        staff.name = data['name']  # Update the staff name
        staff.role = data['role']  # Update the staff role
        staff.is_active = data['is_active']  # Update the active status
        staff.date_joined = data['date_joined']  # Update the date joined
        staff.save()  # Save the updated staff record
        return JsonResponse({'message': 'Updated'}, status=200)  # Return a success message

    elif request.method == 'DELETE':  # Check if the request is a DELETE request
        data = json.loads(request.body)  # Parse the JSON data from the request body
        staff = Staff.objects.get(id=data['id'])  # Retrieve the staff record with the specified ID
        staff.delete()  # Delete the staff record
        return JsonResponse({'message': 'Deleted'}, status=200)  # Return a success message

@csrf_exempt
def handle_task(request):
    """
    Handles CRUD operations for the Task model.

    Supports:
    - GET: Retrieves all task records.
    - POST: Creates a new task record with provided data.
    - PUT: Updates an existing task record based on ID.
    - DELETE: Deletes a task record based on ID.

    Args:
        request: The HTTP request object.

    Returns:
        JsonResponse: A JSON response with appropriate data and status codes.
    """
    
    if request.method == 'GET':  # Check if the request is a GET request
        data = list(Task.objects.values())  # Retrieve all task records and convert them to a list of dictionaries
        return JsonResponse({'data': data})  # Return the data as JSON

    elif request.method == 'POST':  # Check if the request is a POST request
        data = json.loads(request.body)  # Parse the JSON data from the request body
        task = Task.objects.create(  # Create a new task record with the parsed data
            title=data['title'],
            description=data['description'],
            priority=data['priority'],
            due_date=data['due_date']
        )
        return JsonResponse({'message': 'Created', 'id': task.id}, status=201)  # Return success message and new task ID

    elif request.method == 'PUT':  # Check if the request is a PUT request
        data = json.loads(request.body)  # Parse the JSON data from the request body
        task = Task.objects.get(id=data['id'])  # Retrieve the task record with the specified ID
        task.title = data['title']  # Update the task title
        task.description = data['description']  # Update the task description
        task.priority = data['priority']  # Update the task priority
        task.due_date = data['due_date']  # Update the due date
        task.save()  # Save the updated task record
        return JsonResponse({'message': 'Updated'}, status=200)  # Return a success message

    elif request.method == 'DELETE':  # Check if the request is a DELETE request
        data = json.loads(request.body)  # Parse the JSON data from the request body
        task = Task.objects.get(id=data['id'])  # Retrieve the task record with the specified ID
        task.delete()  # Delete the task record
        return JsonResponse({'message': 'Deleted'}, status=200)  # Return a success message

@csrf_exempt
def handle_assignment(request, id=None):
    """
    Handles CRUD operations for the Assignment model.

    Supports:
    - GET: Retrieves all assignment records with related staff and task details.
    - POST: Creates a new assignment with provided staff and task IDs.
    - PUT: Updates an existing assignment based on ID.
    - DELETE: Deletes an assignment based on ID.

    Args:
        request: The HTTP request object.
        id (int, optional): The ID of the assignment to update or delete.

    Returns:
        JsonResponse: A JSON response with appropriate data and status codes.
    """

    if request.method == 'GET':  # Check if the request is a GET request
        assignments = Assignment.objects.select_related('staff', 'task').all()  # Retrieve all assignments with related staff and task data
        data = [
            {
                'id': assignment.id,
                'staff_name': assignment.staff.name,
                'task_title': assignment.task.title,
                'status': assignment.status,
                'date_assigned': assignment.date_assigned,
            }
            for assignment in assignments  # Convert each assignment to a dictionary format
        ]
        return JsonResponse({'data': data})  # Return the data as JSON

    elif request.method == 'POST':  # Check if the request is a POST request
        try:
            data = json.loads(request.body)  # Parse the JSON data from the request body
            staff = Staff.objects.get(id=data['staff_id'])  # Retrieve the staff record by ID
            task = Task.objects.get(id=data['task_id'])  # Retrieve the task record by ID
            assignment = Assignment.objects.create(  # Create a new assignment with the parsed data
                staff=staff,
                task=task,
                status=data.get('status', 'Pending')  # Default to 'Pending' if status not provided
            )
            return JsonResponse({
                'id': assignment.id,
                'staff_name': assignment.staff.name,
                'task_title': assignment.task.title,
                'status': assignment.status,
                'date_assigned': assignment.date_assigned
            }, status=201)  # Return success message with assignment details
        except (Staff.DoesNotExist, Task.DoesNotExist):
            return JsonResponse({'error': 'Invalid staff or task ID'}, status=400)  # Return error if staff or task not found
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)  # Return error if JSON is invalid

    elif request.method == 'PUT' and id is not None:  # Check if the request is a PUT request with a valid ID
        try:
            assignment = Assignment.objects.get(id=id)  # Retrieve the assignment by ID
            data = json.loads(request.body)  # Parse the JSON data from the request body

            # Update assignment fields if provided in the data
            if 'staff_id' in data:
                assignment.staff = Staff.objects.get(id=data['staff_id'])
            if 'task_id' in data:
                assignment.task = Task.objects.get(id=data['task_id'])
            if 'status' in data:
                assignment.status = data['status']
                
            assignment.save()  # Save the updated assignment
            return JsonResponse({
                'id': assignment.id,
                'staff_name': assignment.staff.name,
                'task_title': assignment.task.title,
                'status': assignment.status,
                'date_assigned': assignment.date_assigned
            }, status=200)  # Return success message with assignment details
        except Assignment.DoesNotExist:
            return JsonResponse({'error': 'Assignment not found'}, status=404)  # Return error if assignment not found
        except (Staff.DoesNotExist, Task.DoesNotExist):
            return JsonResponse({'error': 'Invalid staff or task ID'}, status=400)  # Return error if staff or task not found
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)  # Return error if JSON is invalid

    elif request.method == 'DELETE' and id is not None:  # Check if the request is a DELETE request with a valid ID
        try:
            assignment = Assignment.objects.get(id=id)  # Retrieve the assignment by ID
            assignment.delete()  # Delete the assignment
            return JsonResponse({'message': 'Assignment deleted successfully'})  # Return success message
        except Assignment.DoesNotExist:
            return JsonResponse({'error': 'Assignment not found'}, status=404)  # Return error if assignment not found
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)  # Return error if the method is not supported

