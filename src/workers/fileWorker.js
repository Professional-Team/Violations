// File Worker - Validates parsed JSON data with 3-second delay

self.onmessage = async (event) => {
  try {
    const { jsonData, fieldName, fileName, fileSize } = event.data;

    // Validate data based on field type
    const validationResult = validateFieldData(jsonData, fieldName);

    if (!validationResult.isValid) {
      self.postMessage({
        success: false,
        error: validationResult.errors.join('; '),
      });
      return;
    }

    // Simulate processing delay (3 seconds as requested)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Process the file
    const fileData = {
      name: fileName,
      size: fileSize,
      rows: jsonData.length,
      data: jsonData,
      processedAt: new Date().toISOString(),
      status: 'processed',
      fieldName: fieldName,
    };

    // Send success response
    self.postMessage({
      success: true,
      data: fileData,
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message || 'Error processing file',
    });
  }
};

// Validation methods for each field type
function validateFieldData(data, fieldName) {
  const validators = {
    RTIS: validateRTIS,
    SNT: validateSNT,
    FSD: validateFSD,
    CMS: validateCMS,
  };

  const validator = validators[fieldName];

  if (!validator) {
    return {
      isValid: true,
      errors: [],
    };
  }

  return validator(data);
}

// RTIS Validation
function validateRTIS(data) {
  const errors = [];
  const requiredFields = [
    'Sr.No.',
    'Device Id',
    'Loco No.',
    'Lattitude',
    'Longitude',
    'Station',
    'Event Time',
    'Event Type',
    'Speed',
    'Division Code',
    'Reporting Time',
  ];

  // Check if data is empty
  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data found in file'] };
  }

  // Check first row for required fields
  const firstRow = data[0];
  const missingFields = requiredFields.filter((field) => !(field in firstRow));

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    return {
      isValid: false,
      errors: errors,
    };
  }

  // Validate each row
  data.slice(0, 10).forEach((row, index) => {
    const rowNum = index + 2; // Start from 2 (header is row 1)

    // Sr.No. - positive integer
    if (!row['Sr.No.']) {
      errors.push(`Row ${rowNum}: 'Sr.No.' is required`);
    } else if (!Number.isInteger(Number(row['Sr.No.'])) || Number(row['Sr.No.']) <= 0) {
      errors.push(`Row ${rowNum}: 'Sr.No.' must be a positive integer`);
    }

    // Device Id - positive integer with fixed 4 digit length
    if (!row['Device Id']) {
      errors.push(`Row ${rowNum}: 'Device Id' is required`);
    } else {
      const deviceId = String(row['Device Id']).trim();
      if (!/^\d{4}$/.test(deviceId)) {
        errors.push(`Row ${rowNum}: 'Device Id' must be exactly 4 digits`);
      } else if (!Number.isInteger(Number(deviceId)) || Number(deviceId) <= 0) {
        errors.push(`Row ${rowNum}: 'Device Id' must be a positive integer`);
      }
    }

    // Loco No. - positive integer with fixed 5 digit length
    if (!row['Loco No.']) {
      errors.push(`Row ${rowNum}: 'Loco No.' is required`);
    } else {
      const locoNo = String(row['Loco No.']).trim();
      if (!/^\d{5}$/.test(locoNo)) {
        errors.push(`Row ${rowNum}: 'Loco No.' must be exactly 5 digits`);
      } else if (!Number.isInteger(Number(locoNo)) || Number(locoNo) <= 0) {
        errors.push(`Row ${rowNum}: 'Loco No.' must be a positive integer`);
      }
    }

    // Lattitude - valid latitude double number (-90 to 90)
    if (!row['Lattitude']) {
      errors.push(`Row ${rowNum}: 'Lattitude' is required`);
    } else {
      const latitude = parseFloat(row['Lattitude']);
      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        errors.push(`Row ${rowNum}: 'Lattitude' must be a valid number between -90 and 90`);
      }
    }

    // Longitude - valid longitude double number (-180 to 180)
    if (!row['Longitude']) {
      errors.push(`Row ${rowNum}: 'Longitude' is required`);
    } else {
      const longitude = parseFloat(row['Longitude']);
      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        errors.push(`Row ${rowNum}: 'Longitude' must be a valid number between -180 and 180`);
      }
    }

    // Station - string between 1 to 30 characters
    if (!row['Station']) {
      errors.push(`Row ${rowNum}: 'Station' is required`);
    } else {
      const station = String(row['Station']).trim();
      if (station.length < 1 || station.length > 30) {
        errors.push(`Row ${rowNum}: 'Station' must be between 1 and 30 characters`);
      }
    }

    // Event Time - date+time format (ISO 8601 or common formats)
    if (!row['Event Time']) {
      errors.push(`Row ${rowNum}: 'Event Time' is required`);
    } else {
      const eventTime = new Date(row['Event Time']);
      if (isNaN(eventTime.getTime())) {
        errors.push(`Row ${rowNum}: 'Event Time' must be a valid date-time format`);
      }
    }

    // Event Type - string between 1 to 5 characters
    if (!row['Event Type']) {
      errors.push(`Row ${rowNum}: 'Event Type' is required`);
    } else {
      const eventType = String(row['Event Type']).trim();
      if (eventType.length < 1 || eventType.length > 5) {
        errors.push(`Row ${rowNum}: 'Event Type' must be between 1 and 5 characters`);
      }
    }

    // Speed - positive integer
    if (!row['Speed']) {
      errors.push(`Row ${rowNum}: 'Speed' is required`);
    } else if (!Number.isInteger(Number(row['Speed'])) || Number(row['Speed']) < 0) {
      errors.push(`Row ${rowNum}: 'Speed' must be a positive integer`);
    }

    // Division Code - string between 1 to 20 characters
    if (!row['Division Code']) {
      errors.push(`Row ${rowNum}: 'Division Code' is required`);
    } else {
      const divisionCode = String(row['Division Code']).trim();
      if (divisionCode.length < 1 || divisionCode.length > 20) {
        errors.push(`Row ${rowNum}: 'Division Code' must be between 1 and 20 characters`);
      }
    }

    // Reporting Time - date+time format (ISO 8601 or common formats)
    if (!row['Reporting Time']) {
      errors.push(`Row ${rowNum}: 'Reporting Time' is required`);
    } else {
      const reportingTime = new Date(row['Reporting Time']);
      if (isNaN(reportingTime.getTime())) {
        errors.push(`Row ${rowNum}: 'Reporting Time' must be a valid date-time format`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors.slice(0, 10), // Return first 10 errors
  };
}

// SNT Validation
function validateSNT(data) {
  const errors = [];
  const requiredFields = ['ticket_id', 'officer_id', 'location', 'severity'];

  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data found in file'] };
  }

  const firstRow = data[0];
  const missingFields = requiredFields.filter((field) => !(field in firstRow));

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  data.slice(0, 10).forEach((row, index) => {
    if (!row.ticket_id) {
      errors.push(`Row ${index + 2}: Missing or empty 'ticket_id'`);
    }
    if (!row.officer_id) {
      errors.push(`Row ${index + 2}: Missing or empty 'officer_id'`);
    }
    const validSeverity = ['Low', 'Medium', 'High', 'Critical'];
    if (row.severity && !validSeverity.includes(row.severity)) {
      errors.push(`Row ${index + 2}: Invalid severity level`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors.slice(0, 5),
  };
}

// FSD Validation
function validateFSD(data) {
  const errors = [];
  const requiredFields = ['file_id', 'document_type', 'upload_date', 'status'];

  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data found in file'] };
  }

  const firstRow = data[0];
  const missingFields = requiredFields.filter((field) => !(field in firstRow));

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  data.slice(0, 10).forEach((row, index) => {
    if (!row.file_id) {
      errors.push(`Row ${index + 2}: Missing or empty 'file_id'`);
    }
    if (!row.document_type) {
      errors.push(`Row ${index + 2}: Missing or empty 'document_type'`);
    }
    const validStatus = ['Pending', 'Approved', 'Rejected', 'Archived'];
    if (row.status && !validStatus.includes(row.status)) {
      errors.push(`Row ${index + 2}: Invalid status value`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors.slice(0, 5),
  };
}

// CMS Validation
function validateCMS(data) {
  const errors = [];
  const requiredFields = ['case_id', 'case_number', 'description', 'assigned_to'];

  if (!data || data.length === 0) {
    return { isValid: false, errors: ['No data found in file'] };
  }

  const firstRow = data[0];
  const missingFields = requiredFields.filter((field) => !(field in firstRow));

  if (missingFields.length > 0) {
    errors.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  data.slice(0, 10).forEach((row, index) => {
    if (!row.case_id) {
      errors.push(`Row ${index + 2}: Missing or empty 'case_id'`);
    }
    if (!row.case_number) {
      errors.push(`Row ${index + 2}: Missing or empty 'case_number'`);
    }
    if (!row.assigned_to) {
      errors.push(`Row ${index + 2}: Missing or empty 'assigned_to'`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors.slice(0, 5),
  };
}
