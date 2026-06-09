fetch('https://e-commerce-572g.onrender.com/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@swamybakery.com', password: 'admin123' })
}).then(res => res.json()).then(console.log).catch(console.error);
