## 3. Sequence Diagrams

These diagrams capture the dynamic interactions between actors and system components for key OptiFlow use cases.

### 3.1 Use Case: Create a New Order

This sequence shows the process of a Production Manager creating a new production order and associating it with a vendor.

```mermaid
sequenceDiagram
    actor Manager
    participant Frontend
    participant BackendAPI
    participant Database

    Manager->>Frontend: Fills out and submits new order form
    Frontend->>BackendAPI: POST /api/orders (order_data)
    BackendAPI->>Database: findOne("vendors", { id: vendorId })
    Database-->>BackendAPI: Vendor document
    BackendAPI->>Database: insertOne("orders", orderDocument)
    Database-->>BackendAPI: Insert acknowledged (returns _id)
    BackendAPI-->>Frontend: 201 Created (new_order)
    Frontend->>Manager: Display success message and new order details
```

### 3.2 Use Case: Reschedule Order via Calendar

This sequence details the interaction when a manager drags and drops an order to a new date on the calendar.

```mermaid
sequenceDiagram
    actor Manager
    participant CalendarUI
    participant BackendAPI
    participant Database

    Manager->>CalendarUI: Drags order to a new date
    CalendarUI->>BackendAPI: PATCH /api/orders/{id} (new_due_date)
    BackendAPI->>Database: updateOne("orders", { _id: id }, { $set: { dueDate: newDate } })
    Database-->>BackendAPI: Update acknowledged
    BackendAPI-->>CalendarUI: 200 OK (updated_order)
    CalendarUI->>Manager: Visually confirms order moved to new date
```

### 3.3 Use Case: Generate Vendor Activity Report

This sequence illustrates the process of generating and downloading a report based on a specified date range.

```mermaid
sequenceDiagram
    actor Manager
    participant ReportUI
    participant BackendAPI
    participant Database

    Manager->>ReportUI: Selects date range and clicks "Generate Report"
    ReportUI->>BackendAPI: GET /api/reports?start=...&end=...
    BackendAPI->>Database: aggregate("orders", pipeline for date range)
    Database-->>BackendAPI: Aggregated order documents
    BackendAPI->>BackendAPI: Post-process metrics
    BackendAPI-->>ReportUI: 200 OK (report_data)
    ReportUI->>Manager: Displays report summary on screen
    Manager->>ReportUI: Clicks "Export as PDF"
    ReportUI->>BackendAPI: GET /api/reports/export?format=pdf&...
    BackendAPI->>BackendAPI: Generate PDF file from data
    BackendAPI-->>ReportUI: Returns PDF file
    ReportUI->>Manager: Prompts user to download the file
```

### 3.4 Use Case: User Authentication (Register & Login)

This sequence covers FR-1 and requirement 1.2.1, showing secure registration and login flows between the frontend, authentication service, and database.

```mermaid
sequenceDiagram
    actor Manager
    participant Frontend
    participant AuthAPI
    participant Database

    Manager->>Frontend: Submit registration form
    Frontend->>AuthAPI: POST /api/auth/register (credentials)
    AuthAPI->>Database: findOne("users", { email })
    Database-->>AuthAPI: User not found
    AuthAPI->>Database: insertOne("users", hashedUserDocument)
    Database-->>AuthAPI: Insert acknowledged
    AuthAPI-->>Frontend: 201 Created (JWT, profile)
    Frontend->>Manager: Persist token and redirect to dashboard
    Manager->>Frontend: Submit login form
    Frontend->>AuthAPI: POST /api/auth/login (credentials)
    AuthAPI->>Database: findOne("users", { email })
    Database-->>AuthAPI: User document
    AuthAPI->>AuthAPI: Verify password hash
    AuthAPI-->>Frontend: 200 OK (JWT)
    Frontend->>Manager: Store session and load personalized data
```

### 3.5 Use Case: Vendor Management (Create / Edit Vendor)

This sequence addresses requirement 1.2.2 and FR-2 by outlining how a manager creates or updates vendor records and refreshes related history.

```mermaid
sequenceDiagram
    actor Manager
    participant VendorFormUI
    participant BackendAPI
    participant Database
    participant VendorHistoryUI

    Manager->>VendorFormUI: Submit vendor form (create or edit)
    VendorFormUI->>VendorFormUI: Validate required fields
    alt Creating new vendor
        VendorFormUI->>BackendAPI: POST /api/vendors (vendor_data)
    else Updating existing vendor
        VendorFormUI->>BackendAPI: PUT /api/vendors/{id} (vendor_data)
    end
    BackendAPI->>Database: updateOne("vendors", { _id: id }, { $set: vendorData }, { upsert: true })
    Database-->>BackendAPI: Upsert acknowledged
    BackendAPI-->>VendorFormUI: 200 OK (vendor)
    VendorFormUI->>VendorHistoryUI: Trigger vendor list refresh
    VendorHistoryUI->>BackendAPI: GET /api/vendors/{id}/orders
    BackendAPI->>Database: find("orders", { vendorId: id })
    Database-->>BackendAPI: Matching orders
    BackendAPI-->>VendorHistoryUI: 200 OK (order history)
    VendorHistoryUI->>Manager: Display updated vendor details and history
```

### 3.6 Use Case: Vendor Search and History View

This sequence supports requirement 1.2.2 by demonstrating filtered vendor lookup and loading of associated orders for quick context.

```mermaid
sequenceDiagram
    actor Manager
    participant VendorListUI
    participant BackendAPI
    participant Database
    participant VendorHistoryUI

    Manager->>VendorListUI: Enter search keyword
    VendorListUI->>VendorListUI: Debounce and validate filters
    VendorListUI->>BackendAPI: GET /api/vendors?search=...
    BackendAPI->>Database: find("vendors", searchQuery)
    Database-->>BackendAPI: Filtered vendors
    BackendAPI-->>VendorListUI: 200 OK (vendor list)
    VendorListUI->>Manager: Render filtered results
    Manager->>VendorListUI: Select vendor row
    VendorListUI->>VendorHistoryUI: Load vendor detail panel
    VendorHistoryUI->>BackendAPI: GET /api/vendors/{id}/orders
    BackendAPI->>Database: find("orders", { vendorId: id })
    Database-->>BackendAPI: Order history documents
    BackendAPI-->>VendorHistoryUI: 200 OK (orders)
    VendorHistoryUI->>Manager: Present vendor profile with past orders
```

### 3.7 Use Case: Update Order Status from Dashboard

This sequence covers requirement 1.2.3 by capturing how a manager edits an order's status or instructions from the dashboard modal and receives confirmation.

```mermaid
sequenceDiagram
    actor Manager
    participant DashboardUI
    participant BackendAPI
    participant Database
    participant ToastService

    Manager->>DashboardUI: Open order detail modal
    DashboardUI->>Manager: Display editable fields
    Manager->>DashboardUI: Submit status/instruction changes
    DashboardUI->>BackendAPI: PATCH /api/orders/{id} (status, instructions)
    BackendAPI->>Database: updateOne("orders", { _id: id }, { $set: { status, instructions } })
    Database-->>BackendAPI: Update acknowledged
    BackendAPI-->>DashboardUI: 200 OK (updated_order)
    DashboardUI->>ToastService: Trigger success toast
    ToastService-->>Manager: Show confirmation message
    DashboardUI->>Manager: Refresh dashboard table and charts
```
