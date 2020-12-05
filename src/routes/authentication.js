const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const crypto = require('crypto');
const pool = require('../database');
const helpers = require('../lib/helpers');
const sgMail = require('@sendgrid/mail');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: 'links/requests',
    //successRedirect: '/requests',//codigo insertado
    failureRedirect: '/signup',
    failureFlash: true
}));


/*
/////////////////////////////////////////////////////////////////////////
//router.get('/profile', isLoggedIn, async(req, res) => {
    router.get('/signin', isLoggedIn, (req, res) => {
        res.redirect('/links/requests');
        req.flash('message', 'El usuario ya está autenticado');
    });
    
    router.post('/signin', isLoggedIn, (req, res) => {
        res.redirect('/links/requests');
        req.flash('message', 'El usuario ya está autenticado')
    });
/////////////////////////////////////////////////////////////////////////
*/



router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, async (req, res, next) => {
    const user_rows = await pool.query('SELECT user_mode FROM USERS WHERE username = ?', req.body.username);
    console.log(user_rows);
    const exist_Pac = await pool.query('SELECT HCL.IDENTIF_PACIENTE FROM HISTORIAS_CLINICAS HCL');
    console.log(user_rows);
    if (user_rows.length > 0) {
        const userm = user_rows[0].user_mode;
        console.log("El usuario es: ");
        console.log(userm);
        if (userm == 'DOCTOR' || userm == 'ENFERMERO' || userm == 'ADMINISTRADOR') {
            passport.authenticate('local.signin', {
                successRedirect: '/links/requests',
                failureRedirect: '/signin',
                failureFlash: true
            })(req, res, next);
        } else if (userm == 'ACOMPANANTE') {
            console.log("Signin ACOMPAÑANTE **********************************************");
            passport.authenticate('local.signin', {
                successRedirect: '/links/requests',        
                failureRedirect: '/signin',
                failureFlash: true
            })(req, res, next);
        }
    } else {
        console.log("POST SIGNIN NO ENCONTRADO EL USUARIO");
        passport.authenticate('local.signin', {
            successRedirect: '/links/requests',
            failureRedirect: '/signin',
            failureFlash: true
        })(req, res, next);
    }
    console.log("Finaliza signin COMPLETO: ");
});

router.get('/forgot', isNotLoggedIn, (req, res) => {
    res.render('auth/forgot');
});

router.post('/forgot', isNotLoggedIn, async (req, res) => {
    const token = await crypto.randomBytes(20).toString('hex');
    const bolean = await pool.query('SELECT email FROM USERS WHERE email = ?', req.body.email);

    if (!bolean[0]) {
        req.flash('message', 'No hay cuentas registradas con ese email');
        return res.redirect('/forgot');
    }

    await pool.query('UPDATE USERS SET token = ?, token_life = ? WHERE email = ?', [token, Date.now() + 3600000, req.body.email]);

    try {
        //sgMail.setApiKey('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');
        sgMail.setApiKey('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');
        const msg = {
            to: req.body.email,
            from: 'resetPassword@uciboard.com',
            subject: 'Restablecer contraseña',
            text: 'Estas recibiendo este correo porque tu (o alguien mas) solicitó restablecer la contraseña para tu cuenta.\n\n' +
                'Por favor da click en el siguiente link, o pegalo en tu navegador para completar el proceso:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'Recuerda que el link es valido por una hora.\n\n' +
                'Si no lo solicitaste, por favor ignora este email y tu contraseña permanecerá intacta.',
        };
        await sgMail.send(msg);
        req.flash('success', 'Te hemos enviado un correo al email registrado, revisa spam si no lo encuentras en tu bandeja de entrada');
        res.redirect('/signin');
    } catch (err) {
        console.log(err);
    }

});

