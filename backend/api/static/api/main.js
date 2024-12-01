// Main Parent Vue Instance
// Create a new Vue instance and bind it to the '#app' element in the HTML
new Vue({
  // `el` specifies the HTML element to which this Vue instance is bound
  el: "#app", // The root element with id "app" will control the Vue instance

  // `data` is an object where we define reactive properties used within the Vue instance
  data: {
    staffList: [], // Holds the list of staff members fetched from the server
    taskList: [], // Holds the list of tasks fetched from the server
    assignments: [], // Holds the list of assignments fetched from the server
  },

  // `mounted` is a lifecycle hook that runs after the Vue instance has been mounted to the DOM
  mounted() {
    // Fetch initial data when the instance is mounted
    this.fetchStaff(); // Calls the method to fetch staff data from the server
    this.fetchTasks(); // Calls the method to fetch task data from the server
    this.fetchAssignments(); // Calls the method to fetch assignment data from the server
  },

  // `methods` is an object where we define reusable functions for this Vue instance
  methods: {
    // `fetchStaff` method: asynchronously fetches staff data from the server
    async fetchStaff() {
      const response = await fetch("/api/staff/"); // Sends a GET request to '/api/staff/' endpoint
      const data = await response.json(); // Parses the response to JSON format
      this.staffList = data.data; // Updates the `staffList` with the data from the response
    },

    // `fetchTasks` method: asynchronously fetches task data from the server
    async fetchTasks() {
      const response = await fetch("/api/task/"); // Sends a GET request to '/api/task/' endpoint
      const data = await response.json(); // Parses the response to JSON format
      this.taskList = data.data; // Updates the `taskList` with the data from the response
    },

    // `fetchAssignments` method: asynchronously fetches assignment data from the server
    async fetchAssignments() {
      const response = await fetch("/api/assignment/"); // Sends a GET request to '/api/assignment/' endpoint
      const data = await response.json(); // Parses the response to JSON format
      this.assignments = data.data; // Updates the `assignments` with the data from the response
    },
  },
});

