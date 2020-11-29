const express = require('express');
const pool = require('../database');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const path = require('path');
const fs = require('fs');
const fastcsv = require('fast-csv');

router.get('/users', isLoggedIn, async (req, res) => {
    if (req.user.user_mode == 'ADMINISTRADOR') {
        const users = await pool.query('SELECT * FROM USERS');
        return res.render('admin/users', { users });
    }
    res.redirect('/');
});

router.get('/form_Clase_Users', isLoggedIn, async (req, res) => {
    console.log("GET Clase_Users antes IF------------***************************** ")
    if (req.user.user_mode == 'ESTUDIANTE') {
        console.log("GET Clase_Users --------------------***************************** ")
        const clase_Users = await pool.query('SELECT C.*                '+
            'FROM  USERS U             '+
            'INNER JOIN CLASE_USER CU  '+
            'ON U.id = CU.user_id      '+
            'INNER JOIN CLASES C       '+
            'ON C.idClase = CU.clase_id'
        );
        return res.render('profile', { clase_Users });
    }
    res.redirect('/');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    if (req.user.user_mode == 'ADMINISTRADOR') {
        //await pool.query('DELETE FROM LINKS WHERE user_id = ?', req.params.id);
        await pool.query('DELETE FROM USERS WHERE no_id = ?', req.params.id);
        req.flash('success', 'Usuario Borrado Exitosamente');
        res.redirect('/admin/users');
    } else {
        res.redirect('/');
    }
});

router.get('/load', isLoggedIn, async (req, res) => {
    if (req.user.user_mode == 'ADMINISTRADOR') {
        return res.render('admin/load');
    }
    res.redirect('/');
});

router.post('/load', isLoggedIn, async (req, res) => {
    if (req.files) {
        const file = req.files.file;
        const table = req.body.tableName;
        file.mv(`./src/documents/${file.name}`, err => {
            if (err) return res.status(500).send({ message: err });
        });
        const filePath = path.join(__dirname, `../documents/${file.name}`);
        await pool.query(`LOAD DATA LOCAL INFILE ? INTO TABLE ${table} FIELDS TERMINATED BY "," LINES TERMINATED BY "\n"; commit;`, filePath);
        fs.unlink(filePath, (err) => {
            if (err) throw err;
        });
        req.flash('success', 'El cargue ha finalizado correctamente');
        res.redirect('/admin/load');
    } else {
        req.flash('message', 'No se ha encontrado archivo adjunto');
        res.redirect('/admin/load');
    }
});

router.post('/download', isLoggedIn, (req, res) => {
    file_name = req.body.fileName;
    res.download(path.join(__dirname, `../documents/guide/${file_name}`));
});

router.post('/subject',  async (req, res) => {
    console.log(req.body);
    subjects = await pool.query('select S.id subject_id, S.name subject_name from SUBJECT S, PROGRAM P, PROGRAM_SUBJECT PS WHERE S.id = PS.id_subject AND P.id = PS.id_program AND P.id = ?', req.body.program);
    res.send(subjects);
});

router.post('/generarUCI',  async (req, res) => {
    console.log(req.body);
    UCIS = await pool.query("SELECT id_UCI, CONCAT(id_UCI, ' - ', nombre_UCI) UCI FROM UCI;");
    console.log("generarUCI......................");
    console.log(UCIS);
    //res.send(escenario);
    res.send(UCIS);
    //res.render('links/generarEscenarios', { escenarios });
});

router.post('/generarCama',  async (req, res) => {
    console.log("generarCama......................");
    console.log(req.body);
    console.log(req.body.seleccionUCI);
    camas_UCI = await pool.query(
        "SELECT CAM.numero_Cama, CAM.id_UCI FROM CAMAS CAM                "+
        "WHERE CAM.estado_Disp_Cama = 1                                   "+
        "AND CAM.id_UCI = ?                     "+
        "ORDER BY CAM.numero_Cama;", [req.body.seleccionUCI]);
    console.log("generarUCI post Script......................");
    console.log(camas_UCI);
    //res.send(escenario);
    res.send(camas_UCI);
    //res.render('links/generarEscenarios', { escenarios });
});

router.post('/escenarios',  async (req, res) => {
    console.log(req.body);
    //subjects = await pool.query('select idEscenario, nombreEscenario from ESCENARIOS WHERE idEscenario = ?', req.body.program);
    //subjects = await pool.query('select idHorarios, fecha from HORARIOS where fecha = ?', req.body.fff);
    subjects = await pool.query('select idClase, horario_Clase from CLASES where fecha_Clase = ?', req.body.fff);
    console.log("SUBJECTS");
    console.log(req.body.fff);
    console.log(subjects);
    res.send(subjects);
});

router.post('/generarEscenarios',  async (req, res) => {
    console.log(req.body);
    escenario = await pool.query('SELECT idEscenario, CONCAT (idEscenario, " - " ,nombreEscenario) nombreEscenario FROM ESCENARIOS');
    console.log("generarEscenarios......................");
    console.log(escenario);
    res.send(escenario);
    //res.render('links/generarEscenarios', { escenarios });
});

