const express = require('express');
const pool = require('../database');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const path = require('path');



router.get('/add', isLoggedIn, async(req, res) => {
    //program = await pool.query('select P.name, P.id from USERS U, PROGRAM P, USER_PROGRAM UP WHERE U.no_id = UP.id_user AND P.id = UP.id_program AND U.no_id = ?', req.user.no_id);
    program = await pool.query('select idEscenario, nombreEscenario from ESCENARIOS');
    console.log("ADD GET_______________________*******************************************");
    console.log(program);
    res.render('links/add', { program });
});

router.post('/add', isLoggedIn, async (req, res) => {
    console.log(req.body);
    program = await pool.query('select idEscenario, nombreEscenario from ESCENARIOS = ?');
    console.log("ADD POST  _________________________________________***********")
    res.render('links/add', { program });
    /*
    if (req.files) {
        const rows = await pool.query('SELECT U.no_id, IFNULL(P.max_id,0)+1 max_id FROM (select user_id,max(id) max_id from LINKS group by user_id) P RIGHT JOIN USERS U ON U.id = P.user_id where U.id = ?', req.user.id);
        const user = rows[0];
        const file = req.files.file;
        file.mv(`./src/upload/${user.no_id}${user.max_id}${file.name}`, err => {
            if (err) return res.status(500).send({ message: err });
        });
        const { title, description } = req.body;
        const newLink = {
            title: req.body.request,
            file_name: user.no_id + user.max_id + file.name,
            description,
            user_id: req.user.id,
            status: 'En proceso',
            id_subject: req.body.subject
        };
        await pool.query('INSERT INTO LINKS SET ?', [newLink]);
        req.flash('success', 'Solicitud guardada');
        res.redirect('/links');
    } else {
        req.flash('message', 'No se ha encontrado archivo adjunto');
        res.redirect('/links/add');
    }*/
});

/*router.get('/DashBoard', isLoggedIn, async (req, res) => {
    console.log(req.body);
    console.log("***************************************************************************");
    users = await pool.query("select * from users");
    res.redirect('PacienteEscogido');
});

router.post('/DashBoard', isLoggedIn, async (req, res) => {
    const { idPaciente } = req.body;
    console.log(req.body);
    console.log(idPaciente);
    console.log("DashBoard POST ****************************************************************");
    //res.render('/links/DashBoard');
    users = await pool.query("select * from users");
    res.render('PacienteEscogido', { idPaciente });
    
    //res.render('admin/verClase', { verClase, idClase });
});*/

router.get('/DashBoardDos', isLoggedIn, async (req, res) => {
    users = await pool.query("select * from users");
    res.render('links/DashBoardDos');
});

router.post('/DashBoardDos', isLoggedIn, async (req, res) => {
    res.render('/links/DashBoardDos');
});

router.post('/claseVista', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { idClase } = req.body;
    claseVista = await pool.query('UPDATE CLASES SET estado_Clase = "DICTADA" WHERE idClase =?;', req.body.idClase);
    console.log("ADD POST  _________________________________________***********")
    console.log(idClase);
    res.redirect('/links/requests');
    //res.render('/links/verClase/', {idClase});
});

router.post('/EstudianteClaseVista', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { idClase } = req.body;
    const { id } = req.body;
    console.log(idClase);
    console.log(req.user.id);
    console.log(id);

    claseVista = await pool.query('UPDATE CLASE_USER SET estado_Clase = "VISTA" WHERE user_id = ? AND clase_id = ?; ', [id, idClase]);

    const verClase = await pool.query(
        'SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, '+
        "        case horario_Clase                                "+
        "        when '1' then '1:00 a.m. - 3:00 a.m.'             "+
        "        when '2' then '2:00 a.m. - 4:00 a.m.'             "+
        "        when '3' then '3:00 a.m. - 5:00 a.m.'             "+
        "        when '4' then '4:00 a.m. - 6:00 a.m.'             "+
        "        when '5' then '5:00 a.m. - 7:00 a.m.'             "+
        "        when '6' then '6:00 a.m. - 8:00 a.m.'             "+
        "        when '7' then '7:00 a.m. - 9:00 a.m.'             "+
        "        when '8' then '8:00 a.m. - 10:00 a.m.'            "+
        "        when '9' then '9:00 a.m. - 11:00 a.m.'            "+
        "        when '10' then '10:00 a.m.- 12:00 p.m.'           "+
        "        when '11' then '11:00 a.m. - 1:00 p.m.'           "+
        "        when '12' then '12:00 p.m. - 2:00 p.m.'           "+
        "        when '13' then '1:00 p.m. - 3:00 p.m.'            "+
        "        when '14' then '2:00 p.m. - 4:00 p.m.'            "+
        "        when '15' then '3:00 p.m. - 5:00 p.m.'            "+
        "        when '16' then '4:00 p.m. - 6:00 p.m.'            "+
        "        when '17' then '5:00 p.m. - 7:00 p.m.'            "+
        "        when '18' then '6:00 p.m. - 8:00 p.m.'            "+
        "        when '19' then '7:00 p.m. - 9:00 p.m.'            "+
        "        when '20' then '8:00 p.m. - 10:00 p.m.'           "+
        "        when '21' then '9:00 p.m. - 11:00 p.m.'           "+
        "        when '22' then '10:00 p.m. - 12:00 a.m.'          "+
        "        when '23' then '11:00 p.m. - 1:00 a.m.'           "+
        "        when '24' then '00:00 a.m. - 2:00 a.m.'           "+
        "        end as horario_Clase,                             "+
        "        C.idProfesor,                                     "+
        "        CONCAT(U.name, ' ', U.last_name) nombre_completo, "+
        "        CU.estado_Clase,                                   "+
        "        C.valor_Clase,                                    "+
        "        C.idEstudiante,                                     "+
        "        C.idEscenario,                                      "+
        "        C.linea,                                             "+
        "        U.id,                                             "+
        "        CONCAT(E.idEscenario,' - ',E.nombreEscenario) nombreEscenario "+
        "FROM CLASE_USER CU                                        "+
        "INNER JOIN CLASES C                                       "+
        "ON CU.clase_id = C.idClase                                "+
        "INNER JOIN USERS U                                        "+
        "ON CU.user_id = U.id                                      "+
        "INNER JOIN ESCENARIOS E                                               "+
        "ON E.idEscenario = C.idEscenario                                      "+
        "WHERE CU.clase_id = ?;                                    "
        , idClase);
    

    //const estaClase = await pool.query('SELECT id_clase_user FROM CLASE_USER WHERE user_id = ? AND clase_id = ?; ',
    //                                    [req.user.id, idClase]);
    console.log("EstudianteClaseVista POST  _________________________________________***********")
    //res.redirect('/links/requests');
    res.render('admin/verClase', { verClase, idClase });

});

