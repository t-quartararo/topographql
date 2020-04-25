/* eslint-disable react/prop-types */
import React from 'react';
import { Alert } from 'antd';
import LoadServer from '../components/LoadServer';

function Header(props) {
  // error handling logic
  const isError = props.endpointError;
  let message;
  if (isError === null) message = null;
  else if (isError === 'tracingerror') message = <Alert message="Query successful but tracing data not found" type="warning" showIcon />;
  else if (!isError) {
    message = <Alert message="Server successfully connected" type="success" showIcon />;
  } else {
    message = <Alert message="Server cannot be reached" type="error" showIcon />;
  }

  return (
      <div id="header">
          <LoadServer
            onChange={props.onChange}
            onSubmitEndpoint={props.onSubmitEndpoint}
          />
        {message}
      </div>
  );
}

export default Header;