router.post('/alertaMedicos', isLoggedIn, async (req, res) => {
    //const token = await crypto.randomBytes(20).toString('hex');
    console.log("Email Alerta");
    console.log(req.body);
    console.log(req.body.idhcl);
    console.log([req.body.idPaciente]);

    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;

    //const bolean = await pool.query('SELECT email FROM USERS WHERE email = ?', req.body.email);
    const bolean = await pool.query("SELECT email FROM USERS WHERE user_mode = 'DOCTOR';");
    const paciente_UCI = await pool.query(
        "SELECT  PAC.id_Paciente,                                        "+
        "        HCL.nombres_Paciente,                                   "+
        "        HCL.apellidos_Paciente,                                 "+
        "        PAC.UCI_Asignada,                                       "+
        "        UCI.nombre_UCI,                                         "+
        "        PAC.cama_Asignada,                                      "+
        "        date_format(FRE.hora_Toma_Frec, '%d%b %H:%i') hora_dia, "+
        "        PRE.valor_Toma_Pres_Art,                                "+
        "        SAT.valor_Toma_Sat,                                     "+
        "        FRE.valor_Toma_Frec,                                    "+
        "		truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente)          "+
        "		/ 365.25,0) edad FROM PACIENTES PAC                      "+
        "INNER JOIN HISTORIAS_CLINICAS HCL                               "+
        "ON HCL.id_Hist_Clinica = PAC.id_Hist_Clinica                    "+
        "INNER JOIN UCI                                                  "+
        "ON UCI.id_UCI = PAC.UCI_Asignada                                "+
        "LEFT JOIN FREC_CARDIACA FRE                                     "+
        "ON FRE.id_Paciente = PAC.id_Paciente                            "+
        "LEFT JOIN SAT_OXIGENO SAT                                       "+
        "ON SAT.id_Paciente = PAC.id_Paciente                            "+
        "LEFT JOIN PRESION_ARTERIAL PRE                                  "+
        "ON PRE.id_Paciente = PAC.id_Paciente                            "+
        "WHERE PAC.id_Hist_Clinica = ?                                   "+
        "ORDER BY FRE.hora_Toma_Frec DESC                                "+
        "LIMIT 1;",[req.body.idhcl]
        );

        const pac_HC = await pool.query(
            "SELECT 	HCL.id_Hist_Clinica id_hcl,                                           "+
            "		CONCAT(HCL.nombres_Paciente, ' ', HCL.apellidos_Paciente) nombre_completo,"+
            "		HCL.identif_paciente identif_Paciente,                                    "+
            "        truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente) / 365.25,0) edad,        "+
            "        date_format(HCL.fecha_nac_paciente, '%Y-%m-%d') fecha_nac,               "+
            "        ENF.nombre_Enfermedad,                                                   "+
            "        date_format(pac.fecha_Ingreso, '%Y-%m-%d') fecha_Ingreso,                "+
            "        CONCAT(PAC.cama_Asignada, ' - ', UCI.nombre_UCI) cama_UCI                "+
            "FROM  HISTORIAS_CLINICAS HCL                                                     "+
            "INNER JOIN ENFERMEDADES ENF                                                      "+
            "ON ENF.id_Enfermedad = HCL.id_Enfermedad                                         "+
            "INNER JOIN Pacientes PAC                                                         "+
            "ON PAC.id_Hist_Clinica = HCL.id_Hist_Clinica                                     "+
            "INNER JOIN UCI UCI                                                               "+
            "ON UCI.id_UCI = PAC.UCI_Asignada                                                 "+
            "WHERE HCL.id_Hist_Clinica = ?;", [paciente_UCI[0].id_Paciente]
        );


    console.log("paciente_UCI: ");
    console.log(paciente_UCI[0].id_Paciente);
    console.log([paciente_UCI.id_Paciente]);
    console.log(paciente_UCI);
    console.log(paciente_UCI[0].nombres_Paciente + paciente_UCI[0].apellidos_Paciente);

        
    if (!bolean[0]) {
        console.log("No hay medicos registrados");
        req.flash('message', 'No hay medicos registrados');
        return res.redirect('/links/requests');
    }

    //await pool.query("SELECT email FROM USERS WHERE email = 'rrincona1@ucentral.edu.co'");
    //await pool.query('UPDATE USERS SET token = ?, token_life = ? WHERE email = ?', [token, Date.now() + 3600000, req.body.email]);

    try {
        console.log("Enviar Correo");
        //sgMail.setApiKey('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');
        sgMail.setApiKey('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');
        const msg = {
            //to: req.body.email,
            to: bolean,
            from: 'alertaUCI@uciboard.com',
            subject: 'Alerta en UCI Paciente ' + paciente_UCI[0].nombres_Paciente + ' ' +  paciente_UCI[0].apellidos_Paciente,
            text: 'Estas recibiendo este correo porque existe una alerta sobre el paciente: '+  '\n\n' +
                '      Nombre:      ' +
                paciente_UCI[0].nombres_Paciente + ' ' + paciente_UCI[0].apellidos_Paciente + '\n' +
                '      UCI:         ' + paciente_UCI[0].UCI_Asignada + ' ( '+ paciente_UCI[0].nombre_UCI + ' ) '+ '\n' +
                '      Cama:        ' + paciente_UCI[0].cama_Asignada + '\n\n' +
                '    Últimos datos registrados \n' +
                '      Fecha Hora:                    ' + paciente_UCI[0].hora_dia + '\n' +
                '      Presión Arterial:                ' + paciente_UCI[0].valor_Toma_Pres_Art + '\n' +
                '      Saturación de Oxígeno:       ' + paciente_UCI[0].valor_Toma_Sat + '\n' +
                '      Frecuencia Cardiaca:         ' + paciente_UCI[0].valor_Toma_Frec + '\n' +
                '\n' +
                'Acercate lo más pronto posible a la Unidad de Cuidados Intensivos\n\n' ,
        };
        console.log("Sale Enviar Correo");
        await sgMail.send(msg);
        req.flash('message', 'Hemos enviado la alerta a los medicos disponibles');
        if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR') {
            console.log("Entra a links/dashBoardDoctor");
            res.render('links/dashBoardDoctor', { pac_HC });
        }else{
            console.log("Entra a links/dashBoard");
            res.render('links/dashBoard', { pac_HC });
        };
        //req.flash('message', 'Se ha enviado la alerta a los medicos');
        //res.render('/requests');
    } catch (err) {
        console.log("HUBO UN ERROR AL ENVIAR EL CORREO***********************************");
        req.flash('message', 'HUBO UN ERROR AL ENVIAR EL CORREO');
        console.log(err);
        if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR') {
            res.render('links/dashBoardDoctor', { pac_HC });
        }else{
            res.render('links/dashBoard', { pac_HC });
        };
        
    }
    //res.render('links/dashBoard', { pac_HC });

});