router.post('/EstudianteClasePerdida', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { idClase } = req.body;
    const { id } = req.body;
    console.log(idClase);
    console.log(req.user.id);
    console.log(id);

    claseVista = await pool.query('UPDATE CLASE_USER SET estado_Clase = "PERDIDA" WHERE user_id = ? AND clase_id = ?; ', [id, idClase]);
    console.log("EstudianteClasePerdida POST  _________________________________________***********")
    //res.redirect('/links/requests');
    const verClase = await pool.query(
        'SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, '+
        "        case horario_Clase                                "+
        "        when '1' then '1:00 a.m. - 3:00 a.m.'             "+
        "        when '2' then '2:00 a.m. - 4:00 a.m.'             "+
        "        when '3' then '3:00 a.m. - 5:00 a.m.'             "+
        "        when '4' then '4:00 a.m. - 6:00 a.m.'             "+
        "        when '5' then '5:00 a.m. - 7:00 a.m.'             "+
        "        when '6' then '6:00 a.m. - 8:00 a.m.'             "+
        "        when '7' then '7:00 a.m. - 9:00 a.m.'             "+
        "        when '8' then '8:00 a.m. - 10:00 a.m.'            "+
        "        when '9' then '9:00 a.m. - 11:00 a.m.'            "+
        "        when '10' then '10:00 a.m.- 12:00 p.m.'           "+
        "        when '11' then '11:00 a.m. - 1:00 p.m.'           "+
        "        when '12' then '12:00 p.m. - 2:00 p.m.'           "+
        "        when '13' then '1:00 p.m. - 3:00 p.m.'            "+
        "        when '14' then '2:00 p.m. - 4:00 p.m.'            "+
        "        when '15' then '3:00 p.m. - 5:00 p.m.'            "+
        "        when '16' then '4:00 p.m. - 6:00 p.m.'            "+
        "        when '17' then '5:00 p.m. - 7:00 p.m.'            "+
        "        when '18' then '6:00 p.m. - 8:00 p.m.'            "+
        "        when '19' then '7:00 p.m. - 9:00 p.m.'            "+
        "        when '20' then '8:00 p.m. - 10:00 p.m.'           "+
        "        when '21' then '9:00 p.m. - 11:00 p.m.'           "+
        "        when '22' then '10:00 p.m. - 12:00 a.m.'          "+
        "        when '23' then '11:00 p.m. - 1:00 a.m.'           "+
        "        when '24' then '00:00 a.m. - 2:00 a.m.'           "+
        "        end as horario_Clase,                             "+
        "        C.idProfesor,                                     "+
        "        CONCAT(U.name, ' ', U.last_name) nombre_completo, "+
        "        CU.estado_Clase,                                   "+
        "        C.valor_Clase,                                    "+
        "        C.idEstudiante,                                     "+
        "        C.idEscenario,                                      "+
        "        C.linea,                                             "+
        "        U.id,                                             "+
        "        CONCAT(E.idEscenario,' - ',E.nombreEscenario) nombreEscenario "+
        "FROM CLASE_USER CU                                        "+
        "INNER JOIN CLASES C                                       "+
        "ON CU.clase_id = C.idClase                                "+
        "INNER JOIN USERS U                                        "+
        "ON CU.user_id = U.id                                      "+
        "INNER JOIN ESCENARIOS E                                               "+
        "ON E.idEscenario = C.idEscenario                                      "+
        "WHERE CU.clase_id = ?;                                    "
        , idClase);
    

    //const estaClase = await pool.query('SELECT id_clase_user FROM CLASE_USER WHERE user_id = ? AND clase_id = ?; ',
    //                                    [req.user.id, idClase]);
    console.log("EstudianteClaseVista POST  _________________________________________***********")
    //res.redirect('/links/requests');
    res.render('admin/verClase', { verClase, idClase });

});

router.post('/verClase', isLoggedIn, async(req, res) => {
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    const elIdClase = req.body.idClase;

    if (userm == 'DOCTOR' || userm == 'ENFERMERO' || userm == 'ADMINISTRADOR') {
        const verClase = await pool.query(
            'SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, '+
            "        case horario_Clase                                "+
            "        when '1' then '1:00 a.m. - 3:00 a.m.'             "+
            "        when '2' then '2:00 a.m. - 4:00 a.m.'             "+
            "        when '3' then '3:00 a.m. - 5:00 a.m.'             "+
            "        when '4' then '4:00 a.m. - 6:00 a.m.'             "+
            "        when '5' then '5:00 a.m. - 7:00 a.m.'             "+
            "        when '6' then '6:00 a.m. - 8:00 a.m.'             "+
            "        when '7' then '7:00 a.m. - 9:00 a.m.'             "+
            "        when '8' then '8:00 a.m. - 10:00 a.m.'            "+
            "        when '9' then '9:00 a.m. - 11:00 a.m.'            "+
            "        when '10' then '10:00 a.m.- 12:00 p.m.'           "+
            "        when '11' then '11:00 a.m. - 1:00 p.m.'           "+
            "        when '12' then '12:00 p.m. - 2:00 p.m.'           "+
            "        when '13' then '1:00 p.m. - 3:00 p.m.'            "+
            "        when '14' then '2:00 p.m. - 4:00 p.m.'            "+
            "        when '15' then '3:00 p.m. - 5:00 p.m.'            "+
            "        when '16' then '4:00 p.m. - 6:00 p.m.'            "+
            "        when '17' then '5:00 p.m. - 7:00 p.m.'            "+
            "        when '18' then '6:00 p.m. - 8:00 p.m.'            "+
            "        when '19' then '7:00 p.m. - 9:00 p.m.'            "+
            "        when '20' then '8:00 p.m. - 10:00 p.m.'           "+
            "        when '21' then '9:00 p.m. - 11:00 p.m.'           "+
            "        when '22' then '10:00 p.m. - 12:00 a.m.'          "+
            "        when '23' then '11:00 p.m. - 1:00 a.m.'           "+
            "        when '24' then '00:00 a.m. - 2:00 a.m.'           "+
            "        end as horario_Clase,                             "+
            "        C.idProfesor,                                     "+
            "        CONCAT(U.name, ' ', U.last_name) nombre_completo, "+
            "        CU.estado_Clase,                                   "+
            "        C.valor_Clase,                                    "+
            "        C.idEstudiante,                                     "+
            "        C.idEscenario,                                      "+
            "        C.linea,                                             "+
            "        U.id,                                             "+
            "        CONCAT(E.idEscenario,' - ',E.nombreEscenario) nombreEscenario "+
            "FROM CLASE_USER CU                                        "+
            "INNER JOIN CLASES C                                       "+
            "ON CU.clase_id = C.idClase                                "+
            "INNER JOIN USERS U                                        "+
            "ON CU.user_id = U.id                                      "+
            "INNER JOIN ESCENARIOS E                                               "+
            "ON E.idEscenario = C.idEscenario                                      "+
            "WHERE CU.clase_id = ?;                                    "
            , elIdClase);

        console.log("consulta VerCLASE ------------------------******************************");
        //console.log(verClase);
        console.log(elIdClase);
        res.render('admin/verClase', { verClase, elIdClase });
    } else{
        req.flash('message', 'No tienes Acceso para crear clases');
        res.redirect('/profile');
    };
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM LINKS WHERE user_id = ?', req.user.id);
    res.render('links/list', { links });
});

