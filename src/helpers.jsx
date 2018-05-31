const checkStored = drills => {
  const count = names => 
    names.reduce((a, b) => 
      Object.assign(a, {[b]: (a[b] || 0) + 1}), {})
  const findDuplicates = dict => 
    Object.keys(dict).filter((a) => dict[a] > 1)

  const duplicates = findDuplicates(count((drills.map(drill => drill.reference))));
  if (duplicates.length >= 0){
  }
  return drills;
}

const getResults = () => {
  const ls = window.localStorage
  const stored = ls.getItem("results");
  const parsed = (ls && stored) ? JSON.parse(stored)  : {}
  return parsed != null ? parsed : {}
}


export const emptyDrill = (drill, index) => ({...drill, id: index, right: 0, wrong: 0})

export const emptyResults = drills => drills.map(emptyDrill);

/* Every time you reload the page, check whether the list of questions has changed.
If so, merge the new questions (defaulted to zero wrong and right answers
into the existing results */
export const startResults = (set, drills) => {
  const storedResults = getResults();
  const stored = (set in storedResults) ? storedResults[set] : [];
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
    const fromResults = getDrillByReference(stored, drill.reference);
    return fromResults == null ? getDrillByReference(empty, drill.reference) : fromResults
  }

  const results = drills.map(getDrillWithDefault);
  window.results = results;
  return results;
}

export const randomIndex = drills => Math.floor(Math.random() * drills.length)

/* 
Return a random sample of drills, but exclude drills where the
number of right answers strongly exceeds the wrong answers.
*/
export const nextIndex = (index, drills, results) => {
  const candidate = randomIndex(drills);
  const data = results[candidate];
  const expectedDiff = 2;
  const skipBecauseGood = (data.right - data.wrong) >= expectedDiff;
  const skipBecauseRepeat = candidate == index;
  const skip = skipBecauseGood || skipBecauseRepeat;
  if (skip) {
    return nextIndex(index, drills, results);
  }
  return candidate;
}

export const updatedResults = (results, index, numRight, numWrong) => {
  var data = {}
  const currentResults = results[index];
  data = Object.assign(currentResults, data);
  data.wrong = data.wrong + numWrong;
  data.right = data.right + numRight;
  var allData = results
  return allData
}

export const updateResults = (name, results, index, numRight, numWrong) => {
  var data = getResults()
  data[name] = updatedResults(results, index, numRight, numWrong);
  window.localStorage.setItem("results", JSON.stringify(data));
  return data[name];
}
