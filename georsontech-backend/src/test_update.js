async function test() {
  try {
    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (!loginRes.ok) {
      console.error('Login failed:', loginRes.status, await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.accessToken; // <-- Correct property name
    console.log('Logged in successfully. Token obtained.');

    // 2. Send PUT request to update location 2
    console.log('Sending update request for location id 2...');
    const updateRes = await fetch('http://localhost:5000/api/admin/locations/2', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        office_name: 'Coimbatore Unit-1',
        office_type: 'Manufacturing Unit',
        address: 'Coimbatore, Tamil Nadu, India.',
        phone: '+91 78456 92697',
        email: 'covai@georsontech.com',
        google_map_link: 'https://maps.google.com',
        latitude: '11.01684450',
        longitude: '76.88483260'
      })
    });

    console.log('Response Status:', updateRes.status);
    console.log('Response Body:', await updateRes.text());
  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
