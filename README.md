# XML Parser Application

## Setup and Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Ensure MongoDB is running locally or use a cloud instance)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Gsharp73/Credit_Score_XML.git
   cd Credit_Score_XML
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add:
   ```sh
   MONGO_URI=your_mongodb_connection_string
   PORT=3000
   ```

### Running the Application
#### Backend:
```sh
cd backend
npm start
```
#### Frontend:
```sh
cd frontend
npm start
```

### Running Tests
To run tests:
```sh
npm test
```
For debugging async issues:
```sh
npm test -- --detectOpenHandles
```

### Features
- Upload XML files
- Parse and store extracted data in MongoDB
- View uploaded reports and upload history
- Display credit report details

### API Endpoints
- `POST /upload` - Uploads an XML file and extracts data
- `GET /reports` - Fetches all reports
- `GET /reports/:id` - Fetches report details
- `GET /history` - Fetches upload history

### Tech Stack
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, TailwindCSS
- **Testing**: Jest, Supertest

For any issues, feel free to create an issue in the repository.