router.get('/requests', isLoggedIn, async (req, res) => {
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    const userm = user_rows[0].user_mode;
    //const paciente = await pool.query("SELECT id_Paciente FROM USERS WHERE id=?;", req.user.id);
    const user_id = req.user.id;
    const paciente = await pool.query(
        "SELECT USR.id_Paciente     "+
        "FROM Users USR                               "+
        "LEFT JOIN Historias_Clinicas HCL             "+
        "ON USR.id_paciente = HCL.identif_paciente    "+
        "LEFT JOIN PACIENTES PAC                      "+
        "ON PAC.id_Hist_Clinica = HCL.id_Hist_Clinica "+
        "WHERE HCL.identif_paciente IS NOT NULL       "+
        "AND PAC.fecha_Salida = '0000-00-00 00:00:00' "+
        "AND USR.id=?;", req.user.id);
    console.log("Ingreso a Requwst");
    
    
    if (user_mode == 'ADMINISTRADOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        //const links = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, horario_Clase, C.idProfesor, CONCAT(U.name, " ", U.last_name) nombre_completo, C.estado_Clase, C.valor_Clase, idEstudiante, idEscenario, linea FROM CLASES C, USERS U WHERE U.no_id = C.idProfesor;');
        const links = await pool.query(
            "SELECT 	PAC.id_Paciente,                                                        "+
            "		HCL.identif_Paciente,                                                       "+
            "		CONCAT(HCL.nombres_Paciente, ' ' , HCL.apellidos_Paciente) nombre_completo, "+
            "		truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente) / 365.25,0) edad,           "+
            "        date_format(HCL.fecha_nac_paciente, '%Y-%m-%d') fecha_nac,                 "+
            "        CONCAT(PAC.cama_Asignada, ' - ', UCI.nombre_UCI) cama_UCI,                  "+
            "        date_format(PAC.fecha_Ingreso, '%Y-%m-%d %H:%i') fecha_Ingreso             "+
            "FROM PACIENTES PAC, HISTORIAS_CLINICAS HCL, UCI                                    "+
            "WHERE PAC.id_Hist_Clinica = HCL.id_Hist_Clinica                                    "+
            "AND UCI.id_UCI = PAC.UCI_Asignada;");
        console.log("consulta LINKS ------------------------******************************");
        //console.log(links);
        //console.log(links);
        res.render('links/list2', { links });
    } else if (userm == 'DOCTOR' || userm == 'ENFERMERO') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        //const links = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, horario_Clase, C.idProfesor, CONCAT(U.name, " ", U.last_name) nombre_completo, C.estado_Clase, C.valor_Clase, idEstudiante, idEscenario, linea FROM CLASES C, USERS U WHERE U.no_id = C.idProfesor;');
        const links = await pool.query(
            "SELECT 	PAC.id_Paciente,                                                        "+
            "		HCL.identif_Paciente,                                                       "+
            "		CONCAT(HCL.nombres_Paciente, ' ' , HCL.apellidos_Paciente) nombre_completo, "+
            "		truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente) / 365.25,0) edad,           "+
            "        date_format(HCL.fecha_nac_paciente, '%Y-%m-%d') fecha_nac,                 "+
            "        CONCAT(PAC.cama_Asignada, ' - ', UCI.nombre_UCI) cama_UCI,                  "+
            "        date_format(PAC.fecha_Ingreso, '%Y-%m-%d %H:%i') fecha_Ingreso             "+
            "FROM PACIENTES PAC, HISTORIAS_CLINICAS HCL, UCI                                    "+
            "WHERE PAC.id_Hist_Clinica = HCL.id_Hist_Clinica                                    "+
            "AND UCI.id_UCI = PAC.UCI_Asignada;                                                 ");
        console.log("consulta LINKS ------------------------******************************");
        //console.log(links);
        //console.log(links);
        res.render('links/list3', { links });
    } else if (userm == 'ACOMPANANTE') {
        console.log("INGRESO ACOMPAÑANTE  ------------------------******************************");
        if(paciente.length > 0 ){        
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        //const links = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, horario_Clase, C.idProfesor, CONCAT(U.name, " ", U.last_name) nombre_completo, C.estado_Clase, C.valor_Clase, idEstudiante, idEscenario, linea FROM CLASES C, USERS U WHERE U.no_id = C.idProfesor;');
        //const paciente = await pool.query("SELECT id_Paciente FROM USERS WHERE id=5;");////????FALTA PONER EL USUARIO???????
        ////????FALTA PONER EL USUARIO???????
        console.log(paciente);
        console.log(req.user.id);
        console.log(user_id);
        console.log(paciente[0].id_Paciente);
        
        const links = await pool.query(
            "SELECT CONCAT(HCL.nombres_Paciente, ' ', HCL.apellidos_Paciente) nombre_Completo,"+
            "		HCL.identif_paciente,                                                     "+
            "        truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente) / 365.25,0) edad,        "+
            "        date_format(HCL.fecha_nac_paciente, '%Y-%m-%d') fecha_nac,               "+
            "        date_format(OBS.hora_Obs_Doctor, '%Y-%m-%d / %T') hora_Obs_Doctor,       "+
            "        OBS.valor_Obs_Doctor                                                     "+
            "FROM HISTORIAS_CLINICAS HCL                                                      "+
            "LEFT JOIN PACIENTES PAC                                                          "+
            "ON PAC.id_Hist_Clinica = HCL.id_Hist_Clinica                                     "+
            "LEFT JOIN OBS_DOCTOR OBS                                                         "+
            "ON OBS.id_Paciente = PAC.id_Paciente                                             "+
            "WHERE HCL.IDENTIF_PACIENTE = ?                                                   "+
            "AND OBS.hora_Obs_Doctor IS NOT NULL                                              "+
            "ORDER BY OBS.hora_Obs_Doctor DESC;", [paciente[0].id_Paciente]);
        console.log("consulta LINKS ------------------------******************************");
        console.log(links);
        //console.log(links);
        res.render('links/InfoAcompanante', { links });
        } else {
            console.log("NO ENCUENTRA PACIENTE ------------------------******************************");
            res.render('links/InfoAcompanante');
        }
    } else{
        console.log("NO ENCUENTRA USUARIO ------------------------******************************");
        res.redirect('/profile');
        //res.redirect('/request');

    };

});


router.post('/status1/', isLoggedIn, async (req, res) => {
    const { id, file } = req.body;
    await pool.query('UPDATE LINKS set status = "APROBADA" where id = ?', [id]);
    req.flash('success', 'Solicitud aprobada exitosamente');
    res.redirect('/links/requests');
});

router.post('/status2/', isLoggedIn, async (req, res) => {
    const { id, file } = req.body;
    await pool.query('UPDATE LINKS set status = "RECHAZADA" where id = ?', [id]);
    req.flash('success', 'Solicitud rechazada exitosamente');
    res.redirect('/links/requests');
});

