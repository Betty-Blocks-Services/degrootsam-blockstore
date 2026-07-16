const promiseAll = async ({ concurrency }, steps) => {
  const promiseSets = [];
  let set = [];
  console.log(steps);
  // for (const step of steps) {
  //   for (let i = 0; i < concurrency; i++) {
  //     set.push(step);
  //   }
  //   promiseSets.push(set);
  //   set = [];
  // }
  //
  // for (const promiseSet of promiseSets) {
  //   await Promise.all(promiseSet);
  // }
};

export default promiseAll;
