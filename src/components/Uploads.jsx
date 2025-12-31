import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import { setFile, setUploadStatus, setUploadedData, clearAllFiles } from '../redux/uploadsSlice';
import './Uploads.css';

const Uploads = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const files = useSelector((state) => state.uploads.files);
  const uploadStatus = useSelector((state) => state.uploads.uploadStatus);
  const uploadedData = useSelector((state) => state.uploads.uploadedData);

  // Parse file to JSON using XLSX
  const parseFileToJson = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];

          if (!sheetName) {
            reject(new Error('No sheets found in file'));
            return;
          }

          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          if (jsonData.length === 0) {
            reject(new Error('File is empty'));
            return;
          }

          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse file: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsBinaryString(file);
    });
  };

  // Initialize Web Worker
  const processFileWithWorker = useCallback(async (file, fieldName) => {
    try {
      // Parse file to JSON first
      const jsonData = await parseFileToJson(file);

      // Create worker and validate data
      const worker = new Worker(new URL('../workers/fileWorker.js', import.meta.url));

      worker.onmessage = (event) => {
        const { success, data, error } = event.data;

        if (success) {
          dispatch(setUploadStatus({ fieldName, status: 'success' }));
          dispatch(setUploadedData({ fieldName, data }));
        } else {
          console.error(`Error processing ${fieldName}:`, error);
          dispatch(setUploadStatus({ fieldName, status: 'error' }));
        }
      };

      worker.onerror = (error) => {
        console.error(`Worker error for ${fieldName}:`, error);
        dispatch(setUploadStatus({ fieldName, status: 'error' }));
      };

      dispatch(setUploadStatus({ fieldName, status: 'processing' }));

      // Send parsed JSON data and fieldName to worker
      worker.postMessage({ jsonData, fieldName, fileName: file.name, fileSize: file.size });
    } catch (error) {
      console.error(`Error parsing file:`, error);
      dispatch(setUploadStatus({ fieldName, status: 'error' }));
    }
  }, [dispatch]);

  const handleFileChange = useCallback(
    (event, fieldName) => {
      const file = event.target.files[0];
      if (file) {
        dispatch(setFile({ fieldName, file }));
        processFileWithWorker(file, fieldName);
      }
    },
    [dispatch, processFileWithWorker]
  );


  const handleClear = () => {
    dispatch(clearAllFiles());
  };

  const handleSubmit = () => {
    if (
      uploadStatus.RTIS === 'success' &&
      uploadStatus.SNT === 'success' &&
      uploadStatus.FSD === 'success' &&
      uploadStatus.CMS === 'success'
    ) {
      // Save to localStorage before navigating
      localStorage.setItem(
        'uploads',
        JSON.stringify({
          files,
          uploadStatus,
          uploadedData,
        })
      );
      navigate('/result');
    }
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(
      'uploads',
      JSON.stringify({
        files,
        uploadStatus,
        uploadedData,
      })
    );
  }, [files, uploadStatus, uploadedData]);

  const isAllFilesProcessed =
    uploadStatus.RTIS && uploadStatus.SNT && uploadStatus.FSD && uploadStatus.CMS;
  const isAllFilesSuccess =
    uploadStatus.RTIS === 'success' &&
    uploadStatus.SNT === 'success' &&
    uploadStatus.FSD === 'success' &&
    uploadStatus.CMS === 'success';

  const renderStatusIcon = (status) => {
    if (status === 'processing') {
      return <FiLoader className="icon-spinner" />;
    } else if (status === 'success') {
      return <FiCheckCircle className="icon-success" />;
    } else if (status === 'error') {
      return <FiXCircle className="icon-error" />;
    }
    return null;
  };

  const fileInputFields = [
    { name: 'RTIS', label: 'RTIS' },
    { name: 'SNT', label: 'SNT' },
    { name: 'FSD', label: 'FSD' },
    { name: 'CMS', label: 'CMS' },
  ];

  return (
    <Container className="uploads-container">
      <Row className="justify-content-center w-100">
        <Col xs={12} sm={11} md={10} lg={8} xl={7} xxl={6}>
          <Card className="uploads-card">
            <Card.Header className="uploads-card-header">
              <Card.Title className="uploads-title">File Upload</Card.Title>
              <p className="uploads-subtitle">Upload all required files to continue</p>
            </Card.Header>

            <Card.Body className="uploads-card-body">
              <Row className="g-3">
                {fileInputFields.map((field) => (
                  <Col xs={12} md={6} key={field.name}>
                    <div className="file-input-wrapper">
                      <label htmlFor={field.name} className="file-input-label">
                        {field.label}
                        {uploadStatus[field.name] && (
                          <span className="status-icon">
                            {renderStatusIcon(uploadStatus[field.name])}
                          </span>
                        )}
                      </label>

                      <div className="file-input-dropzone">
                        <input
                          type="file"
                          id={field.name}
                          className="file-input"
                          onChange={(e) => handleFileChange(e, field.name)}
                          accept=".xlsx,.xls,.csv"
                          disabled={uploadStatus[field.name] === 'processing'}
                        />
                        <div className="dropzone-content">
                          <p className="dropzone-text">
                            {files[field.name]
                              ? files[field.name].name
                              : `Drag & Drop or Click to Upload`}
                          </p>
                          {!files[field.name] && (
                            <p className="dropzone-subtext">
                              Supported: .xlsx, .xls, .csv
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>

            <Card.Footer className="uploads-card-footer">
              <div className="button-group">
                <Button
                  variant="outline-secondary"
                  className="btn-clear"
                  onClick={handleClear}
                >
                  Clear
                </Button>
                <Button
                  variant="primary"
                  className="btn-submit"
                  onClick={handleSubmit}
                  disabled={!isAllFilesSuccess}
                >
                  Submit
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Uploads;
