// app.controller('UserCtrl', UserCtrl);
//
// function UserController (User) {
//   this.newUser = {};
//   this.users = User.query(); // returns all the users
//   this.createUser = createUser;
//   this.updateUser = updateUser;
//   this.deleteUser = deleteUser;
//
//   function updateUser(user) {
//     User.update({id: user._id}, user);
//     // user.editForm = false;
//   };
//
//   function createUser(){
//     User.save(this.newUser);
//       this.users.push(this.newUser); // display the new user in the list of users!
//       this.newUser = {};     // clear the form!
//   };
//
//   // function deleteUser(user) {
//   //   // console.log('deleted');
//   //   User.remove({id:user._id});
//   //   var userIndex = this.users.indexOf(user);
//   //   this.users.splice(userIndex, 1);
//   // };
//
//   console.log("Controller loaded.");
//
// }
