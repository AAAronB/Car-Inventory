# Car Inventory Management System

A comprehensive web-based car inventory management system with API access, maintenance tracking, and dealer management capabilities.

## 🚗 Features

- **Car Management**: Add, view, search, and manage car inventory
- **Dealer Management**: Track car dealers and their information
- **Maintenance Records**: Log and view maintenance history for each car
- **User Authentication**: Secure login and registration system
- **API Access**: RESTful API for programmatic access
- **Search Functionality**: Advanced search with multiple criteria
- **Bargain Finder**: Quick access to cars under £20,000
- **Interactive Interface**: Modern UI with spinning car animations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### 1. Clone the Repository

git clone <repository-url>
cd bettys-books

### 2. Install Dependencies if not present

npm install

### 3. Database Setup
1. Create a MySQL database named `CarInventory`
2. Run the database creation script in create_db.sql
3. (Optional) Add sample data from insert_test_data.sql

### 4. Configure Database Connection
Update the database connection in `index.js` if needed:
javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'car_inventory_app',
    password: 'qwertyuiop',
    database: 'CarInventory'
})

### 5. Start the Application

node index.js
The application will be available at `http://localhost:8000`

## 📖 How to Use the Application

### 🏠 Home Page
- **URL**: `http://localhost:8000`
- **Features**: 
  - Navigation to all major functions
  - Quick access to car listings, search, and management tools
  - Links to API Explorer and user management

### 👤 User Management

#### Registration
1. Click "Register with us" from the home page
2. Fill in the registration form:
   - First Name
   - Last Name
   - Email
   - Username
   - Password
3. Click "Register" to create your account

#### Login
1. Click "Login to your account" from the home page
2. Enter your username and password
3. Click "Login" to access the system

### 🚗 Car Management

#### View All Cars
1. Click "List of cars" from the home page
2. View all cars with dealer information
3. Cars are sorted by price (lowest first)

#### Search for Cars
1. Click "Search for cars" from the home page
2. Use the search form with any combination of:
   - **Make**: Car manufacturer (e.g., Toyota, Ford)
   - **Model**: Car model (e.g., Camry, Focus)
   - **Year**: Manufacturing year
   - **Max Price**: Maximum price limit
3. Click "Search Cars" to find matching vehicles

#### Add a New Car
1. Click "Add a new car" from the home page
2. Fill in the car details:
   - **Make**: Car manufacturer
   - **Model**: Car model
   - **Color**: Car color
   - **Price**: Car price (must be positive)
   - **Condition**: New, Used, or Certified
   - **Dealer**: Select from existing dealers
3. Click "Add Car" to save the car

#### View Bargain Cars
1. Click "Bargain cars" from the home page
2. View all cars priced under £20,000
3. Perfect for finding affordable vehicles

### 🏢 Dealer Management

#### View All Dealers
1. Click "List of car dealers" from the home page
2. View all registered dealers with contact information

#### Add a New Dealer
1. Click "Add a new car dealer" from the home page
2. Fill in the dealer information:
   - **Name**: Dealer business name
   - **Contact**: Contact number
   - **Location**: Dealer address/location
3. Click "Add Dealer" to save

### 🔧 Maintenance Management

#### View Maintenance History
1. Click "Maintenance history" from the home page
2. Enter the car make and model
3. Click "Search" to view maintenance records
4. View service dates, types, and costs

#### Add Maintenance Record
1. Click "Add new maintenance" from the home page
2. Fill in the maintenance details:
   - **Car ID**: Select the car from dropdown
   - **Service Date**: Date of service
   - **Service Details**: Description of work done
   - **Cost**: Service cost (optional)
3. Click "Add Maintenance Record" to save

### 🔍 API Explorer

#### Access API Explorer
1. Click "API Explorer" from the home page
2. No login required - publicly accessible
3. Interactive interface for testing all API endpoints

#### Available API Endpoints

##### Cars API
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get specific car by ID
- `POST /api/cars` - Add new car
- `PUT /api/cars/:id` - Update car
- `DELETE /api/cars/:id` - Delete car

##### Dealers API
- `GET /api/dealers` - Get all dealers
- `POST /api/dealers` - Add new dealer

##### Maintenance API
- `GET /api/maintenance` - Get all maintenance records
- `GET /api/maintenance/:carId` - Get maintenance for specific car
- `POST /api/maintenance` - Add maintenance record

##### Search API
- `GET /api/search/cars` - Search cars with filters

##### Statistics API
- `GET /api/stats` - Get system statistics

#### Using the API Explorer
1. **Select a Tab**: Choose from Cars, Dealers, Maintenance, Users, Search, or Statistics
2. **Test Endpoints**: Click "Test Endpoint" buttons to make API calls
3. **View Responses**: See JSON responses in real-time
4. **Add Data**: Use forms to test POST requests
5. **Search**: Use search forms to test filtered queries

### 👥 User Administration

#### View All Users
1. Click "List users" from the home page
2. View all registered users (names and emails only)
3. Available to all users (no admin restrictions)

### 🌤️ Weather Feature

#### Check Weather
1. Click "Check the current weather forecast" from the home page
2. Enter a city name
3. Click "Get Weather" to view current weather conditions
4. View temperature, humidity, and weather description

## 🔧 Technical Details

### Database Schema
- **Cars**: Car inventory with make, model, price, condition, dealer
- **Dealers**: Dealer information with name, contact, location
- **MaintenanceRecords**: Service history with dates, details, costs
- **Users**: User accounts with authentication

### API Authentication
- **Public Access**: All API endpoints are publicly accessible
- **No Authentication Required**: No API keys or tokens needed
- **Session-Based**: Web interface uses session-based authentication

### Security Features
- **Input Sanitization**: All user inputs are sanitized
- **SQL Injection Protection**: Parameterized queries
- **Validation**: Comprehensive input validation
- **Error Handling**: Secure error messages


## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `index.js`
- Verify database `CarInventory` exists

#### Port Already in Use
- Change port in `index.js` (line 8)
- Or kill existing process using port 8000

#### Missing Dependencies

npm install

#### Database Schema Issues

Run create_db.sql in mysql.

### Error Messages
- **"Database error occurred"**: Check database connection
- **"Validation failed"**: Check input data format
- **"Car not found"**: Verify car ID exists
- **"Authentication required"**: Login to access protected features

## 🔄 Updates and Maintenance

### Adding New Features
1. Create new routes in appropriate files
2. Add corresponding EJS templates
3. Update navigation links
4. Test thoroughly

### Logs
Check console output for:
- Database connection status
- API request logs
- Error messages

## 📄 License

This project is for educational and demonstration purposes.

---

**Enjoy managing your car inventory with style! 🚗✨**
