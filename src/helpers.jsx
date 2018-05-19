const getData = () => {
  const ls = window.localStorage
  return ls ? JSON.parse(window.localStorage.getItem("results"))  : [];
}

const emptyDrill = (drill, index) => ({...drill, id: index, right: 0, wrong: 0})

export const emptyResults = drills => drills.map(emptyDrill);

/* Every time you reload the page, check whether the list of questions has changed.
If so, merge the new questions (defaulted to zero wrong and right answers
into the existing results */
export const startResults = (drills) => {
  const storedResults = getData();
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

export const randomIndex = (drills) => Math.floor(Math.random() * drills.length)

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

export const updateResults = (results, index, numRight, numWrong) => {
  var data = {}
  const currentResults = results[index];
  data = Object.assign(currentResults, data);
  data.wrong = data.wrong + numWrong;
  data.right = data.right + numRight;
  var allData = results
  allData[index] = data;
  window.localStorage.setItem("results", JSON.stringify(allData));
  return allData;
}
