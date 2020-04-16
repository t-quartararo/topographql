
/* Takes in copy of the d3introspectiondata and d3 file storing the path information
*  and exports the new copy of schema with highlighted fields for state  
*/

/* eslint-disable */
export const highlightQuery = (schemaCopy, queryPath) => {
  const duplicateFields = schemaCopy.duplicates;
  for (let key in queryPath) {
    for (let target in queryPath[key]) {
      // Rewrite the target names for those that are duplicate fields 
      // in the query path data to match what is in schema 
      if (duplicateFields.includes(target.split('&')[0])) {
        const newTargetName = target.split('&')[0] + '&multiple';
        queryPath[key][newTargetName] = {
          'duration': queryPath[key][target],
          'parentPath': target.split('&')[1]
        }
        delete queryPath[key][target];
      }
    }
  }
  if (schemaCopy.links.length) {
    for (let i = 0; i < schemaCopy.links.length; i++) {
      // check for matches with the keys in the query path
      const pathSource = schemaCopy.links[i].source.name;
      const pathTarget = schemaCopy.links[i].target.name
      const parentNodes = Object.keys(queryPath);
      // highlights all parent nodes if they are the source/target node
      if (parentNodes.includes(pathSource)) {
        schemaCopy.links[i].source.highlighted = true;
      }
      if (parentNodes.includes(pathTarget)) {
        schemaCopy.links[i].target.highlighted = true;
      }
      // checks whether the schema target exists as a key in d3querydata 
      if (queryPath[pathSource] && queryPath[pathSource][schemaCopy.links[i].target.name]) {
        schemaCopy.links[i].source.highlighted = true;
        schemaCopy.links[i].target.highlighted = true;
      }
      // Highlights the links between fields that point to other Type nodes
      const queryPathVals = Object.values(queryPath);
      // contains an object with keys of all the target nodes for the paths 
      // and values of each path's execution time 
      const queryPathValsObj = Object.assign(...queryPathVals);
      if (queryPathValsObj[pathSource]) {
        schemaCopy.links[i].source.highlighted = true;
        schemaCopy.links[i].target.highlighted = true;
      }
    }
  }
  return schemaCopy;
}