//ESCOGER PACIENTES
router.get('/escPaciente', isLoggedIn, async (req, res) => {
    console.log("escPaciente req.body *******************************************************");
    console.log(req.body);
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    console.log('Estamos en escPaciente GET');

    if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR' || user_mode == 'ENFERMERO') {
        //const links = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, horario_Clase, C.idProfesor, CONCAT(U.name, " ", U.last_name) nombre_completo, C.estado_Clase, C.valor_Clase, idEstudiante, idEscenario, linea FROM CLASES C, USERS U WHERE U.no_id = C.idProfesor;');
        console.log("consulta LINKS ------------------------******************************");
        const pac_HC = await pool.query(
            "SELECT 	HCL.id_Hist_Clinica id_hcl,                                           "+
            "		CONCAT(HCL.nombres_Paciente, ' ', HCL.apellidos_Paciente) nombre_Completo,"+
            "		HCL.identif_paciente,                                                     "+
            "        truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente) / 365.25,0) edad,        "+
            "        date_format(HCL.fecha_nac_paciente, '%Y-%m-%d') fecha_nac,               "+
            "        ENF.nombre_Enfermedad                                                    "+
            "FROM  HISTORIAS_CLINICAS HCL                                                     "+
            "LEFT JOIN PACIENTES PAC                                                          "+
            "ON HCL.id_Hist_Clinica = PAC.id_Hist_Clinica                                     "+
            "LEFT JOIN ENFERMEDADES ENF                                                       "+
            "ON ENF.id_Enfermedad = HCL.id_Enfermedad                                         "+
            "WHERE PAC.id_Hist_Clinica IS NULL;"
        );
        res.render('links/escPaciente', { pac_HC });
    } else {
        req.flash('message', 'No tienes Acceso para ingresar Pacientes');
        res.redirect('/profile');
    };

});
//ESCOGER PACIENTES
router.post('/escPaciente', isLoggedIn, async (req, res) => {

    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    console.log('Estamos en escPaciente POST');

    if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR' || user_mode == 'ENFERMERO') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        const pac_HC = await pool.query(
            "SELECT 	HCL.id_Hist_Clinica id_hcl,                                           "+
            "		CONCAT(HCL.nombres_Paciente, ' ', HCL.apellidos_Paciente) nombre_Completo,"+
            "		HCL.identif_paciente,                                                     "+
            "        truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente) / 365.25,0) edad,        "+
            "        date_format(HCL.fecha_nac_paciente, '%Y-%m-%d') fecha_nac,               "+
            "        ENF.nombre_Enfermedad                                                    "+
            "FROM  HISTORIAS_CLINICAS HCL                                                     "+
            "LEFT JOIN PACIENTES PAC                                                          "+
            "ON HCL.id_Hist_Clinica = PAC.id_Hist_Clinica                                     "+
            "LEFT JOIN ENFERMEDADES ENF                                                       "+
            "ON ENF.id_Enfermedad = HCL.id_Enfermedad                                         "+
            "WHERE PAC.id_Hist_Clinica IS NULL;"
        );

        console.log("consulta LINKS ------------------------******************************");
        console.log(pac_HC);

        res.render('links/escPaciente', { pac_HC });
    } else {
        req.flash('message', 'No tienes Acceso para ingresar Pacientes');
        res.redirect('/profile');
    };

});



router.post('/PacienteEscogido', isLoggedIn, async (req, res) => {
    const { idPaciente } = req.body;
    console.log("PacienteEscogido POST req.body *******************************************************");
    console.log(req.body);
    console.log(idPaciente);
    
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    console.log('Estamos en PacienteEscogido ************************************');
    const ID_HC = await pool.query(
        "SELECT ID_HIST_CLINICA FROM PACIENTES " +
        "WHERE ID_PACIENTE = ?; ", idPaciente);

    console.log("ID_HIST_CLINICA : " + ID_HC[0].ID_HIST_CLINICA);

    if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
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
            "WHERE HCL.id_Hist_Clinica = ?;", ID_HC[0].ID_HIST_CLINICA//idPaciente
        );

        console.log("consulta LINKS ------------------------******************************");
        console.log(pac_HC);

        res.render('links/dashBoardDoctor', { pac_HC });
    } else if (user_mode == 'ENFERMERO') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
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
            "WHERE HCL.id_Hist_Clinica = ?;", ID_HC[0].ID_HIST_CLINICA//idPaciente
        );

        console.log("consulta LINKS ------------------------******************************");
        console.log(pac_HC);

        res.render('links/dashBoard', { pac_HC });
    } else {
        req.flash('message', 'No tienes Acceso para ingresar Pacientes');
        res.redirect('/profile');
    };

});

//INGRESAR OBSERVACION
router.post('/Obs_Pac', isLoggedIn, async (req, res) => {
    //const { idPaciente } = req.body;
    console.log("Obs_Pac POST req.body *******************************************************");
    console.log(req.body);
    console.log(req.user.id);
    
    const Sql_paciente = await pool.query('SELECT id_Paciente FROM PACIENTES where id_Hist_Clinica = ?', req.body.idhcl);
    const idPaciente = Sql_paciente[0].id_Paciente;

    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    console.log('Estamos en Obs_Pac ************************************');

    console.log(req.user.id);
    console.log(idPaciente);
    console.log(req.body.obs_Pac);


    await pool.query(
        "INSERT INTO OBS_DOCTOR (id_Usuario, id_Paciente, hora_Obs_Doctor, valor_Obs_Doctor)"+
        "		VALUES (?,                                                        "+
        "				?,                                                         "+
        "                NOW(),                                                             "+
        "                ?);", [req.user.id, idPaciente, req.body.obs_Pac]
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
        "WHERE HCL.id_Hist_Clinica = ?;", idPaciente
    );

    
        res.render('links/dashBoardDoctor', { pac_HC });
        req.flash('message', 'Observación ingresada Satisfactoriamente');

});

//INGRESAR SIGNOS VITALES
router.post('/Ing_Signos', isLoggedIn, async (req, res) => {
    const { idPaciente } = req.body;
    console.log("Ing_Signos POST req.body *******************************************************");
    console.log(req.body);
    
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    const id_usuario = req.user.id;
    console.log("id usuario:");
    console.log(id_usuario);
    console.log('Estamos en Ing_Signos POST ************************************');
    console.log(req.body.Frec_Card);
    

    if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR' || user_mode == 'ENFERMERO') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        
        console.log('Ingresando Valores en Frec Cardiaca');
        await pool.query(
            "INSERT INTO FREC_CARDIACA (id_Usuario, id_Paciente, hora_Toma_Frec, valor_Toma_Frec)      "+
            //"VALUES (id_usuario, idPaciente, SYSDATE, Frec_Card);                                      "+
            "VALUES (?, ?, SYSDATE(), ?);", [id_usuario, idPaciente, req.body.Frec_Card]
        );
        
        console.log('Ingresando Valores en Sat Oxigeno');
        await pool.query(
            "INSERT INTO SAT_OXIGENO (id_Usuario, id_Paciente, hora_Toma_Sat, valor_Toma_Sat)        "+
            //"VALUES (id_usuario, idPaciente, SYSDATE, Pres_Art);
            "VALUES (?, ?, SYSDATE(), ?);", [id_usuario, idPaciente, req.body.Sat_Ox]
            
        );

        console.log('Ingresando Valores en Pres Arterial');
        await pool.query(
            "INSERT INTO PRESION_ARTERIAL (id_Usuario, id_Paciente, hora_Toma_Pres_Art, valor_Toma_Pres_Art)   "+
            //"VALUES (id_usuario, idPaciente, SYSDATE, CONCAT(Sistolica,'/',Diastolica));               "+
            "VALUES (?, ?, SYSDATE(), CONCAT(?,'/',?));", [id_usuario, idPaciente, req.body.Sistolica, req.body.Diastolica]
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
            "WHERE HCL.id_Hist_Clinica = ?;", idPaciente
        );

        console.log("consulta LINKS ------------------------******************************");
        console.log(pac_HC);

        res.render('links/dashBoard', { pac_HC });
    } else {
        req.flash('message', 'No tienes Acceso para ingresar Pacientes');
        res.redirect('/profile');
    };

});


