import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';

function NotificationBar(props) {
  const { notification } = props;
  return (
    <Snackbar
      open={notification.message !== null}
      message={notification.message === null ? '...' : notification.message}
      autoHideDuration={4000}
      bodyStyle={{ height: 'auto', lineHeight: '20px', padding: 24, marginLeft: 256, whiteSpace: 'pre-line' }}
    />
  );
}

NotificationBar.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
  }),
};

function mapStateToProps(state) {
  return {
    notification: state.notification,
  };
}

export default connect(mapStateToProps)(NotificationBar);