router.get('/reset/:token', async (req, res) => {
    const bolean = await pool.query('SELECT token FROM USERS WHERE token = ? AND token_life > ?', [req.params.token, Date.now()]);
    if (!bolean[0]) {
        req.flash('message', 'El link es invalido o ha expirado');
        return res.redirect('/signin');
    }
    console.log(bolean);
    res.render('auth/reset', bolean[0]);
});

router.post('/reset/:token', async (req, res) => {
    password = await helpers.encryptPassword(req.body.password);
    await pool.query('UPDATE USERS SET password = ?, token = "", token_life = 0 WHERE token = ?', [password, req.params.token]);
    req.flash('success', 'Tu contraseña ha sido cambiada');
    res.redirect('/signin');
});

router.get('/profile', isLoggedIn, async(req, res) => {
    const user = req.user.id;
    var query = 'SELECT P.P, A.A, R.R FROM ';
    query += '(SELECT 1, COUNT(1) P FROM LINKS WHERE user_id = ? AND STATUS = "EN PROCESO") P, ';
    query += '(SELECT 1, COUNT(1) A FROM LINKS WHERE user_id = ? AND STATUS = "APROBADA") A, ';
    query += '(SELECT 1, COUNT(1) R FROM LINKS WHERE user_id = ? AND STATUS = "RECHAZADA") R ';
    query += 'WHERE P.1 = A.1 AND P.1 = R.1';
    const links_count = await pool.query(query, [ user, user, user ]);
    const udata = await pool.query('select * from USERS where id = ?', user);
    const process_data = await pool.query('SELECT * FROM LINKS WHERE STATUS = "EN PROCESO" and user_id = ?', user);
    const approved_data = await pool.query('SELECT * FROM LINKS WHERE STATUS = "APROBADA" and user_id = ?', user);
    const denied_data = await pool.query('SELECT * FROM LINKS WHERE STATUS = "RECHAZADA" and user_id = ?', user);
    const approve = links_count[0].A;
    const process = links_count[0].P;
    const denied = links_count[0].R;

    console.log("GET PROFILE UNO---------**********************");

    const listaEscenarios = await pool.query('SELECT * FROM PACIENTES;');
    console.log(listaEscenarios);
    
    console.log(user);
    const clase_Users = await pool.query('SELECT * FROM PACIENTES WHERE id_Paciente = ?', [user]); 
    /*const clase_Users = await pool.query('SELECT C.idClase,                         '+
    '		C.fecha_Clase,                     '+
    '       DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase,'+
    '       C.horario_Clase,                      '+
    '       C.idProfesor,                      '+
    '       C.estado_Clase,                    '+
    '       C.valor_Clase,                     '+
    '       C.idEstudiante,                    '+
    '       C.idEscenario,                     '+
    '       C.linea                            '+
    'FROM USERS U                              '+
    'INNER JOIN                                '+
    '        CLASE_USER CU ON U.id = CU.user_id '+
    'INNER JOIN                                '+
    '		CLASES C ON C.idClase = CU.clase_id '+
    'WHERE U.id = ?' , [user]
    );*/

        console.log("clase_Users GET PROFILE ---------**********************");
        //console.log(clase_Users);
    
    res.render('profile',{ approve, process, denied, udata, process_data, approved_data, denied_data, clase_Users, listaEscenarios });
    console.log("Termina GET PROFILE UNO ---------**********************");
});