//INGRESAR PACIENTES A UCI
router.post('/ingPaciente/', isLoggedIn, async (req, res) => {
    console.log("ingPaciente POST req.body *******************************************************");
    console.log(req.body);
    const { id_hcl } = req.body;
    //const idClase = 3;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST ingPaciente __________________*************************");
    console.log(user_rows);
    console.log({ id_hcl });
    console.log( id_hcl );
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR' || user_mode == 'ENFERMERO' ) {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        console.log("ING PACIENTES POST _______________________***************************************");
        const pac_HC = await pool.query(
            "SELECT 	HCL.id_Hist_Clinica id_hcl,                                           "+
            "		CONCAT(HCL.nombres_Paciente, ' ', HCL.apellidos_Paciente) nombre_Completo,"+
            "		HCL.identif_paciente,                                                     "+
            "        truncate(DATEDIFF(NOW(),HCL.fecha_nac_paciente) / 365.25,0) edad,        "+
            "        date_format(HCL.fecha_nac_paciente, '%Y-%m-%d') fecha_nac,               "+
            "        ENF.nombre_Enfermedad                                                    "+
            "FROM  HISTORIAS_CLINICAS HCL                                                     "+
            "INNER JOIN ENFERMEDADES ENF                                                      "+
            "ON ENF.id_Enfermedad = HCL.id_Enfermedad                                         "+
            "WHERE HCL.id_Hist_Clinica = ?;", [id_hcl]);
        console.log("PACIENTE: ..............................");
        console.log(pac_HC);
        console.log(pac_HC[0].identif_paciente);
        //escenario = await pool.query('SELECT idEscenario, CONCAT (idEscenario, ' - ' ,nombreEscenario) nombreEscenario FROM ESCENARIOS');
        //console.log(escenario);
        //res.send(fecha_Clase);
        res.render('links/ingPaciente', { pac_HC });
    } else {

        req.flash('message', 'No tienes Acceso para ingresar Pacientes a UCI');
        res.redirect('/profile');
    };

});

//INSERT PACIENTES
router.post('/InsertPacienteUCI/', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { id_hcl,               
        Sel_UCI,              
        Sel_Cama,             
        estado_Paciente,      
        indicaciones_Paciente,
        presion_Art_Esperada, 
        sat_Ox_Esperada,      
        frec_Car_Esperada} = req.body;
    //const { idClase } = document.getElementById("IdClase").value;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("id cama*********************************************");
    console.log(Sel_Cama);
    console.log(Sel_UCI);
    const id_cama = await pool.query(
        "SELECT CAM.ID_CAMA FROM CAMAS CAM "+
        "WHERE CAM.NUMERO_CAMA = ? "+
        "AND CAM.ID_UCI = ?; ",
        [Sel_Cama, Sel_UCI]);
    console.log("USUARIOOOOOO POST InsertPacienteUCI __________________*************************");
    console.log(user_rows);
    console.log("ID_CAMA = ", id_cama);    
    console.log(id_cama[0].ID_CAMA);
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR' || user_mode == 'DOCTOR' || user_mode == 'ENFERMERO') {
        console.log("INSERT PACIEnTE POST _______________________***************************************");
        const insertPaciente = await pool.query(
            "INSERT INTO PACIENTES (          "+
            "       id_Hist_Clinica,          "+
            "       UCI_Asignada,             "+
            "       cama_Asignada,            "+
            "       fecha_Ingreso,            "+
            "       estado_Paciente,          "+
            "       indicaciones_Paciente,    "+
            "       presion_Art_Esperada,     "+
            "       sat_Ox_Esperada,          "+
            "       frec_Card_Esperada)       "+ 
            "VALUES(?,?,?,NOW(),?,?,?,?,?);",
            [id_hcl,               
                Sel_UCI,              
                id_cama[0].ID_CAMA,//Sel_Cama,             
                estado_Paciente,      
                indicaciones_Paciente,
                presion_Art_Esperada, 
                sat_Ox_Esperada,      
                frec_Car_Esperada]     );
        console.log(" PACIENTE INSERTADO ..............................");
        console.log(insertPaciente);

        const UpdateCamaPac = await pool.query(
            "UPDATE CAMAS             "+
            "SET estado_Disp_Cama = 0 "+
            "WHERE numero_cama = ?   "+
            "AND id_UCI = ?;", [Sel_Cama, Sel_UCI]
        );
        console.log(" CAMA MODIFICADA ..............................");
        console.log(UpdateCamaPac);

        req.flash('success', 'Paciente ingresado correctamente');
        res.redirect('requests');
    } else {
        req.flash('message', 'No fue posible ingresar el paciente');
        res.redirect('/profile');
    };

});

//UPDATE PACIENTES
router.get('/updatePacienteUCI/', isLoggedIn, async (req, res) => {
    const { idClase } = req.params;
    console.log("USUARIOOOOOO POST updatePacienteUCI __________________*************************");
    //const { idClase } = req.body;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST updatePacienteUCI __________________*************************");
    console.log(user_rows);
    console.log({ idClase });
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        console.log("update CLASES POST _______________________***************************************");
        const alterClase = await pool.query('UPDATE CLASES              '+
        '		SET fecha_Clase = "2019-11-28"'+/*,'+
        '			idEscenario = ?,'+
        '            linea = ?,     '+
        '            idProfesor = ?,'+
        '            valor_Clase = ?'+*/
        'WHERE idClase = ?;', [idClase]);
        console.log(" ALTER CLASEEEEE ..............................");
        console.log(alterClase);
        console.log(alterClase[0].fecha_Clase);
        //escenario = await pool.query('SELECT idEscenario, CONCAT (idEscenario, ' - ' ,nombreEscenario) nombreEscenario FROM ESCENARIOS');
        //console.log(escenario);
        //res.send(fecha_Clase);
        res.render('links/request', { alterClase });
    } else {
        req.flash('message', 'No tienes Acceso para modificar clases');
        res.redirect('/profile');
    };

});

