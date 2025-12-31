# Violations Report Application

A modern ReactJS 19 application for managing and processing violation reports with file upload capabilities and comprehensive data visualization.

## Features

### 🎨 Modern UI/UX
- Professional color theme with custom CSS variables
- Fully responsive design (mobile, tablet, desktop, large screens)
- Bootstrap 5 integration with custom styling
- Smooth animations and transitions

### 📁 File Management
- **Drag & Drop File Upload**: Intuitive file upload interface with drag-and-drop functionality
- **Multi-file Processing**: Upload up to 4 different file types (RTIS, SNT, FSD, CMS)
- **Web Worker Processing**: Asynchronous file processing with visual feedback
- **File Validation**: Support for Excel (.xlsx, .xls) and CSV files
- **Progress Indicators**: Spinning loader, success checkmark, and error indicators

### 📊 Data Visualization
- **Responsive Data Table**: 14-column table with sorting and pagination
- **Sticky Header**: Table header remains visible during scroll
- **Status Badges**: Color-coded severity and status indicators
- **Export Functionality**: Export violation data as CSV

### 🔧 Technical Stack
- **React 19**: Latest React version with modern hooks
- **Vite**: Fast build tool and development server
- **React Router v6**: Client-side routing
- **Bootstrap 5**: Responsive design framework
- **react-bootstrap**: React components for Bootstrap
- **XLSX**: Excel file parsing and handling
- **react-icons**: Icon library for UI elements
- **Web Workers**: Off-main-thread file processing

## Project Structure

```
src/
├── components/
│   ├── Home.jsx              # Main layout with navigation
│   ├── Home.css              # Home component styles
│   ├── Uploads.jsx           # File upload interface
│   ├── Uploads.css           # Upload component styles
│   ├── Result.jsx            # Results table display
│   └── Result.css            # Results component styles
├── workers/
│   └── fileWorker.js         # Web worker for file processing
├── router.js                 # Route configuration
├── App.jsx                   # Root app component
├── App.css                   # App styles
├── main.jsx                  # Entry point
├── index.css                 # Global styles
└── theme.css                 # Custom color theme
```

## Color Palette

The application uses a railway/transportation-themed color palette:

```css
--sky-blue: #0096D6;      /* Background, Accents */
--railway-red: #C72C41;   /* Alerts, Warnings */
--signal-yellow: #F9D600; /* Caution Signs, Highlights */
--dark-gray: #333333;     /* Text and Information */
--white: #FFFFFF;         /* Background, Contrast */
--green: #2ECC71;         /* Success Indicators */
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5174/`

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## Usage

### Upload Files
1. Navigate to the home page
2. Upload 4 required files (RTIS, SNT, FSD, CMS)
3. Drag-and-drop files onto the drop zones or click to select
4. Wait for 3-second processing in the web worker
5. Once all files are validated, click "Submit"

### View Results
1. After submission, the results table displays all violation data
2. Click column headers to sort data
3. Use pagination controls to navigate between pages
4. Click "Export" to download the data as CSV

## Components

### Home Component
- Navigation bar with train icon
- "Violations" title
- Child route outlet for pages

### Uploads Component
- 4 file input fields with drag-and-drop
- Real-time validation with visual feedback
- Spinning loader during processing
- Clear and Submit buttons
- Responsive grid layout

### Result Component
- 14-column data table
- Sticky header for easy scrolling
- Sorting functionality (click headers)
- Pagination with navigation controls
- Export to CSV functionality
- Back button to return to uploads

## Web Worker Processing

The application uses Web Workers for non-blocking file processing:

- **3-second delay**: Simulates file processing time
- **File validation**: Checks file type and size
- **Asynchronous processing**: Prevents UI blocking
- **Error handling**: Returns appropriate error messages

Supported file types:
- `.xlsx` (Excel Open XML)
- `.xls` (Excel Binary)
- `.csv` (Comma-separated values)

Maximum file size: 10MB

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile** (< 576px): Optimized for small screens
- **Tablet** (576px - 768px): Medium-size layout adjustments
- **Desktop** (768px - 1200px): Full feature display
- **Large screens** (> 1200px): Maximum width optimization

## React 19 Best Practices

- **Functional Components**: All components use React 19 hooks
- **Custom Hooks**: Reusable logic with `useCallback`, `useMemo`, `useState`
- **Automatic Batch Updates**: Leverages React 19's improved batching
- **Use Transition Hooks**: For better performance with state updates
- **Proper Key Management**: Lists use unique keys for performance
- **Component Composition**: Clean separation of concerns
- **Lazy Loading**: Routes configured for code splitting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Code Splitting**: Routes split automatically with React Router
- **Lazy Component Loading**: Components loaded on demand
- **Web Workers**: Heavy computation off the main thread
- **CSS Optimization**: Bootstrap customization reduces unused styles
- **Image Optimization**: SVG icons via react-icons

## Future Enhancements

- Real Excel file parsing with XLSX library
- Database integration for data persistence
- User authentication and authorization
- Advanced filtering and search
- Real-time collaboration features
- Dark mode support
- Internationalization (i18n)
- Analytics and reporting dashboards

## License

MIT License - Free to use and modify

## Support

For issues or feature requests, please contact the development team.
