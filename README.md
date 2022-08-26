# Node.js Express apartments temporary rent with login and registration with MongoDB and JWT

** WORK IN PROGRESS **  
The aim of this app is to create a system to publish apartments in Catalunya. There are three user roles: user, host and admin. When registered, users can search and book an apartment. Hosts can publish, delete and edit already published apartments. Admins have a total control of the application, can update and delete users, edit or delete published apartments, manage bookins and manage data from database such total published apartments, total bookings, total apartments per province, users, etc.

After main actions such as registrastion, add a new apartment, new booking, new message, etc. an email is sent to the user.

Any registered user cand send a message with a question to the host from the apartment view. The host will receive and email and can respond the message from the private area.

When an apatment is booked the status of the booking is "pending", the host can accept or reject the bookin and the guest can also cancel it.

Any user can update his profile from the private area. Username and email cannot be changed.


## Some extra tools i'm using:
-Bootstrap 5 + Sass 
-Autoprefixer
-Postcss
-Purgecss" 
-[Leaflet](https://leafletjs.com/) → Maps  
-[Sortable](https://github.com/SortableJS/Sortable) → Sort images  
-[Nodemailer](https://nodemailer.com/) → Send emails  
-Googleapis



## Project setup
```
npm install
```

### Run
```
npm start
```

[Process](https://www.notion.so/Proyecto-apartamentos-tur-sticos-aba2aebe6a164719a5bdbfd09bca72c0)
The project can be visited at [https://unique-apartments-test.herokuapp.com/](https://unique-apartments-test.herokuapp.com/)

