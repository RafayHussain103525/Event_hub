export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters',
    };
  }

  if (password.length > 110) {
    return {
      isValid: false,
      message: 'Password must be under 110 characters',
    };
  }

  return { isValid: true, message: '' };
};

export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { isValid: false, message: 'Phone number is required' };
  }

  if (phone.length > 20) {
    return { isValid: false, message: 'Phone number is too long' };
  }

  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;

  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: 'Invalid phone number format' };
  }

  return { isValid: true, message: '' };
};

export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }

  if (username.length > 50) {
    return { isValid: false, message: 'Username must be under 50 characters' };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, underscores, and hyphens',
    };
  }

  return { isValid: true, message: '' };
};

export const validateOrganizerName = (name) => {
  if (!name) {
    return { isValid: false, message: 'Organization name is required' };
  }

  if (name.length > 100) {
    return {
      isValid: false,
      message: 'Organization name must be under 100 characters',
    };
  }

  return { isValid: true, message: '' };
};

export const validateEventForm = (eventData) => {
  const errors = {};


  if (!eventData.name?.trim()) {
    errors.name = 'Event name is required';
  } else if (eventData.name.length > 100) {
    errors.name = 'Event name must be under 100 characters';
  }


  if (!eventData.date) {
    errors.date = 'Event date is required';
  } else {
    const eventDate = new Date(eventData.date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      errors.date = 'Event date cannot be in the past';
    }
  }


  if (!eventData.location?.trim()) {
    errors.location = 'Location is required';
  } else if (eventData.location.length > 200) {
    errors.location = 'Location must be under 200 characters';
  }


  if (!eventData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (eventData.description.length > 500) {
    errors.description = 'Description must be under 500 characters';
  }

  if (eventData.image_url && eventData.image_url.trim() !== '') {
    try {
      new URL(eventData.image_url);
    } catch {
      errors.image_url = 'Invalid URL format';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (credentials) => {
  const errors = {};

  if (!credentials.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(credentials.email)) {
    errors.email = 'Invalid email format';
  }

  if (!credentials.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignupForm = (formData, accountType) => {
  const errors = {};

  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  const phoneResult = validatePhoneNumber(formData.phone_number);
  if (!phoneResult.isValid) {
    errors.phone_number = phoneResult.message;
  }

  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.message;
  }


  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (accountType === 'user') {
    const usernameResult = validateUsername(formData.username);
    if (!usernameResult.isValid) {
      errors.username = usernameResult.message;
    }
  } else if (accountType === 'organizer') {
    const nameResult = validateOrganizerName(formData.name);
    if (!nameResult.isValid) {
      errors.name = nameResult.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const extractApiError = (err, fallback = 'An error occurred') => {
  if (err?.response?.data?.detail) {
    return err.response.data.detail;
  }

  if (err?.message) {
    return err.message;
  }

  return fallback;
};