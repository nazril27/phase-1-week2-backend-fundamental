const users = [
  { id: 1, username: 'john_doe' },
  { id: 2, username: 'jane_smith' },
  { id: 3, username: 'alice' }
];

// Implementasi Callback
function getUserDataCallback(userId, callback) {
  return callback(users[userId - 1]);
}

// Implementasi Promise
function getUserDataPromise(userId) {
  return new Promise((resolve, reject) => {
    const user = users[userId - 1];

    if (user) {
      resolve(user);
    } else {
      reject(`User tidak ditemukan!`);
    }
  });
}

// Implementasi Async/Await
async function getUserDataAsync(userId) {
  return Promise.resolve(users[userId - 1]);
}

// Test Case Callback
getUserDataCallback(1, (user) => {
  console.log('Callback Result:', user);
  // Output: Callback Result: { id: 1, username: 'john_doe' }
});

// Test Case Promise
getUserDataPromise(2)
  .then((user) => {
    console.log('Promise Result:', user);
    // Output: Promise Result: { id: 2, username: 'jane_smith' }
  })
  .catch((error) => {
    console.error(error);
  });

// Test Case Async/Await
(async () => {
  const user = await getUserDataAsync(3);
  console.log('Async/Await Result:', user);
  // Output: Async/Await Result: { id: 3, username: 'alice' }
})();