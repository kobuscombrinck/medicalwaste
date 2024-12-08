# Medical Waste Management System - Backend

This is the backend service for the Medical Waste Management System, providing APIs for fleet management, vehicle tracking, incident reporting, and document management.

## Features

- Vehicle Management
- Incident Tracking
- Document Management
- Maintenance Records
- Role-based Access Control
- Secure File Storage (Google Cloud Storage)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform Account
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
cd backend
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your configuration values

4. Set up Google Cloud Storage:
   - Create a project in Google Cloud Console
   - Enable Cloud Storage API
   - Create a service account and download the key file
   - Place the key file in `config/gcp-key.json`

## API Endpoints

### Vehicles

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Incidents

- `POST /api/vehicles/:id/incidents` - Add incident
- `PUT /api/vehicles/:id/incidents/:incidentId` - Update incident
- `DELETE /api/vehicles/:id/incidents/:incidentId` - Delete incident

### Documents

- `POST /api/vehicles/:id/documents` - Upload document
- `DELETE /api/vehicles/:id/documents/:documentId` - Delete document

### Maintenance

- `POST /api/vehicles/:id/maintenance` - Add maintenance record
- `GET /api/vehicles/:id/maintenance` - Get maintenance history

## Development

Start the development server:
```bash
npm run dev
```

## Testing

Run tests:
```bash
npm test
```

## Security

- JWT Authentication
- Role-based Access Control
- File type validation
- Request rate limiting
- Security headers with Helmet
- CORS configuration

## Error Handling

The API uses a centralized error handling system with:
- Operational vs Programming errors
- Development vs Production error responses
- Custom error classes
- Mongoose error handling
- JWT error handling

## Data Validation

- Input validation using Mongoose schemas
- File upload validation
- Custom validation utilities
- Error messages for invalid data

## File Storage

Documents are stored in Google Cloud Storage with:
- Secure file uploads
- Unique file names
- Public URL generation
- Automatic file deletion
- File type restrictions
- Size limits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
