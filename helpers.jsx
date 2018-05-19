
export const emptyResults = drills.map((drill, index) => ({...drill, id: index, right: 0, wrong: 0}));

export const baseResults = JSON.parse(window.localStorage.getItem("results")) || emptyResults;


window.baseResults=emptyResults;

/* Every time you reload the page, check whether the list of questions has changed.
If so, merge the new questions into the existing results */
export const startResults = () => {
  const storedResults = JSON.parse(window.localStorage.getItem("results"))

  getDrillByReference = (list, reference) => {
    const matches = list.filter(drill => drill.reference == reference);
    if (matches.length == 1){
      return matches[0]
    } else {
      return null
    }
  }

  getDrillWithDefault = drill => {
    const fromResults = getDrillByReference(storedResults, drill);
    return fromResults == null ? getDrillByReference(drills, drill) : fromResults
  }

  return drills.map(getDrillWithDefault);
}

