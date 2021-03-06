// menampilkan ke #tableUser di dashboard.html
function getUser() {
    $.get('/get-user', {}, function (data) {
        for (var i = 0; i < data.length; i++) {
            var fullname = data[i].fullname;
            var email = data[i].email;
            var role = data[i].role;
            $('#tableUser tbody').append('<tr class="tr_data">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + fullname + '</td>' +
                '<td>' + email + '</td>' +
                '<td>' + role + '</td>' +
                '<td><button class="btn btn-warning" id="update" name ="' + email + '" onclick="manageUser(this.id, this.name)">Update</button>' +
                '<button class="btn btn-danger" id="delete" name="' + email + '" onclick="manageUser(this.id, this.name)">Delete</button></td>' +
                '</tr>');
        }
    });
}
//--
// pendaftaran user dari halaman register.html
function registerUser() {
    var email = $('#register-email').val();
    var fullname = $('#register-fullname').val();
    var password = $('#register-password').val();
    var repassword = $('#register-repassword').val();
    if (password != repassword) {
        alert("Password doesn't match");
    }
    else {
        $.get('/register-user', { email: email, fullname: fullname, password: password }, function (data) {
            if (data == 1) {
                alert("Register Success");
                window.location.replace("http://localhost:3000/index.html");
            }
            else {
                alert("Register Error");
            }
        });
    }
}
//--
// login dari halaman login.html
function loginUser() {
    var email = $('#login-email').val();
    var password = $('#login-password').val();
    if (email == null || password == null) {
        alert("Form cannot be empty");
    }
    else {
        $.get('/login-user', { email: email, password: password }, function (data) {
            if (data) {
                alert("Login Success");
                window.location.replace("http://localhost:3000/index.html");
            }
            else {
                alert("Incorrect Credential");
            }
        });
    }
}
//--
// cek apakah ada session yang aktif atau tidak
function checkSession() {
    $.get('/check-session', {}, function (data) {
        if (data.email) {
            $('.no-session').hide();
            $('.session').show();
            $('.session span').html(data.fullname);
            if (data.authority.read == 1) {
                $('.admin-session').show();
            }
        }
        else {
            $('.no-session').show();
            $('.session').hide();
        }
    });
}
//--
// setting CRUD user (trigger function ada di atribut onclick setiap button)
function manageUser(action, email) {
    $.get('/check-session', {}, function (data) {
        if (action == "create") {
            if (data.authority.create == 1) {
                $('#modalCreate').modal('toggle');
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
        else if (action == "update") {
            if (data.authority.update == 1) {
                $('#modalUpdate').modal('toggle');
                $('#update-email').val("");
                $('#update-fullname').val("");
                $('#update-role').val("");
                $('.checkbox input').prop('checked', false);
                $.get('/update-user-form', { email: email }, function (data2) {
                    $('#update-email').val(data2[0].email);
                    $('#update-fullname').val(data2[0].fullname);
                    $('#update-role').val(data2[0].role);
                    if (data2[0].authority.read == 1)
                        $('.cb2 #cb-read').prop('checked', true);
                    if (data2[0].authority.create == 1)
                        $('.cb2 #cb-create').prop('checked', true);
                    if (data2[0].authority.update == 1)
                        $('.cb2 #cb-update').prop('checked', true);
                    if (data2[0].authority["delete"] == 1)
                        $('.cb2 #cb-delete').prop('checked', true);
                });
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
        else if (action == "delete") {
            if (data.authority["delete"] == 1) {
                $('#modalDelete').modal('toggle');
                $.get('/delete-user-form', { email: email }, function (data2) {
                    $('#delete-email').html(data2[0].email);
                    $('#delete-fullname').html(data2[0].fullname);
                    $('#delete-role').html(data2[0].role);
                });
            }
            else {
                alert("You don't have permission to " + action);
            }
        }
    });
}
//--
// update data user dari dashboard.html
function updateUser() {
    var email = $('#update-email').val();
    var fullname = $('#update-fullname').val();
    var role = $('#update-role').val();
    var cbRead;
    var cbCreate;
    var cbUpdate;
    var cbDelete;
    if ($('.cb2 #cb-read').is(':checked'))
        cbRead = 1;
    else
        cbRead = 0;
    if ($('.cb2 #cb-create').is(':checked'))
        cbCreate = 1;
    else
        cbCreate = 0;
    if ($('.cb2 #cb-update').is(':checked'))
        cbUpdate = 1;
    else
        cbUpdate = 0;
    if ($('.cb2 #cb-delete').is(':checked'))
        cbDelete = 1;
    else
        cbDelete = 0;
    var authority = {
        read: cbRead,
        create: cbCreate,
        update: cbUpdate,
        "delete": cbDelete
    };
    if (email == null || fullname == null || role == null) {
        alert("Form cannot be empty");
    }
    else {
        $.get('/update-user', { email: email, fullname: fullname, role: role, authority: authority }, function (data) {
            if (data.ok == 1) {
                alert("Update Success");
                window.location.replace("http://localhost:3000/dashboard.html");
            }
            else {
                alert("Update Error");
            }
        });
    }
}
//--
// create data user dari dashboard.html
function createUser() {
    var email = $('#create-email').val();
    var fullname = $('#create-fullname').val();
    var role = $('#create-role').val();
    var password = $('#create-password').val();
    var repassword = $('#create-repassword').val();
    var cbRead;
    var cbCreate;
    var cbUpdate;
    var cbDelete;
    if ($('.cb1 #cb-read').is(':checked'))
        cbRead = 1;
    else
        cbRead = 0;
    if ($('.cb1 #cb-create').is(':checked'))
        cbCreate = 1;
    else
        cbCreate = 0;
    if ($('.cb1 #cb-update').is(':checked'))
        cbUpdate = 1;
    else
        cbUpdate = 0;
    if ($('.cb1 #cb-delete').is(':checked'))
        cbDelete = 1;
    else
        cbDelete = 0;
    var authority = {
        read: cbRead,
        create: cbCreate,
        update: cbUpdate,
        "delete": cbDelete
    };
    if (email == null || fullname == null || role == null) {
        alert("Form cannot be empty");
    }
    else if (password != repassword) {
        alert("Password doesn't match");
    }
    else {
        $.get('/create-user', { email: email, fullname: fullname, role: role, password: password, authority: authority }, function (data) {
            if (data == 1) {
                alert("Create Success");
                window.location.replace("http://localhost:3000/dashboard.html");
            }
            else {
                alert("Create Error");
            }
        });
    }
}
//--
//delete user data dari dashboard.html
function deleteUser() {
    var email = $('#delete-email').html();
    $.get('/delete-user', { email: email }, function (data) {
        if (data.ok == 1) {
            alert("Delete Success");
            window.location.replace("http://localhost:3000/dashboard.html");
        }
        else {
            alert("Delete Error");
        }
    });
}
//--
