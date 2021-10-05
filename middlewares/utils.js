// importing the required modules

// defining the utils class
class Utils {
  constructor() {
    // defining all the possible keys to be accepted in the user update route
    this.update = [
      'bio',
      'name',
      'email',
      'username',
      'lga',
      'servingState',
      'platoon',
      'religiousOrg',
    ];

    // defining the possible instances of messages that can received from the backend
    this.messages = {
      IMAGE_UPLOAD_ERROR: 'Please check your images and try again',
      DATA_ERROR: "This field can't be empty",
      UPDATE_DATA_ERROR: 'You need to send over the required data',
      URL_ERROR: 'That URL is invalid',
      DUPLICATE_ERROR: 'Data provided is already in use',
      EMAIL_DUPLICATE_ERROR: 'Email provided is already in use',
      USERNAME_DUPLICATE_ERROR: 'Username provided is already in use',
      PHONE_NUMBER_DUPLICATE_ERROR: 'Phone number provided is already in use',
      USAGE_ERROR: 'That slug is already in use',
      ACCOUNT_EXISTENCE_ERROR: 'No account associated with that data',
      EXISTENCE_ERROR: "We couldn't find what you requested",
      AUTHORIZATION_ERROR: "You aren't authorized for that action",
      VALIDATION_ERROR: 'Invalid credentials provided',
      UNKNOWN_ERROR: 'Something completely went wrong',
      PASSWORD_MATCH_ERROR: "Your password doesn't match our records",
      DATA_VALIDATION_ERROR: 'Invalid characters in data sent',
      BAD_DATA_ERROR: "You've got some errors in your sent data",
      INTEREST_DATA_ERROR: "You've got some errors in the interests data sent",
      LOGIN_SUCCESS: 'Sign In successful',
      ACCOUNT_UPDATE_SUCCESS: 'Your account has been successfully updated',
      LOGOUT_SUCCESS: 'Sign Out successful',
      REGISTER_SUCCESS: 'Your account has been successfully created',
      INVALID_TOKEN_ERROR: 'Invalid authentication token provided',
      TOKEN_ERROR: 'Authentication token required',
      UPDATE_ERROR: 'You are not allowed to make that update',
      DOB_ERROR: 'The DOB data sent contains invalid data objects',
      PASSWORD_STRENGTH_ERROR: "Your password isn't strong enough",
      PASSWORD_RECOVERY_INITIATED:
        'A recovery OTP has been sent to your email address',
      PASSWORD_RECOVERY_SUCCESS:
        'Your password has been successfully recovered',
      OTP_ERROR: 'Invalid or expired OTP provided',
      QUERY_SUCCESS: 'Request data successfully queried',
      REQUEST_SUCCESS: 'Your request was successfully executed',
      CLINK_CREATE_SUCCESS: 'Your clink has been published',
      OPERATION_DUPLICATE_ERROR: "You've already executed that action",
    };

    // defining all the possible interest sections that can be added by a user
    this.interests = [
      'affiliate & digital marketing',
      'agriculture',
      'art & culture',
      'beauty & skin care',
      'chess palace',
      'climate & environment',
      'content & creative writing',
      'cryptocurrency & fx',
      'politics',
      'photography & cinematography',
      'music',
      'media & communication',
      'job updates',
      'health & fitness',
      'grants for entrepreneurs',
      'gadget',
      'gaming',
      'freelancing',
      'food & pastries',
      'finance & fin tech',
      'forestry',
      'fashion',
      'events',
      'engineering & manufacturing',
      'energy sustainability',
      'designers & developers hub',
      'data analysis',
      'cyber security',
      'readers corner',
      'scholarship updates',
      'sport',
      'tourism',
    ];
  }

  // extending the object prototype to check for empty objects
  isEmpty(that) {
    for (const key in that) {
      if (key) {
        return false;
      }
    }
    return true;
  }
}

module.exports = {
  Utils,
};
