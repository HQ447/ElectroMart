## 🔧 Technical Overview

TechMart is a scalable MERN stack e-commerce application that provides an end-to-end tech shopping experience. It includes customer-facing features, as well as role-based dashboards for Admins, Managers, and Riders to manage products, orders, and delivery statuses.

### 🚀 Key Features

- 🛍️ **Tech Accessories Store**

  - Browse and search a variety of tech products with images, pricing, categories, and stock info.
  - Add items to the cart and proceed through a secure checkout process.

- 👤 **User Authentication**

  - Secure signup and login with JWT.
  - Role-based access: Customer, Admin, Manager, Rider.

- 🧑‍💼 **Admin & Manager Dashboard**

  - Add, edit, or delete products.
  - View and manage all customer orders.
  - Assign or reassign orders to delivery riders.
  - Monitor platform activity.

- 🚴 **Rider Dashboard**

  - Riders can view assigned orders.
  - Update order status: `Pending → Packed → Shipped → Out for Delivery → Delivered`.
  - Real-time status updates visible to customers.

- 📦 **Order Lifecycle Tracking**

  - Full order progress tracking from placement to delivery.
  - Customers receive real-time updates on order status.

- 🖼️ **Image Uploads**

  - Product images are uploaded via Multer to Cloudinary (or local fallback).
  - Metadata stored in MongoDB.

- 🔐 **Secure APIs & Role-based Access Control**
  - Separate routes and permissions for admin, manager, rider, and customers.
  - Middleware ensures secure route access.

---

### 🧱 Tech Stack

- **Frontend:** React.js, Axios, Redux Toolkit , Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (role-based)
- **Real-Time Updates:** WebSockets or REST polling
- **File Uploads:** Multer + Cloudinary

---

### 📂 User Interface (Frontend)

![Screenshot (576)](https://github.com/user-attachments/assets/499759cd-a7ed-40bc-a3ee-d8c4f76159d4)

![Screenshot (577)](https://github.com/user-attachments/assets/ee2c16b9-5706-47e1-913b-60bdff8710c7)

![Screenshot (578)](https://github.com/user-attachments/assets/4753f1e5-5213-4238-844a-a45465ce324b)

![Screenshot (579)](https://github.com/user-attachments/assets/09684298-5a49-474c-abd4-1dc436142612)

![Screenshot (580)](https://github.com/user-attachments/assets/8ebd1e88-8c77-4914-9c92-ae910dc55f0f)

![Screenshot (581)](https://github.com/user-attachments/assets/2813f451-aaf5-479a-9bc4-3155327ed34d)

![Screenshot (582)](https://github.com/user-attachments/assets/366373a2-abb3-45ce-98aa-4475d7046689)

![Screenshot (583)](https://github.com/user-attachments/assets/ccc3f273-de74-4be0-aa37-40d0300c7d2f)

![Screenshot (584)](https://github.com/user-attachments/assets/60eddf01-bc1b-4eba-872d-c4c0de74c0ed)

![Screenshot (585)](https://github.com/user-attachments/assets/d7ebcc9f-6795-4369-870d-b3267acd8893)

![Screenshot (586)](https://github.com/user-attachments/assets/9b64d5cd-f872-4cfb-a0db-c37f71542b4a)

![Screenshot (587)](https://github.com/user-attachments/assets/9f318abc-6d67-4a2b-b796-48f93132217d)

![Screenshot (588)](https://github.com/user-attachments/assets/0664aed6-0297-4fca-909d-9c5fb76dddff)