// Define a new Vue component called 'task-list'
Vue.component("task-list", {
  // `props` allow this component to receive data from its parent component
  props: ["taskList"], // Receives the task list array from the parent component

  // `data` is a function that returns an object with local reactive properties
  data() {
    return {
      newTask: { title: "", description: "", priority: "", due_date: "" }, // Stores data for creating a new task
      editTask: null, // Stores data for the task being edited
      showAddModal: false, // Controls the display of the "Add Task" modal
      showEditModal: false, // Controls the display of the "Edit Task" modal
    };
  },

  // `methods` is an object that defines functions used in this component
  methods: {
    // Adds a new task by sending a POST request to the server
    async addTask() {
      await fetch("/api/task/", {
        method: "POST", // HTTP method for creating a new resource
        headers: { "Content-Type": "application/json" }, // Sets the request headers
        body: JSON.stringify(this.newTask), // Converts the newTask object to JSON format
      });
      this.$emit("update-task-list"); // Emits an event to the parent component to refresh the task list
      this.newTask = { title: "", description: "", priority: "", due_date: "" }; // Resets newTask fields after submission
      this.showAddModal = false; // Closes the "Add Task" modal
    },

    // Updates an existing task by sending a PUT request to the server
    async updateTask() {
      if (!this.editTask) return; // Checks if there’s a task to edit; returns if `editTask` is null

      await fetch("/api/task/", {
        method: "PUT", // HTTP method for updating an existing resource
        headers: { "Content-Type": "application/json" }, // Sets the request headers
        body: JSON.stringify(this.editTask), // Converts the editTask object to JSON format
      });
      this.$emit("update-task-list"); // Emits an event to the parent component to refresh the task list
      this.editTask = null; // Clears editTask after updating
      this.showEditModal = false; // Closes the "Edit Task" modal
    },

    // Deletes a task by sending a DELETE request to the server
    async deleteTask(id) {
      await fetch(`/api/task/`, {
        method: "DELETE", // HTTP method for deleting a resource
        headers: { "Content-Type": "application/json" }, // Sets the request headers
        body: JSON.stringify({ id }), // Sends the task ID to delete in JSON format
      });
      this.$emit("update-task-list"); // Emits an event to the parent component to refresh the task list
    },

    // Sets the task to be edited and opens the Edit Task modal
    setEditTask(task) {
      this.editTask = { ...task }; // Creates a copy of the selected task for editing
      this.showEditModal = true; // Opens the "Edit Task" modal
    },
  },

  // `template` is the HTML structure for the component
  template: `
        <div>
            <!-- Header for the Task List section -->
            <h2 class="text-info mb-4">Task List</h2>

            <!-- List of tasks using Bootstrap's list group styling -->
            <ul class="list-group mb-4 shadow-sm">
                <!-- Loop through each task in taskList prop and display it -->
                <li v-for="task in taskList" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{{ task.title }}</strong>
                        <span class="badge badge-secondary ml-2">Priority: {{ task.priority }}</span>
                        <p class="mb-1 text-muted">{{ task.description }}</p>
                        <small class="text-info">Due Date: {{ task.due_date }}</small>
                    </div>
                    <div>
                        <!-- Edit button to set the task for editing and open the Edit Task modal -->
                        <button class="btn btn-sm btn-outline-primary mr-2" @click="setEditTask(task)">Edit</button>
                        <!-- Delete button to remove the task by its ID -->
                        <button class="btn btn-sm btn-outline-danger" @click="deleteTask(task.id)">Delete</button>
                    </div>
                </li>
            </ul>

            <!-- Button to open the Add Task modal -->
            <button class="btn btn-success mb-4" @click="showAddModal = true">Add New Task</button>

            <!-- Add Task Modal: displayed when showAddModal is true -->
            <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Task</h5>
                            <!-- Button to close the modal -->
                            <button type="button" class="close" @click="showAddModal = false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <!-- Form to add a new task -->
                            <form @submit.prevent="addTask">
                                <div class="form-group">
                                    <label for="title">Title</label>
                                    <input v-model="newTask.title" id="title" placeholder="Enter title" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea v-model="newTask.description" id="description" placeholder="Enter description" class="form-control"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="priority">Priority</label>
                                    <input v-model="newTask.priority" id="priority" type="number" placeholder="Enter priority" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="due_date">Due Date</label>
                                    <input v-model="newTask.due_date" id="due_date" type="date" class="form-control" />
                                </div>
                                <button type="submit" class="btn btn-success btn-block">Add Task</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Task Modal: displayed when showEditModal is true -->
            <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Task</h5>
                            <!-- Button to close the modal -->
                            <button type="button" class="close" @click="showEditModal = false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <!-- Form to edit an existing task -->
                            <form @submit.prevent="updateTask">
                                <div class="form-group">
                                    <label for="edit-title">Title</label>
                                    <input v-model="editTask.title" id="edit-title" placeholder="Enter title" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="edit-description">Description</label>
                                    <textarea v-model="editTask.description" id="edit-description" placeholder="Enter description" class="form-control"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="edit-priority">Priority</label>
                                    <input v-model="editTask.priority" id="edit-priority" type="number" placeholder="Enter priority" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="edit-due_date">Due Date</label>
                                    <input v-model="editTask.due_date" id="edit-due_date" type="date" class="form-control" />
                                </div>
                                <button type="submit" class="btn btn-warning btn-block">Update Task</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});

// Define a new Vue component called 'staff-list'
Vue.component("staff-list", {
  // `props` allow this component to receive data from its parent component
  props: ["staffList"], // Receives the staff list array from the parent component

  // `data` is a function that returns an object with local reactive properties
  data() {
    return {
      newStaff: { name: "", role: "", is_active: true, date_joined: "" }, // Stores data for creating a new staff member
      editStaff: null, // Holds the staff member being edited
      showAddModal: false, // Controls the display of the "Add Staff" modal
      showEditModal: false, // Controls the display of the "Edit Staff" modal
    };
  },

  // `methods` is an object that defines functions used in this component
  methods: {
    // Adds a new staff member by sending a POST request to the server
    async addStaff() {
      await fetch("/api/staff/", {
        method: "POST", // HTTP method for creating a new resource
        headers: { "Content-Type": "application/json" }, // Sets the request headers
        body: JSON.stringify(this.newStaff), // Converts the newStaff object to JSON format
      });
      this.$emit("update-staff-list"); // Emits an event to the parent component to refresh the staff list
      this.newStaff = { name: "", role: "", is_active: true, date_joined: "" }; // Resets newStaff fields after submission
      this.showAddModal = false; // Closes the "Add Staff" modal
    },

    // Updates an existing staff member by sending a PUT request to the server
    async updateStaff() {
      if (!this.editStaff) return; // Checks if there’s a staff member to edit; returns if `editStaff` is null

      await fetch("/api/staff/", {
        method: "PUT", // HTTP method for updating an existing resource
        headers: { "Content-Type": "application/json" }, // Sets the request headers
        body: JSON.stringify(this.editStaff), // Converts the editStaff object to JSON format
      });
      this.$emit("update-staff-list"); // Emits an event to the parent component to refresh the staff list
      this.editStaff = null; // Clears editStaff after updating
      this.showEditModal = false; // Closes the "Edit Staff" modal
    },

    // Deletes a staff member by sending a DELETE request to the server
    async deleteStaff(id) {
      await fetch(`/api/staff/`, {
        method: "DELETE", // HTTP method for deleting a resource
        headers: { "Content-Type": "application/json" }, // Sets the request headers
        body: JSON.stringify({ id }), // Sends the staff ID to delete in JSON format
      });
      this.$emit("update-staff-list"); // Emits an event to the parent component to refresh the staff list
    },

    // Sets the staff member to be edited and opens the Edit Staff modal
    setEditStaff(staff) {
      this.editStaff = { ...staff }; // Creates a copy of the selected staff member for editing
      this.showEditModal = true; // Opens the "Edit Staff" modal
    },
  },

  // `template` is the HTML structure for the component
  template: `
        <div>
            <!-- Header for the Staff List section -->
            <h2 class="text-info mb-4">Staff List</h2>

            <!-- List of staff members using Bootstrap's list group styling -->
            <ul class="list-group mb-4 shadow-sm">
                <!-- Loop through each staff member in staffList prop and display it -->
                <li v-for="staff in staffList" :key="staff.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{{ staff.name }}</strong> - {{ staff.role }}
                        <!-- Displays date joined if available -->
                        <small v-if="staff.date_joined" class="text-muted d-block">Joined: {{ staff.date_joined }}</small>
                    </div>
                    <div>
                        <!-- Edit button to set the staff member for editing and open the Edit Staff modal -->
                        <button class="btn btn-sm btn-outline-primary mr-2" @click="setEditStaff(staff)">Edit</button>
                        <!-- Delete button to remove the staff member by its ID -->
                        <button class="btn btn-sm btn-outline-danger" @click="deleteStaff(staff.id)">Delete</button>
                    </div>
                </li>
            </ul>

            <!-- Button to open the Add Staff modal -->
            <button class="btn btn-success mb-4" @click="showAddModal = true">Add New Staff</button>

            <!-- Add Staff Modal: displayed when showAddModal is true -->
            <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Staff</h5>
                            <!-- Button to close the modal -->
                            <button type="button" class="close" @click="showAddModal = false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <!-- Form to add a new staff member -->
                            <form @submit.prevent="addStaff">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input v-model="newStaff.name" id="name" placeholder="Enter name" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="role">Role</label>
                                    <input v-model="newStaff.role" id="role" placeholder="Enter role" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="date_joined">Date Joined</label>
                                    <input v-model="newStaff.date_joined" id="date_joined" type="date" class="form-control" />
                                </div>
                                <button type="submit" class="btn btn-success btn-block">Add Staff</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Staff Modal: displayed when showEditModal is true -->
            <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Staff</h5>
                            <!-- Button to close the modal -->
                            <button type="button" class="close" @click="showEditModal = false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <!-- Form to edit an existing staff member -->
                            <form @submit.prevent="updateStaff">
                                <div class="form-group">
                                    <label for="edit-name">Name</label>
                                    <input v-model="editStaff.name" id="edit-name" placeholder="Enter name" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="edit-role">Role</label>
                                    <input v-model="editStaff.role" id="edit-role" placeholder="Enter role" class="form-control" />
                                </div>
                                <div class="form-group">
                                    <label for="edit-date_joined">Date Joined</label>
                                    <input v-model="editStaff.date_joined" id="edit-date_joined" type="date" class="form-control" />
                                </div>
                                <button type="submit" class="btn btn-warning btn-block">Update Staff</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});

