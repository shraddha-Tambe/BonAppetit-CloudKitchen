# Kitchen Cloud - Food Donation & Delivery Platform

Kitchen Cloud is a full-stack platform connecting Restaurants with Customers, NGOs, and Delivery Partners to reduce food waste and streamline food delivery.

## 🚀 Key Features

*   **Role-Based Access Control**:
    *   **User/Customer**: Browse restaurants, search by cuisine, add to cart, place orders, donate money to NGOs.
    *   **Restaurant Owner**: Register restaurant, manage menu, view orders, update status, donate surplus food.
    *   **Delivery Partner**: View assigned orders, update order status (Picked Up, Delivered).
    *   **NGO**: View dashboard, claim available food donations, view money donation history.
    *   **Admin**: Approve/Reject registrations (Restaurant, Delivery, NGO).

*   **Order Management**:
    *   Full lifecycle: Place -> Accept/Prepare -> Assign -> Pick Up -> Deliver.
    *   Dynamic cart and checkout with coupon system.

*   **Donation System**:
    *   Food Donation: Restaurants list surplus food -> NGOs claim it.
    *   Money Donation: Users donate money -> NGOs receive it.

## 🛠 Tech Stack

### Frontend
*   **React + Vite**: Fast, modern frontend.
*   **TailwindCSS**: Utility-first styling.
*   **Shadcn UI + Lucide React**: Beautiful, accessible components and icons.
*   **Axios**: API integration.
*   **React Router DOM**: Client-side routing.

### Backend
*   **Java Spring Boot**: Robust backend framework.
*   **Spring Security + JWT**: Secure authentication and role-based authorization.
*   **Spring Data JPA + Hibernate**: Database interaction.
*   **MySQL**: Relational database.

## ⚙️ Setup Instructions

### Backend
1.  Navigate to `backend` folder.
2.  Configure Database in `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/kitchencloud
    spring.datasource.username=root
    spring.datasource.password=yourpassword
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
    *Server runs on port 8080.*

### Frontend
1.  Navigate to `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start dev server:
    ```bash
    npm run dev
    ```
    *App runs on http://localhost:5173 /*

## 🔐 Sample Credentials (for testing)

> Note: You may need to register new accounts if database is fresh.

| Role | Email | Password |
|:---|:---|:---|
| **User** | user@example.com | password |
| **Restaurant** | owner@example.com | password |
| **Delivery** | delivery@example.com | password |
| **NGO** | ngo@example.com | password |
| **Admin** | admin@example.com | password |

## 🌟 Contributing
1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request