router.get('/profile', isLoggedIn, async(req, res) => {
    const user = req.user.id;
    var query = 'SELECT P.P, A.A, R.R FROM ';
    query += '(SELECT 1, COUNT(1) P FROM LINKS WHERE user_id = ? AND STATUS = "EN PROCESO") P, ';
    query += '(SELECT 1, COUNT(1) A FROM LINKS WHERE user_id = ? AND STATUS = "APROBADA") A, ';
    query += '(SELECT 1, COUNT(1) R FROM LINKS WHERE user_id = ? AND STATUS = "RECHAZADA") R ';
    query += 'WHERE P.1 = A.1 AND P.1 = R.1';
    const links_count = await pool.query(query, [ user, user, user ]);
    const udata = await pool.query('select * from USERS where id = ?', user);
    const process_data = await pool.query('SELECT * FROM LINKS WHERE STATUS = "EN PROCESO" and user_id = ?', user);
    const approved_data = await pool.query('SELECT * FROM LINKS WHERE STATUS = "APROBADA" and user_id = ?', user);
    const denied_data = await pool.query('SELECT * FROM LINKS WHERE STATUS = "RECHAZADA" and user_id = ?', user);
    const approve = links_count[0].A;
    const process = links_count[0].P;
    const denied = links_count[0].R;

    console.log("GET PROFILE DOS ---------**********************");

    const listaEscenarios = await pool.query('SELECT * FROM PACIENTES;');
    console.log(listaEscenarios);
    
    console.log(user);
    const clase_Users = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, '+ 
    "        case horario_Clase                                            "+
    "        when '1' then '1:00 a.m. - 3:00 a.m.'                         "+
    "        when '24' then '00:00 a.m. - 2:00 a.m.'                       "+
    "        end as horario_Clase,                                         "+
    "        C.idProfesor,                                                 "+
    "        CONCAT(U.name, ' ', U.last_name) nombre_completo,             "+
    "        CU.estado_Clase,                                               "+
    "        C.valor_Clase,                                                "+
    "        C.idEstudiante,                                                 "+
    "        C.idEscenario,                                                  "+
    "        C.linea,                                                        "+
    "        CONCAT(E.idEscenario,' - ',E.nombreEscenario) nombreEscenario "+
    "FROM CLASE_USER CU                                                    "+
    "INNER JOIN CLASES C                                                   "+
    "ON CU.clase_id = C.idClase                                            "+
    "INNER JOIN USERS U                                                    "+
    "ON U.no_id = C.idProfesor                                             "+
    "INNER JOIN ESCENARIOS E                                               "+
    "ON E.idEscenario = C.idEscenario                                      "+
    "WHERE CU.user_id = ?;  ", [user]); 


        console.log("clase_Users GET PROFILE ---------**********************");
        //console.log(clase_Users);
    
    res.render('profile',{ approve, process, denied, udata, process_data, approved_data, denied_data, clase_Users, listaEscenarios });
    console.log("Termina GET PROFILE DOS ---------**********************");
});



router.get('/logout', (req, res) => {
    req.logOut();
    req.session.destroy();
    res.redirect('/signin');
});

module.exports = router;