Vue.component("assignment-list", {
  props: ["staffList", "taskList", "assignments"], // Receives lists of staff, tasks, and assignments from the parent component
  data() {
    return {
      newAssignment: { staff_id: "", task_id: "", status: "Pending" }, // Stores data for creating a new assignment
      editAssignmentData: null, // Temporarily holds data for the assignment being edited
      showAddModal: false, // Controls the display of the Add Assignment modal
      showEditModal: false, // Controls the display of the Edit Assignment modal
    };
  },
  methods: {
    // Opens the Create Assignment modal
    openAddModal() {
      this.newAssignment = { staff_id: "", task_id: "", status: "Pending" }; // Reset form data
      this.showAddModal = true; // Show the Add modal
    },

    // Adds a new assignment by sending a POST request to the server
    async addAssignment() {
      const response = await fetch("/api/assignment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.newAssignment),
      });
      if (response.ok) {
        this.$emit("update-assignments"); // Notify parent to refresh assignments
        this.showAddModal = false; // Close the Add modal
      } else {
        console.error("Failed to create assignment");
      }
    },

    // Opens the Edit Assignment modal with the selected assignment's data
    openEditModal(assignment) {
      this.editAssignmentData = { ...assignment }; // Copy assignment data for editing
      this.showEditModal = true; // Show the Edit modal
    },

    // Updates an assignment by sending a PUT request to the server
    async updateAssignment() {
      if (!this.editAssignmentData) return;

      const response = await fetch(
        `/api/assignment/${this.editAssignmentData.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.editAssignmentData),
        }
      );
      if (response.ok) {
        this.$emit("update-assignments"); // Notify parent to refresh assignments
        this.showEditModal = false; // Close the Edit modal
      } else {
        console.error("Failed to update assignment");
      }
    },

    // Deletes an assignment by sending a DELETE request to the server
    async removeAssignment(id) {
      await fetch(`/api/assignment/${id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      this.$emit("update-assignments"); // Notify parent to refresh assignments
    },
  },
  template: `
        <div>
            <h2 class="text-info mb-4">Assignments</h2>

            <!-- List of assignments -->
            <ul class="list-group mb-4 shadow-sm">
                <li v-for="assignment in assignments" :key="assignment.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        Staff: {{ assignment.staff_name }} | Task: {{ assignment.task_title }} | Status: {{ assignment.status }}
                        <br>
                        <small class="text-muted">Assigned on: {{ assignment.date_assigned }}</small>
                    </div>
                    <div>
                        <!-- Button to open the Edit Assignment modal -->
                        <button class="btn btn-sm btn-outline-primary mr-2" @click="openEditModal(assignment)">Edit</button>
                        <!-- Button to delete the assignment -->
                        <button class="btn btn-sm btn-outline-danger" @click="removeAssignment(assignment.id)">Remove</button>
                    </div>
                </li>
            </ul>

            <!-- Button to open the Add Assignment modal -->
            <button class="btn btn-success mb-4" @click="openAddModal">Add New Assignment</button>

            <!-- Add Assignment Modal -->
            <div v-if="showAddModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Assignment</h5>
                            <button type="button" class="close" @click="showAddModal = false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <!-- Form for adding a new assignment -->
                            <form @submit.prevent="addAssignment">
                                <div class="form-group">
                                    <label for="staff">Staff</label>
                                    <select v-model="newAssignment.staff_id" id="staff" class="form-control">
                                        <option disabled value="">Select Staff</option>
                                        <option v-for="staff in staffList" :key="staff.id" :value="staff.id">{{ staff.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="task">Task</label>
                                    <select v-model="newAssignment.task_id" id="task" class="form-control">
                                        <option disabled value="">Select Task</option>
                                        <option v-for="task in taskList" :key="task.id" :value="task.id">{{ task.title }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="status">Status</label>
                                    <input v-model="newAssignment.status" id="status" placeholder="Enter status" class="form-control" />
                                </div>
                                <button type="submit" class="btn btn-success btn-block">Add Assignment</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Edit Assignment Modal -->
            <div v-if="showEditModal" class="modal fade show d-block" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Assignment</h5>
                            <button type="button" class="close" @click="showEditModal = false">&times;</button>
                        </div>
                        <div class="modal-body">
                            <!-- Form for editing an existing assignment -->
                            <form @submit.prevent="updateAssignment">
                                <div class="form-group">
                                    <label for="edit-staff">Staff</label>
                                    <select v-model="editAssignmentData.staff_id" id="edit-staff" class="form-control">
                                        <option disabled value="">Select Staff</option>
                                        <option v-for="staff in staffList" :key="staff.id" :value="staff.id">{{ staff.name }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="edit-task">Task</label>
                                    <select v-model="editAssignmentData.task_id" id="edit-task" class="form-control">
                                        <option disabled value="">Select Task</option>
                                        <option v-for="task in taskList" :key="task.id" :value="task.id">{{ task.title }}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="edit-status">Status</label>
                                    <input v-model="editAssignmentData.status" id="edit-status" placeholder="Enter status" class="form-control" />
                                </div>
                                <button type="submit" class="btn btn-warning btn-block">Update Assignment</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
});
