# Forbes Shire Council Project Tracker

A professional web-based project tracking platform for civil engineering teams with enhanced project management capabilities and granular progress tracking.

## Features

- **6-Metric KPI Dashboard**: Total Projects, Active Construction, Construction Complete, Active Design, Design Complete, and Average Progress percentages
- **CSV Import/Export**: Seamless integration with existing Excel workflows
- **Project Management**: Complete CRUD operations with detailed progress tracking
- **Construction Progress Tracking**: From Pre-Construction through Defects Liability Period
- **Design Stage Management**: From Concept Design through Completion and Handover
- **Responsive Design**: Optimized for desktop and mobile use

## Technology Stack

- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Express.js with Node.js
- **Storage**: In-memory storage (easily replaceable with database)
- **UI Components**: Shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/forbes-project-tracker.git
cd forbes-project-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and query client
│   │   └── hooks/        # Custom React hooks
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data storage layer
├── shared/               # Shared TypeScript types
└── components.json       # Shadcn UI configuration
```

## Usage

### CSV Import/Export
- Import existing project data from CSV files
- Export project data for use in Excel
- Maintains compatibility with Forbes Shire Council format

### Project Management
- Create, edit, and delete projects
- Track progress across multiple phases: Survey, Design, Drawings, WAE
- Manage construction progress and design stages
- Add detailed comments and assign responsibilities

### KPI Dashboard
- Real-time metrics excluding "Not Started" projects
- Visual progress indicators
- Average completion percentages across all project phases

## CSV Format

The application supports CSV files with the following columns:
- Priority, Construction Progress, Design Stage
- Name, Design Project Number, Work Order Number
- Estimated Start Date, Estimated Date of Completion
- Brief Scope, Design Project Leader
- Survey By, Survey Method, Survey % Completed, Survey Status, Survey Comments
- Design By, Design % Completed, Design Status, Design Comments
- Drawings By, Drawings % Completed, Drawings Status, Drawings Comments
- WAE By, WAE % Completed, WAE Status, WAE Comments

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables
No environment variables required for basic operation.

## Deployment

### GitHub Pages (Static Export)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Heroku/Railway/Render
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team or create an issue in the GitHub repository.# Project-Tracker
