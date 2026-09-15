const express = require('express');
const cors = require('cors');
const PORT = 3000;


const app = express();

app.use(cors());

app.get('/dashboard', (req, res) => {
    const indicators = {
        activeEquipaments: 48,
        inMaintence: 7,
        preventiveMaintenance: 2
    };
        
    res.writeHead(200, {
        "Content-Type":"application/json"
    });
        
   res.end(JSON.stringify(indicators));
        
    return {
        code:200,
        mensage: "SIM",
    };
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta 3000');
});


// http = require('http');
// const PORT = 3000;

// const server = http.createServer((req, res) => {

    

//     try{
        
//         console.log(req.method);
//         console.log(req.url)
//         if(req.url === "/") {
//             res.writeHead(200,{
//                 "conten-Type":"text/plain"
//             });
//             res.end("API do sistema de manutenção")
//             return;
//         } 
//         if(req.url === "/dashboard") {

//             const indicators = {
//                 activeEquipaments: 48,
//                 inMaintence: 7,
//                 preventiveMaintenance: 2
//             };

//             res.writeHead(200, {
//                 "Content-Type":"application/json"
//             });

//             res.end(JSON.stringify(indicators));

//             return {
//                 code:200,
//                 mensage: "SIM",
//             };
//         }

//         else {
//             res.writeHead(404,{
//                 "Content-Type":"text/plain"
//             })
//             res.end("Nao foi...");
//             return;
//         }
//     } catch (err){
//         res.end("Erro: ",err)
//     }
// })

// server.listen(PORT, () => {
//     console.log("Server LIGADO!\n",`http://localhost:${PORT}`)
// })