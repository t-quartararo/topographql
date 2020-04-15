
/* Takes in copy of the d3introspectiondata and d3 file storing the path information
*  and exports the new copy of schema with highlighted fields for state  
*/

/* eslint-disable */
export const highlightQuery = (schemaCopy, queryPath) => {
  if (schemaCopy.links.length) {
    for (let i = 0; i < schemaCopy.links.length; i++) {
      // check for matches with the keys in the query path
      const pathSource = schemaCopy.links[i].source.name;
      // checks whether the schema target exists as a key in d3querydata 
      if (queryPath[pathSource] && queryPath[pathSource][schemaCopy.links[i].target.name]) {
        schemaCopy.links[i].highlighted = true;
      }
      // Highlights the links between fields that point to other Type nodes
      const queryPathVals = Object.values(queryPath);
      const queryPathValsObj = Object.assign(...queryPathVals);
      if (queryPathValsObj[pathSource]) {
        schemaCopy.links[i].highlighted = true;
      }
    }
  }
  return schemaCopy;
}