//UPDATE PACIENTES
router.post('/updatePacienteUCI/', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { IdClase, idLinea, fechaModifClase, escenario, idProfesor, valorClase } = req.body;
    //const { idClase } = document.getElementById("IdClase").value;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST updatePacienteUCI __________________*************************");
    console.log(user_rows);
    console.log(IdClase);
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        console.log("update CLASES POST _______________________***************************************");
        console.log(idLinea);
        const alterClase = await pool.query('UPDATE CLASES'+
        '		SET fecha_Clase = ?,'+
        '			idEscenario = ?,'+
        '            linea = ?,     '+
        '            idProfesor = ?,'+
        '            valor_Clase = ?'+
        'WHERE idClase = ?', [fechaModifClase, escenario, idLinea, idProfesor, valorClase, IdClase] );
        console.log(" ALTER CLASEEEEE ..............................");
        console.log(alterClase);

        req.flash('success', 'Clase actualizada correctamente');
        res.redirect('requests');
    } else {
        req.flash('message', 'No tienes Acceso para modificar clases');
        res.redirect('/profile');
    };

});



//CREAR CLASES
router.get('/crearClase', isLoggedIn, async (req, res) => {
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        const links = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, horario_Clase, C.idProfesor, CONCAT(U.name, " ", U.last_name) nombre_completo, C.estado_Clase, C.valor_Clase, idEstudiante, idEscenario, linea FROM CLASES C, USERS U WHERE U.no_id = C.idProfesor;');
        console.log("consulta LINKS ------------------------******************************");
        console.log(links);
        //escenario = await pool.query('SELECT idEscenario, CONCAT (idEscenario, ' - ' ,nombreEscenario) nombreEscenario FROM ESCENARIOS');
        //console.log(escenario);
        //res.send(escenario);
        res.render('links/clases', { links });
    } else {
        req.flash('message', 'No tienes Acceso para crear clases');
        res.redirect('/profile');
    };

});

router.post('/crearClase', isLoggedIn, async (req, res) => {
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        const clases = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, horario_Clase, C.idProfesor, CONCAT(U.name, " ", U.last_name) nombre_completo, C.estado_Clase, C.valor_Clase, idEstudiante, idEscenario, linea FROM CLASES C, USERS U WHERE U.no_id = C.idProfesor;');
        const listaEscenarios = await pool.query('SELECT idEscenario, CONCAT ( idEscenario, " - ", nombreEscenario ) nombreEscenario FROM ESCENARIOS '); 
        const listaProfesores = await pool.query(
        'SELECT U.id,                                              '+
        '        CONCAT(U.name, " ", U.last_name) nombre_completo, '+
        '        U.no_id,                                          '+
        '        U.user_mode                                       '+
        'FROM USERS U                                              '+
        'WHERE U.user_mode = "COMITE";                             ');


        console.log("consulta LINKS ------------------------******************************");
        console.log(clases);
        console.log(listaEscenarios);
        console.log(listaProfesores);

        res.render('links/clases', { clases, listaEscenarios, listaProfesores });
    } else {
        req.flash('message', 'No tienes Acceso para crear clases');
        res.redirect('/profile');
    };

});

router.post('/insertClase', isLoggedIn, async (req, res) => {
    const { fechaAddClase, creaEscenario, idLinea, idProfesor, idHoraClase, valorClase } = req.body;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    const user_mode = user_rows[0].user_mode;
    const ocupado = await pool.query(
        "SELECT count(idClase) contador FROM CLASES  "+
        "WHERE fecha_clase = ?    "+
        "AND idEscenario = ?               "+
        "AND linea = ?                     "+
        "AND (horario_clase = ? - 1        "+
        "OR horario_clase = ?);         ",
        [fechaAddClase, creaEscenario, idLinea, idHoraClase, idHoraClase]
    );
    console.log("consulta crea CLASES ------------------------******************************");

    console.log(ocupado[0].contador);
    console.log(fechaAddClase);
    console.log(creaEscenario);
    console.log(idLinea);
    console.log(idProfesor);
    console.log(idHoraClase);
    console.log(valorClase);

    if (user_mode == 'ADMINISTRADOR') {
        if (ocupado[0].contador > 0){

            console.log("entra a OCUPADO ________________________*************************")
            console.log(ocupado);
            req.flash('message', 'La linea ya está ocupada en este horario');
            res.redirect('requests');

        } else {
            console.log("entra a InsertClase ________________________*************************")
            console.log(ocupado);
            //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
            const insert = await pool.query(
            'INSERT 	INTO CLASES '+
            '(`fecha_Clase`, `horario_Clase`, `idProfesor`, `estado_Clase`, `valor_Clase`, `idEscenario`, `linea`) '+
            'VALUES (?,?,?,"ASIGNADA",?,?,?);', [fechaAddClase, idHoraClase, idProfesor, valorClase, creaEscenario, idLinea]);
        
        console.log("consulta LINKS ------------------------******************************");
        req.flash('success', 'Clase creada correctamente');
        res.redirect('requests');
        }

    } else {
        req.flash('message', 'No tienes Acceso para crear clases');
        res.redirect('/profile');
    };

});


//MODIFICAR CLASES
/*
router.get('/modifClase/', isLoggedIn, async (req, res) => {
    const { idClase } = req.params;
    //const idClase = 3;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO GET modifClase __________________*************************************");
    console.log(user_rows);
    console.log({ idClase });
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        console.log("MODIF CLASES GET_______________________**************************************");
        const ClaseModif = await pool.query('SELECT C.idClase, '
        +'		DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase,' 
        +'        horario_Clase,                                   '
        +'        C.idProfesor,                                    '
        +'        CONCAT(U.name, " ", U.last_name) nombre_completo,' 
        +'        C.estado_Clase,                                  '
        +'        C.valor_Clase,                                   '
        +'        idEstudiante,                                    '
        +'        idEscenario,                                     '
        +'        linea                                            '
        +'FROM CLASES C                                            '
        +'INNER JOIN USERS U                                       '
        +'ON C.idEstudiante = U.no_id                              '
        +'WHERE C.idClase = ?', [idClase]);
        console.log("CLASEEEEE..............................");
        console.log(ClaseModif);
        console.log(ClaseModif[0].fecha_Clase);
        
        //escenario = await pool.query('SELECT idEscenario, CONCAT (idEscenario, ' - ' ,nombreEscenario) nombreEscenario FROM ESCENARIOS');
        //console.log(escenario);
        //res.send(escenario);
        res.render('links/modifClase', { ClaseModif });
    } else {
        req.flash('message', 'No tienes Acceso para crear clases');
        res.redirect('/profile');
    };

});*/