router.post('/generarHorarios',  async (req, res) => {
        console.log(req.body);
        horarios = await pool.query('SELECT idClase, horario_Clase FROM CLASES WHERE fecha_Clase = ? AND idEscenario = ? ;', [req.body.fecha_Clase, req.body.IdEscenario]);
        console.log("HORARIOS");
        console.log(req.body.fecha_Clase);
        console.log(req.body.IdEscenario);
        console.log(horarios);
        res.send(horarios);
    });

    //OBTENER SIGNOS VITALES
    router.post('/get_Signos_Vitales',  async (req, res) => {
        console.log("Estamos en get_Signos_Vitales *************------*********************");
        console.log("req.body.idPaciente: ",req.body.idPaciente);
        console.log("req.body: ", req.body);
        const id_paciente = await pool.query(
            "SELECT ID_PACIENTE FROM PACIENTES "+
            "WHERE ID_HIST_CLINICA = ?;", req.body.idPaciente);
        console.log(id_paciente[0].ID_PACIENTE);
        console.log("id_paciente : ", id_paciente);

        signos = await pool.query(
            "SELECT FRE.valor_Toma_Frec,                                                                                                                                              "+
            "		date_format(FRE.hora_Toma_Frec, '%d%b %H:%i') hora_dia,                                                                                                           "+
            "        SAT.valor_Toma_Sat,                                                                                                                                              "+
            "        PRE.valor_Toma_Pres_Art,                                                                                                                                         "+
            "        ltrim(replace(substring(substring_index(PRE.valor_Toma_Pres_Art, '/', 1), length(substring_index(PRE.valor_Toma_Pres_Art, '/', 1 - 1)) + 1), '/', '')) sistolica, "+
            "        ltrim(replace(substring(substring_index(PRE.valor_Toma_Pres_Art, '/', 2), length(substring_index(PRE.valor_Toma_Pres_Art, '/', 2 - 1)) + 1), '/', '')) diastolica "+
            "FROM FREC_CARDIACA FRE                                                                                                                                                   "+
            "LEFT JOIN SAT_OXIGENO SAT                                                                                                                                                "+
            "ON SAT.id_Sat_Ox = FRE.id_Frec_Card                                                              "+
            "LEFT JOIN PRESION_ARTERIAL PRE                                                                                                                                           "+
            "ON PRE.id_Pres_Art = FRE.id_Frec_Card                                                         "+
            "WHERE FRE.id_Paciente =  ?                                                                                                                                             "+
            "ORDER BY FRE.hora_Toma_Frec DESC                                                                                                                                         "+
            "LIMIT 12;", id_paciente[0].ID_PACIENTE// [req.body.idPaciente]
        );
        console.log("Signos Vitales");
        console.log(signos);
        res.send(signos);
    });

router.post('/generarIdClase',  async (req, res) => {
        console.log(req.body);
        idClases = await pool.query('SELECT idClase, horario_Clase FROM CLASES WHERE fecha_Clase = ? AND idEscenario = ? AND horario_Clase = ? ;', [req.body.fecha_Clase, req.body.IdEscenario, req.body.IdHora ]);
        console.log("Codigos ID CLASE");
        console.log(req.body.fecha_Clase);
        console.log(req.body.IdEscenario);
        console.log(req.body.IdHora);
        console.log(idClases);
        res.send(idClases);
});

router.post('/generarDataReg',  async (req, res) => {
    console.log(req.body);
    datosClases = await pool.query(
        'SELECT C.idClase,                                         '+
        '        C.idProfesor,                                     '+
        '        CONCAT(U.name, " ", U.last_name) nombre_completo, '+
        '        C.valor_Clase,                                    '+
        '        linea                                             '+
        'FROM CLASES C                                             '+
        'INNER JOIN USERS U                                        '+
        'ON C.idProfesor = U.no_id                                 '+
        'WHERE C.idClase = ?;                                      ', 
        [req.body.IdClase]);
    console.log("datos ID CLASE");
    console.log(datosClases);
    res.send(datosClases);
});

router.get('/report', isLoggedIn, async (req, res) => {
    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();
    const time = today.getHours() + '' + today.getMinutes();
    const dateTime = date + '' + time;
    const data = await pool.query('SELECT @a:=@a+1 No, p.name Programa, p.curriculum PlanEstudios, u.no_id DocIdentidad, u.name Nombres, u.last_name Apellidos, s.name Asignatura, s.id Codigo, l.description Justificacion FROM USERS u, PROGRAM p, USER_PROGRAM up, LINKS l,  SUBJECT s, (SELECT @a:= 0) AS a WHERE u.no_id = up.id_user AND p.id = up.id_program AND l.user_id = u.id AND l.id_subject = s.id');
    const filePath = path.join(__dirname, `../documents/temp/rep${dateTime}.csv`);
    const file = fs.createWriteStream(filePath);
    fastcsv.write(data, {
        headers: true
    }).pipe(file)
        .on('finish', () => {
            res.download(filePath, (err) => {
                if (err) throw err;
                else {
                    fs.unlink(filePath, (err) => {
                        if (err) throw err;
                    });
                }
            });
        });
});

router.get('/reboot', isLoggedIn, async (req, res) => {
    var query = 'SET FOREIGN_KEY_CHECKS=0;';
    query += 'TRUNCATE TABLE PROGRAM_SUBJECT;';
    query += 'TRUNCATE TABLE USER_PROGRAM;';
    query += 'TRUNCATE TABLE PROGRAM;';
    query += 'TRUNCATE TABLE SUBJECT;';
    query += 'TRUNCATE TABLE LINKS;';
    query += 'DELETE FROM USERS WHERE USER_MODE <> "ADMINISTRADOR";';
    query += 'ALTER TABLE USERS AUTO_INCREMENT = 0;';
    query += 'ALTER TABLE LINKS AUTO_INCREMENT = 0;';
    query += 'SET FOREIGN_KEY_CHECKS=1;';
    pool.query(query);
    req.flash('success', 'Base de datos reiniciada correctamente');
    res.redirect('/admin/load');
});

router.get('/test', (req, res) => {
    res.render('admin/test');
});

module.exports = router;