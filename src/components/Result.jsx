import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Table, Button, Row, Col, Pagination } from 'react-bootstrap';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import './Result.css';

const Result = () => {
  const navigate = useNavigate();
  const uploadedData = useSelector((state) => state.uploads.uploadedData);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [filterConfig, setFilterConfig] = useState({});
  const itemsPerPage = 10;

  // Sample data with 14 columns
  const [tableData] = useState([
    {
      id: 1,
      date: '2025-01-15',
      category: 'Speed',
      violation: 'Exceeding Speed Limit',
      location: 'Main Street',
      officer: 'John Doe',
      vehicle: 'ABC-123',
      severity: 'High',
      status: 'Pending',
      amount: '$500',
      reference: 'REF-001',
      notes: 'Speed camera violation',
      processed: 'No',
      uploaded: 'Yes',
    },
    {
      id: 2,
      date: '2025-01-14',
      category: 'Safety',
      violation: 'No Seat Belt',
      location: 'Highway 101',
      officer: 'Jane Smith',
      vehicle: 'DEF-456',
      severity: 'Medium',
      status: 'Resolved',
      amount: '$250',
      reference: 'REF-002',
      notes: 'Safety equipment violation',
      processed: 'Yes',
      uploaded: 'Yes',
    },
    {
      id: 3,
      date: '2025-01-13',
      category: 'Parking',
      violation: 'Illegal Parking',
      location: 'Downtown',
      officer: 'Mike Johnson',
      vehicle: 'GHI-789',
      severity: 'Low',
      status: 'Pending',
      amount: '$100',
      reference: 'REF-003',
      notes: 'Parking zone violation',
      processed: 'No',
      uploaded: 'Yes',
    },
    {
      id: 4,
      date: '2025-01-12',
      category: 'Traffic',
      violation: 'Red Light Violation',
      location: '5th Avenue',
      officer: 'Sarah Williams',
      vehicle: 'JKL-012',
      severity: 'High',
      status: 'Resolved',
      amount: '$400',
      reference: 'REF-004',
      notes: 'Traffic signal violation',
      processed: 'Yes',
      uploaded: 'Yes',
    },
    {
      id: 5,
      date: '2025-01-11',
      category: 'Equipment',
      violation: 'Broken Headlight',
      location: 'Oak Street',
      officer: 'Robert Brown',
      vehicle: 'MNO-345',
      severity: 'Low',
      status: 'Pending',
      amount: '$75',
      reference: 'REF-005',
      notes: 'Equipment malfunction',
      processed: 'No',
      uploaded: 'Yes',
    },
    {
      id: 6,
      date: '2025-01-10',
      category: 'Speed',
      violation: 'Speeding in School Zone',
      location: 'School District',
      officer: 'Emily Davis',
      vehicle: 'PQR-678',
      severity: 'High',
      status: 'Resolved',
      amount: '$600',
      reference: 'REF-006',
      notes: 'School zone speed violation',
      processed: 'Yes',
      uploaded: 'Yes',
    },
    {
      id: 7,
      date: '2025-01-09',
      category: 'Safety',
      violation: 'Expired Registration',
      location: 'Police Station',
      officer: 'David Miller',
      vehicle: 'STU-901',
      severity: 'Medium',
      status: 'Pending',
      amount: '$150',
      reference: 'REF-007',
      notes: 'Document expired',
      processed: 'No',
      uploaded: 'Yes',
    },
    {
      id: 8,
      date: '2025-01-08',
      category: 'Traffic',
      violation: 'Wrong Way Driving',
      location: 'North Road',
      officer: 'Lisa Anderson',
      vehicle: 'VWX-234',
      severity: 'Critical',
      status: 'Resolved',
      amount: '$800',
      reference: 'REF-008',
      notes: 'Dangerous driving violation',
      processed: 'Yes',
      uploaded: 'Yes',
    },
  ]);

  const columns = [
    'ID',
    'Date',
    'Category',
    'Violation',
    'Location',
    'Officer',
    'Vehicle',
    'Severity',
    'Status',
    'Amount',
    'Reference',
    'Notes',
    'Processed',
    'Uploaded',
  ];

  // Sorting logic
  const sortedData = useMemo(() => {
    let sorted = [...tableData];

    if (sortConfig) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sorted;
  }, [tableData, sortConfig]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleExport = () => {
    // Export functionality can be implemented here
    const csv = generateCSV(sortedData);
    downloadCSV(csv, 'violations-report.csv');
  };

  const generateCSV = (data) => {
    const headers = columns.join(',');
    const rows = data.map((row) =>
      columns.map((col) => row[col.toLowerCase().replace(' ', '')]).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'critical';
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      case 'Low':
        return 'low';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Resolved' ? 'resolved' : 'pending';
  };

  return (
    <Container fluid className="result-container">
      <div className="result-header">
        <Button
          variant="light"
          className="back-button"
          onClick={handleBack}
          title="Go back"
        >
          <FiArrowLeft size={20} />
          <span>Back</span>
        </Button>
        <h1 className="result-title">Violations Report</h1>
        <Button
          variant="primary"
          className="export-button"
          onClick={handleExport}
          title="Export data"
        >
          <FiDownload size={20} />
          <span>Export</span>
        </Button>
      </div>

      <div className="table-wrapper">
        <Table
          striped
          bordered
          hover
          responsive
          className="result-table"
        >
          <thead className="table-header-sticky">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="table-header-cell"
                  onClick={() => handleSort(col.toLowerCase().replace(' ', ''))}
                  style={{ cursor: 'pointer' }}
                  title={`Click to sort by ${col}`}
                >
                  <div className="header-content">
                    <span>{col}</span>
                    <span className="sort-indicator">
                      {sortConfig?.key === col.toLowerCase().replace(' ', '')
                        ? sortConfig.direction === 'asc'
                          ? ' ▲'
                          : ' ▼'
                        : ''}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id}>
                <td className="cell-id">{row.id}</td>
                <td className="cell-date">{row.date}</td>
                <td className="cell-category">{row.category}</td>
                <td className="cell-violation">{row.violation}</td>
                <td className="cell-location">{row.location}</td>
                <td className="cell-officer">{row.officer}</td>
                <td className="cell-vehicle">{row.vehicle}</td>
                <td>
                  <span className={`severity-badge severity-${getSeverityColor(row.severity)}`}>
                    {row.severity}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="cell-amount">{row.amount}</td>
                <td className="cell-reference">{row.reference}</td>
                <td className="cell-notes">{row.notes}</td>
                <td className="cell-processed">{row.processed}</td>
                <td className="cell-uploaded">{row.uploaded}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="pagination-wrapper">
        <Pagination>
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          />

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Container>
  );
};

export default Result;
