// native fetch

async function testZenzor() {
  try {
    const loginPageRes = await fetch('http://zenzor.in/Account/Login');
    const loginHtml = await loginPageRes.text();
    const cookies = loginPageRes.headers.getSetCookie ? loginPageRes.headers.getSetCookie() : [];
    let cookieStr = cookies.map(c => c.split(';')[0]).join('; ');
    
    let token = '';
    const tokenMatch = loginHtml.match(/<input name="__RequestVerificationToken" type="hidden" value="([^"]+)"/);
    if (tokenMatch) {
      token = tokenMatch[1];
    }
    
    console.log('Got token:', !!token);
    console.log('Initial cookies:', cookieStr);

    const params = new URLSearchParams();
    params.append('Email', 'admin@demo.com');
    params.append('Password', 'Ademo');
    if (token) {
      params.append('__RequestVerificationToken', token);
    }
    
    const loginRes = await fetch('http://zenzor.in/Account/SignIn', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieStr,
      },
      redirect: 'manual'
    });
    
    console.log('Login status:', loginRes.status);
    
    const loginCookies = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [];
    let allCookies = [...cookies, ...loginCookies];
    
    const cookieMap = {};
    for (const c of allCookies) {
      const parts = c.split(';')[0].split('=');
      cookieMap[parts[0]] = parts.slice(1).join('=');
    }
    cookieStr = Object.entries(cookieMap).map(([k, v]) => `${k}=${v}`).join('; ');

    console.log('Auth cookies:', cookieStr);

    const dataRes = await fetch('http://zenzor.in/DeviceHistory/GetAll?duration=1H', {
      headers: {
        'Cookie': cookieStr
      }
    });

    console.log('GetAll status:', dataRes.status);
    const dataText = await dataRes.text();
    require('fs').writeFileSync('zenzor_data.json', dataText);
    console.log('Saved to zenzor_data.json');
    
  } catch (err) {
    console.error(err);
  }
}

testZenzor();
