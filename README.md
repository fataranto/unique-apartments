# Node.js Express apartments temporary rent with login and registration with MongoDB and JWT

** WORK IN PROGRESS **  
The aim of this app is to create a system to publish apartments in Catalonia. There are three user roles: user, host and admin. When registered, users can search and book an apartment. Hosts can publish, delete and edit already published apartments. Admins have a total control of the application, can update users, edit or delete published apartments, manage bookings and manage data from database such as total published apartments, total bookings, total apartments per province, list users, etc.

After the user completes main actions such as registration, adding a new apartment, making a new booking, or sending a new message, they will receive an email.

Any registered user can send a message with a question to the host from the apartment view. The host will receive an email and can respond to the message from the private area.

When an apartment is booked, the status of the booking is "pending." The host can accept or reject the booking, and the guest can also cancel it.

Any user can update his or her profile from the private area. Username and email cannot be changed.


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

The project can be visited at [https://unique-apartments-test.herokuapp.com/](https://unique-apartments-test.herokuapp.com/)

