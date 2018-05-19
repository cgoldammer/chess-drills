
const emptyDrill = (drill, index) => ({...drill, id: index, right: 0, wrong: 0})

export const emptyResults = drills => drills.map(emptyDrill);

/* Every time you reload the page, check whether the list of questions has changed.
If so, merge the new questions (defaulted to zero wrong and right answers
into the existing results */
export const startResults = (drills) => {
  const storedResults = JSON.parse(window.localStorage.getItem("results"))
  const empty = emptyResults(drills);

  const getDrillByReference = (list, reference) => {
    const matches = list.filter(drill => drill.reference == reference);
    if (matches.length == 1){
      return matches[0]
    } else {
      return null
    }
  }

  const getDrillWithDefault = drill => {
    const fromResults = getDrillByReference(storedResults, drill.reference);
    return fromResults == null ? getDrillByReference(empty, drill.reference) : fromResults
  }

  const results = drills.map(getDrillWithDefault);
  window.results = results;
  return results;
}

