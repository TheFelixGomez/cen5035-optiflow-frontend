Project Requirements: OptiFlow
This document outlines the user and system requirements for the OptiFlow production order management and scheduling software.
1. User Requirements
This section defines the users of the system and the specific tasks they need to perform.
1.1 User Roles
Production Manager: The primary system user oversees the production workflow, from vendor management to order scheduling and reporting.
1.2 Requirements for Production Manager
1.2.1 Account Management
Must be able to create a secure user account.
Must be able to log in and log out of the system.
1.2.2 Vendor Management
Must be able to create, view, update, and delete vendor profiles.
Must be able to search for specific vendors from a list.
Must be able to view a history of orders associated with a specific vendor.
1.2.3 Order Management
Must be able to create a new production order and associate it with an existing vendor.
Must be able to assign a due date, status (e.g., Pending, In Progress, Completed), and special instructions to each order.
Must be able to view a dashboard of all orders, with options to filter and search by vendor, status, or date range.
Must be able to edit and delete existing orders.
1.2.4 Scheduling Management
Must view all orders on a calendar interface with monthly and weekly views.
Must be able to reschedule an order by dragging and dropping it to a new date on the calendar.
Must be able to quickly identify the status of an order on the calendar through visual cues (e.g., color-coding).
1.2.5 Reporting
Must be able to generate summary reports of vendor and order activity.
Must be able to define a custom date range for any generated report.
Must be able to view and download reports in either PDF or CSV format.

2. System Requirements
This section outlines the functional and non-functional requirements the system must satisfy.
Code 
Type 
Description 
NFR-1 
Efficiency 
API responses < 500ms; dashboard/calendar load < 3s on a stable connection. 
NFR-2 
Usability 
Responsive UI for desktop/tablet; intuitive interface for new users. 
Users should be able to complete the vendor creation workflow in under two minutes. 
NFR-3 
Reliability 
The deployed application shall maintain a service uptime of 99.5%. 
Must handle invalid user inputs gracefully with clear error messages and without crashing. 
NFR-4 
Security 
HTTPS encryption protects all data transmitted between the client and the server; it also uses secure password hashing and salting. 
NFR-5 
Scalability 
Cloud architecture must handle a 50% growth in users/orders without performance loss. 
NFR-6 
Maintainability 
Modular, well-documented frontend/backend codebases for easy updates and onboarding. 


Code 
Feature 
Description 
FR-1 
User Authentication 
Secure user registration and login using JWT for session management. 
FR-2 
Vendor Management 
CRUD (Create, Read, Update, Delete) operations for vendor records with fields for name, contact info, and address. 
FR-3 
Order Management 
 
The system shall provide CRUD operations for production orders, each linked to a valid vendor and containing due date, status, and instructions. 
FR-4 
Interactive Calendar 
 
Calendar view of orders with drag-and-drop rescheduling and real-time database updates. 
FR-5 
Report Generation 
 
Report generation summarizing order volume/status by vendor and date range, with export to PDF/CSV. 


