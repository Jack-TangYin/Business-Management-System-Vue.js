from django.db import models

class Staff(models.Model):
    """
    Represents a staff member in the organization.

    Attributes:
        name (CharField): The name of the staff member, with a maximum length of 100 characters.
        role (CharField): The role or position of the staff member, with a maximum length of 50 characters.
        is_active (BooleanField): Indicates if the staff member is currently active. Defaults to True.
        date_joined (DateField): The date when the staff member joined the organization.
    """
    
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateField()

    def __str__(self):
        """
        Returns the string representation of the staff member, which is their name.
        """
        return self.name

class Task(models.Model):
    """
    Represents a task to be completed by staff members.

    Attributes:
        title (CharField): The title of the task, with a maximum length of 100 characters.
        description (TextField): A detailed description of the task.
        priority (IntegerField): The priority level of the task, represented as an integer.
        due_date (DateField): The due date by which the task should be completed.
        assigned_staff (ManyToManyField): Many-to-many relationship with Staff through the Assignment model, 
                                          representing staff members assigned to the task.
    """

    title = models.CharField(max_length=100)
    description = models.TextField()
    priority = models.IntegerField()
    due_date = models.DateField()
    assigned_staff = models.ManyToManyField(Staff, through='Assignment')

    def __str__(self):
        """
        Returns the string representation of the task, which is its title.
        """
        return self.title

class Assignment(models.Model):
    """
    Represents an assignment that links a staff member to a task.

    Attributes:
        staff (ForeignKey): Foreign key to the Staff model, representing the staff member assigned to the task.
        task (ForeignKey): Foreign key to the Task model, representing the task assigned to the staff member.
        date_assigned (DateField): The date when the assignment was created, automatically set to the current date.
        status (CharField): The status of the assignment, with options 'Pending' or 'Completed'.
    """
    
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    date_assigned = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Completed', 'Completed')])

    def __str__(self):
        """
        Returns a string representation of the assignment, combining the staff member's name and the task title.
        """
        return f"{self.staff.name} - {self.task.title}"