//MODIFICAR CLASES
router.post('/modifClase/', isLoggedIn, async (req, res) => {
    const { idClase } = req.body;
    //const idClase = 3;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST modifClase __________________*************************");
    console.log(user_rows);
    console.log({ idClase });
    console.log( idClase );
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        console.log("MODIF CLASES POST _______________________***************************************");
        const ClaseModif = await pool.query('SELECT C.idClase, '
        +'		DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, ' 
        +'        horario_Clase,                                   '
        +'        C.idProfesor,                                    '
        +'        CONCAT(U.name, " ", U.last_name) nombre_completo, ' 
        +'        C.estado_Clase,                                  '
        +'        C.valor_Clase,                                   '
        +'        idEstudiante,                                    '
        +'        idEscenario,                                     '
        +'        linea                                            '
        +'FROM CLASES C                                            '
        +'INNER JOIN USERS U                                       '
        +'ON C.idProfesor = U.no_id                              '
        +'WHERE C.idClase = ? ', [idClase]);
        console.log("CLASEEEEE..............................");
        console.log(ClaseModif);
        console.log(ClaseModif[0].fecha_Clase);
        //escenario = await pool.query('SELECT idEscenario, CONCAT (idEscenario, ' - ' ,nombreEscenario) nombreEscenario FROM ESCENARIOS');
        //console.log(escenario);
        //res.send(fecha_Clase);
        res.render('links/modifClase', { ClaseModif });
    } else {
        req.flash('message', 'No tienes Acceso para crear clases');
        res.redirect('/profile');
    };

});


//UPDATE CLASES
router.get('/updateClase/', isLoggedIn, async (req, res) => {
    const { idClase } = req.params;
    console.log("USUARIOOOOOO POST updateClase __________________*************************");
    //const { idClase } = req.body;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST updateClase __________________*************************");
    console.log(user_rows);
    console.log({ idClase });
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        //const links = await pool.query('SELECT concat(u.last_name," ", u.name   ) fullname ,u.no_id cedula, u.email correo, l.title title, l.description description, l.created_at created_at, l.status status, l.id id, l.file_name file_name FROM USERS u JOIN LINKS l on u.id = l.user_id;');
        console.log("update CLASES POST _______________________***************************************");
        const alterClase = await pool.query('UPDATE CLASES              '+
        '		SET fecha_Clase = "2019-11-28"'+/*,'+
        '			idEscenario = ?,'+
        '            linea = ?,     '+
        '            idProfesor = ?,'+
        '            valor_Clase = ?'+*/
        'WHERE idClase = ?;', [idClase]);
        console.log(" ALTER CLASEEEEE ..............................");
        console.log(alterClase);
        console.log(alterClase[0].fecha_Clase);
        //escenario = await pool.query('SELECT idEscenario, CONCAT (idEscenario, ' - ' ,nombreEscenario) nombreEscenario FROM ESCENARIOS');
        //console.log(escenario);
        //res.send(fecha_Clase);
        res.render('links/request', { alterClase });
    } else {
        req.flash('message', 'No tienes Acceso para modificar clases');
        res.redirect('/profile');
    };

});

//UPDATE CLASES
router.post('/updateClase/', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { IdClase, idLinea, fechaModifClase, escenario, idProfesor, valorClase } = req.body;
    //const { idClase } = document.getElementById("IdClase").value;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST updateClase __________________*************************");
    console.log(user_rows);
    console.log(IdClase);
    const user_mode = user_rows[0].user_mode;

    if (user_mode == 'ADMINISTRADOR') {
        console.log("update CLASES POST _______________________***************************************");
        console.log(idLinea);
        const alterClase = await pool.query('UPDATE CLASES'+
        '		SET fecha_Clase = ?,'+
        '			idEscenario = ?,'+
        '            linea = ?,     '+
        '            idProfesor = ?,'+
        '            valor_Clase = ?'+
        'WHERE idClase = ?', [fechaModifClase, escenario, idLinea, idProfesor, valorClase, IdClase] );
        console.log(" ALTER CLASEEEEE ..............................");
        console.log(alterClase);

        req.flash('success', 'Clase actualizada correctamente');
        res.redirect('requests');
    } else {
        req.flash('message', 'No tienes Acceso para modificar clases');
        res.redirect('/profile');
    };

});


router.post('/registrarClase/', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const { idClaseReg } = req.body;
    const { fechaAddClase } = req.body;
    console.log(fechaAddClase);
    console.log(idClaseReg);
    const contEstud = await pool.query('SELECT COUNT(clase_id) contEstud  FROM CLASE_USER WHERE clase_id = ?; ', idClaseReg);
    //const { idClase } = document.getElementById("IdClase").value;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);

    const contSemana = await pool.query(
        "SELECT count(cu.clase_id) contSemana                           "+
        "from Clase_User cu                                             "+
        "inner join clases c                                            "+
        "on c.idClase = cu.clase_id                                     "+
        "where (c.fecha_clase <= ?                            "+
        "and c.Fecha_Clase >= date_add( ? , INTERVAL -7 day ))   "+
        "and cu.user_id = ? ;                                          "
        , [fechaAddClase, fechaAddClase, req.user.id]
    );
    console.log("USUARIOOOOOO POST registrarClase __________________*************************");
    console.log(user_rows);
    console.log(idClaseReg);
    console.log(contEstud);
    console.log(contEstud[0].contEstud);
    console.log(contSemana);
    console.log(contSemana[0].contSemana);

    const user_mode = user_rows[0].user_mode;

    if (contEstud[0].contEstud <= 3) {
        if(contSemana[0].contSemana <= 2){
        console.log("registrarClase POST _______________________***************************************");
        const regClase = await pool.query(
        'INSERT INTO CLASE_USER     '+
        '		(user_id, clase_id, estado_Clase, claseModif) '+
        '		VALUES              '+
        '       (?,?, "ASIGNADA", "INSCRITA")               ',
        [req.user.id, idClaseReg] );
        console.log(" REGISTRAR CLASEEEEE ..............................");
        console.log(regClase);

        req.flash('success', 'Clase registrada correctamente');
        res.redirect('/profile');
    }else{
        req.flash('message', 'Solo puedes ver 6 horas por semana, Elige otra fecha');
        res.redirect('/profile');
    }
    } else {
        req.flash('message', 'La clase escogida está llena, Por favor elija otra');
        res.redirect('/profile');
    };

});

