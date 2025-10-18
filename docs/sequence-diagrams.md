3. Sequence Diagrams
These diagrams show the dynamic interactions between objects and actors over time. They are essential for understanding the flow of control for specific use cases.
3.1 Use Case: Create a New Order
This sequence shows the process of a Production Manager creating a new production order and associating it with a vendor.
sequenceDiagram
    actor Manager
    participant Frontend
    participant BackendAPI
    participant Database

    Manager->>Frontend: Fills out and submits new order form
    Frontend->>BackendAPI: POST /api/orders (order_data)
    BackendAPI->>Database: Verify vendor exists
    Database-->>BackendAPI: Vendor confirmed
    BackendAPI->>Database: INSERT into Orders (order_details)
    Database-->>BackendAPI: Order created successfully (returns new order_id)
    BackendAPI-->>Frontend: 201 Created (new_order)
    Frontend->>Manager: Display success message and new order details

3.2 Use Case: Reschedule Order via Calendar
This sequence details the interaction when a manager drags and drops an order to a new date on the calendar.
sequenceDiagram
    actor Manager
    participant CalendarUI
    participant BackendAPI
    participant Database

    Manager->>CalendarUI: Drags order to a new date
    CalendarUI->>BackendAPI: PATCH /api/orders/{id} (new_due_date)
    BackendAPI->>Database: UPDATE Order SET due_date = new_due_date WHERE order_id = id
    Database-->>BackendAPI: Update successful
    BackendAPI-->>CalendarUI: 200 OK (updated_order)
    CalendarUI->>Manager: Visually confirms order moved to new date

3.3 Use Case: Generate Vendor Activity Report
This sequence illustrates the process of generating and downloading a report based on a specified date range.
sequenceDiagram
    actor Manager
    participant ReportUI
    participant BackendAPI
    participant Database

    Manager->>ReportUI: Selects date range and clicks "Generate Report"
    ReportUI->>BackendAPI: GET /api/reports?start=...&end=...
    BackendAPI->>Database: SELECT * FROM Orders WHERE due_date BETWEEN start AND end
    Database-->>BackendAPI: Returns list of orders
    BackendAPI->>BackendAPI: Process and aggregate data
    BackendAPI-->>ReportUI: 200 OK (report_data)
    ReportUI->>Manager: Displays report summary on screen
    Manager->>ReportUI: Clicks "Export as PDF"
    ReportUI->>BackendAPI: GET /api/reports/export?format=pdf&...
    BackendAPI->>BackendAPI: Generate PDF file from data
    BackendAPI-->>ReportUI: Returns PDF file
    ReportUI->>Manager: Prompts user to download the file

