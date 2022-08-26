//<script>
    // signup function using fetch to send data to the server
    async function setSignupAction(form, event) {
      event.preventDefault();
      try {
        const display = document.querySelector('#SignupAlert');
        display.innerHTML = '';
        const username = form.querySelector('input[name="username"]').value;
        const name = form.querySelector('input[name="name"]').value;
        const lastname = form.querySelector('input[name="lastname"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const roles = form.querySelectorAll('input[name="roles"]');
  
        const rolesArray = [];
        for (const role of roles) {
          if (role.checked) {
            rolesArray.push(role.value);
          }
        }
  
        const data = {
          username: username,
          name: name,
          lastname: lastname,
          email: email,
          password: password,
          roles: rolesArray
        };
  
        const url = '/api/auth/signup';
        const method = 'POST';
        const headers = {
          'Content-Type': 'application/json'
        };
        const body = JSON.stringify(data);
        const options = {
          method: method,
          headers: headers,
          body: body
        };
        const res = await fetch(url, options);
  
        const json = await res.json();
        //console.log(json);
  
        if (res.status === 400 || res.status === 401 || res.status === 404 || res.status === 500) {
  
          display.classList.remove('d-none');
          display.innerHTML = json.message;
          return;
        }
  
        location.assign('/'); 
  
      } catch (e) {
        //console.log(e.message);
      }
    }
  
  //login function using fetch to send data to the server
    async function setLoginAction(form, event) {
      event.preventDefault();
      try {
        const display = document.querySelector('#loginAlert');
        display.innerHTML = '';
        const username = form.querySelector('input[name="username"]').value;
        const password = form.querySelector('input[name="password"]').value;
        const rememberMe = form.querySelector('input[name="rememberMe"]').checked;
  
        const data = {
          username: username,
          password: password,
          rememberMe: rememberMe
        };
  
        const url = '/api/auth/signin';
        const method = 'POST';
        const headers = {
          'Content-Type': 'application/json'
        };
        const body = JSON.stringify(data);
        const options = {
          method: method,
          headers: headers,
          body: body
        };
        const res = await fetch(url, options);
  
        const json = await res.json();
        //console.log(json);
  
        if (res.status === 400 || res.status === 401 || res.status === 404 || res.status === 500) {
  
          display.classList.remove('d-none');
          display.innerHTML = json.message;
          return;
        }
  
        location.assign('/');
  
      } catch (e) {
        //console.log(e.message);
      }
    }
  //</script>