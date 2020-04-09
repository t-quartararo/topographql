import React from 'react';

function SubmitQuery(props) {
  return (
      <div id="submitquery">
        <form onSubmitQuery={props.onSubmitQuery} >
          <label>Submit a Query</label>
          <br/>
          <textarea onChange={props.onChange} name="query" rows="15" cols="40"></textarea>
          <br/>
          <button>Submit</button>
        </form>
      </div>
  );
}

export default SubmitQuery;