router.post('/modificarClaseEstud/', isLoggedIn, async (req, res) => {
    const user = req.user.id;
    console.log(req.body);

    //const { IdClase, idLinea, fechaModifClase, escenario, idProfesor, valorClase } = req.body;
    //const { idClase } = document.getElementById("IdClase").value;
    const { idClase } = req.body;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST modificarClaseEstud __________________*************************");
    console.log(idClase);
    console.log(user_rows);
    //console.log(IdClase);
    const user_mode = user_rows[0].user_mode;

    const listaEscenarios = await pool.query('SELECT idEscenario, CONCAT ( idEscenario, " - ", nombreEscenario ) nombreEscenario FROM ESCENARIOS ');
    console.log(listaEscenarios);
    
    const estaClase = await pool.query('SELECT * FROM CLASE_USER WHERE user_id = ? AND clase_id = ?; ',
                                    [req.user.id, idClase]);

    console.log(user);
    const clase_Users = await pool.query('SELECT C.idClase, DATE_FORMAT(C.fecha_Clase, "%Y-%m-%d") fecha_Clase, '+ 
                                    "        case horario_Clase                                            "+
                                    "        when '1' then '1:00 a.m. - 3:00 a.m.'                         "+
                                    "        when '2' then '2:00 a.m. - 4:00 a.m.'                         "+
                                    "        when '3' then '3:00 a.m. - 5:00 a.m.'                         "+
                                    "        when '4' then '4:00 a.m. - 6:00 a.m.'                         "+
                                    "        when '5' then '5:00 a.m. - 7:00 a.m.'                         "+
                                    "        when '6' then '6:00 a.m. - 8:00 a.m.'                         "+
                                    "        when '7' then '7:00 a.m. - 9:00 a.m.'                         "+
                                    "        when '8' then '8:00 a.m. - 10:00 a.m.'                        "+
                                    "        when '9' then '9:00 a.m. - 11:00 a.m.'                        "+
                                    "        when '10' then '10:00 a.m.- 12:00 p.m.'                       "+
                                    "        when '11' then '11:00 a.m. - 1:00 p.m.'                       "+
                                    "        when '12' then '12:00 p.m. - 2:00 p.m.'                       "+
                                    "        when '13' then '1:00 p.m. - 3:00 p.m.'                        "+
                                    "        when '14' then '2:00 p.m. - 4:00 p.m.'                        "+
                                    "        when '15' then '3:00 p.m. - 5:00 p.m.'                        "+
                                    "        when '16' then '4:00 p.m. - 6:00 p.m.'                        "+
                                    "        when '17' then '5:00 p.m. - 7:00 p.m.'                        "+
                                    "        when '18' then '6:00 p.m. - 8:00 p.m.'                        "+
                                    "        when '19' then '7:00 p.m. - 9:00 p.m.'                        "+
                                    "        when '20' then '8:00 p.m. - 10:00 p.m.'                       "+
                                    "        when '21' then '9:00 p.m. - 11:00 p.m.'                       "+
                                    "        when '22' then '10:00 p.m. - 12:00 a.m.'                      "+
                                    "        when '23' then '11:00 p.m. - 1:00 a.m.'                       "+
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

    console.log(estaClase[0].id_clase_user);
    console.log(estaClase[0].claseModif);

    

    if (user_mode == 'ESTUDIANTE' || user_mode == 'ADMINISTRADOR') {
        console.log("update CLASES POST _______________________***************************************");

        if (estaClase[0].estado_Clase == 'ASIGNADA') {

            if (estaClase[0].claseModif == 'INSCRITA') {

                console.log("modificarClaseEstud INSCRITA  ---------**********************");
                req.flash('success', 'Recuerda que solo puedes modificar la clase una sola vez');
                res.render('links/modifClaseEstud', { listaEscenarios, idClase});

            } else {
                console.log(" modificarClaseEstud  MODIFICADA..............................");
                req.flash('message', 'Ya modificaste esta clase una vez, no lo puedes hacer más');
                res.redirect('/profile');
            }
        } else {
            console.log(" modificarClaseEstud  MODIFICADA..............................");
            req.flash('message', 'Ya viste esta clase no la puedes modificar');
            res.redirect('/profile');
        }
    } else {
        req.flash('message', 'No tienes Acceso para modificar clases');
        res.redirect('/profile');
    };

});

router.post('/modificarClase/', isLoggedIn, async (req, res) => {
    console.log("Ingresa a Modificar Clase __________________*******************")
    console.log(req.body);
    const { idClaseReg } = req.body;
    const { idClase } = req.body;
    const { fechaAddClase } = req.body;
    //const { idClase } = document.getElementById("IdClase").value;
    const user_rows = await pool.query('SELECT user_mode FROM USERS where id = ?', req.user.id);
    console.log("USUARIOOOOOO POST modificarClase __________________*************************");
    console.log(user_rows);
    console.log(idClaseReg);
    console.log(req.user.id);

    const estaClase = await pool.query('SELECT * FROM CLASE_USER WHERE user_id = ? AND clase_id = ?; ',
                                        [req.user.id, idClase]);
    console.log(estaClase);
    console.log(estaClase[0].id_clase_user);
    console.log(estaClase[0].claseModif);

    const user_mode = user_rows[0].user_mode;

    const contEstud = await pool.query('SELECT COUNT(clase_id) contEstud  FROM CLASE_USER WHERE clase_id = ?; ', idClaseReg);

    const contSemana = await pool.query(
        "SELECT count(cu.clase_id) contSemana                           "+
        "from Clase_User cu                                             "+
        "inner join clases c                                            "+
        "on c.idClase = cu.clase_id                                     "+
        "where (c.fecha_clase <= ?                            "+
        "and c.Fecha_Clase >= date_add( ? , INTERVAL -7 day ))   "+
        "and cu.user_id = ? ;                                          "
        , [fechaAddClase, fechaAddClase, req.user.id]
    );

    if (user_mode == 'ESTUDIANTE') {

        if (contEstud[0].contEstud <= 3) {
            if(contSemana[0].contSemana <= 2){

        console.log("Entra a Estudiante _______________________***********************************......")

        await pool.query(
            "UPDATE CLASE_USER              "+
            "SET claseModif = 'MODIFICADA', "+
            "	clase_id = ?               "+
            "WHERE id_clase_user = ?;       "
            , [idClaseReg, estaClase[0].id_clase_user]
        );

        req.flash('success', 'Clase actualizada correctamente');
        res.redirect('/profile');
    }else{
        req.flash('message', 'Solo puedes ver 6 horas por semana, Elige otra fecha');
        res.redirect('/profile');
    }
    } else {
        req.flash('message', 'La clase escogida está llena, Por favor elija otra');
        res.redirect('/profile');
    }

    } else {
        req.flash('message', 'No tienes Acceso para modificar clases');
        res.redirect('/links/requests');
    };

});


router.post('/delete/', isLoggedIn, async (req, res) => {
    const { id, file } = req.body;
    const fs = require('fs');
    fs.unlink(path.join(__dirname, `../upload/${file}`), (err) => {
        if (err) throw err;
    });
    await pool.query('DELETE FROM LINKS WHERE ID = ?', [id]);
    req.flash('success', 'Solicitud borrada correctamente');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    const bolean = await pool.query('SELECT id FROM LINKS WHERE id = ? AND user_id = ?', [id, userId]);
    if (bolean[0]) {
        return next();
    }
    else {
        return res.redirect('/links')
    }
    }, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM LINKS WHERE ID = ?', [id]);
    res.render('links/edit', { links: links[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const newLink = {
        title,
        description
    };
    await pool.query('UPDATE LINKS SET ? WHERE ID = ?', [newLink, id]);
    res.redirect('/links');
});

router.post('/download/', isLoggedIn, async (req, res) => {
    const { id } = req.body;
    const file = await pool.query('SELECT file_name FROM LINKS WHERE ID = ?', id);
    res.download(path.join(__dirname, `../upload/${file[0].file_name}`));
});

module.exports = router;