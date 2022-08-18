{
    //validate dates
  
    var checkin = document.querySelector('#checkin');
    var checkout = document.querySelector('#checkout');
  
    checkin.value = new Date().toISOString().split('T')[0];
  
    checkin.addEventListener('focus', function() {
      const checkoutDate = checkout.valueAsDate;
      const maxDate = new Date(Number(checkoutDate));
      maxDate.setDate(checkoutDate.getDate() - 1);    
      this.max = maxDate.toISOString().split('T')[0];
    }); 
  
    //check out must be at least ONE DAY more than check in
    checkout.addEventListener('focus', function() {
      const checkinDate = checkin.valueAsDate;
      const minDate = new Date(Number(checkinDate));
      minDate.setDate(checkinDate.getDate() + 1);
      this.min = minDate.toISOString().split('T')[0];
    }); 
  
  
  }