# WHOIS Domain Lookup Application

A full-stack web application that provides comprehensive domain information using the WhoisXMLAPI service. Built with Next.js, React, and Tailwind CSS.

## Features

- **Domain Information Lookup**: Get registration details, expiration dates, domain age, and nameservers
- **Contact Information Lookup**: Retrieve registrant, technical, and administrative contact details
- **Modern UI**: Clean, responsive interface with Tailwind CSS styling
- **Error Handling**: Graceful error handling with user-friendly messages
- **Real-time Loading States**: Visual feedback during API requests

## Tech Stack

- **Frontend**: React with Next.js 14
- **Backend**: Next.js API Routes
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: WhoisXMLAPI integration
- **TypeScript**: Full type safety

## Prerequisites

- Node.js 18+ installed
- A free WhoisXMLAPI account and API key

## Setup Instructions

### 1. Get Your API Key

1. Visit [WhoisXMLAPI](https://whois.whoisxmlapi.com/)
2. Create a free account
3. Navigate to your user settings
4. Copy your API key

### 2. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd whois-lookup-app

# Install dependencies
npm install --legacy-peer-deps
```

### 3. Environment Configuration

```bash
# Edit .env.local and add your API key
WHOIS_API_KEY=your_actual_api_key_here
```

### 4. Run the Application

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. For Production Deployment on Port 5000

```bash
# Build the application
npm run build

# Start the production server on port 5000
npm start -- -p 5000
```

## Usage

1. **Enter Domain Name**: Type a domain name (e.g., "amazon.com") in the input field
2. **Select Information Type**: Choose between "Domain Information" or "Contact Information"
3. **Submit**: Click the "Lookup Domain" button to fetch data
4. **View Results**: The information will be displayed in a formatted table below

## API Endpoints

### POST /api/whois

Fetches WHOIS data for a given domain.

**Request Body:**
```json
{
  "domain": "amazon.com",
  "type": "domain" // or "contact"
}
```

**Response (Domain Info):**
```json
{
  "domainName": "amazon.com",
  "registrar": "MarkMonitor Inc.",
  "registrationDate": "11/1/1994",
  "expirationDate": "10/31/2024",
  "estimatedDomainAge": "29 years, 2 months",
  "hostnames": "ns1.amazon.com, ns2.amazon.com..."
}
```

**Response (Contact Info):**
```json
{
  "registrantName": "Amazon Technologies, Inc.",
  "technicalContactName": "Hostmaster",
  "administrativeContactName": "Admin Contact",
  "contactEmail": "hostmaster@amazon.com"
}
```

## Project Structure

```
whois-lookup-app/
├── app/
│   ├── api/whois/route.ts    # Backend API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main frontend component
├── components/ui/           # shadcn/ui components
├── .env.example            # Environment variables template
├── README.md              # This file
└── package.json          # Dependencies and scripts
```

## Error Handling

The application handles various error scenarios:

- Invalid domain names
- API key not configured
- Network errors
- Invalid API responses
- Rate limiting

## Testing

Test the application with known domains:
- `amazon.com` - Well-established domain with full information
- `google.com` - Another reliable test case
- `github.com` - Tech company domain

## Deployment

### Local Deployment (Port 5000)

```bash
npm run build
npm start -- -p 5000
```

## License

This project is for educational purposes as part of a coding assignment.

## Support

If you encounter any issues:
1. Check that your API key is correctly configured
2. Verify the domain name format
3. Check the browser console for detailed error messages
4. Ensure you have a stable internet connection
