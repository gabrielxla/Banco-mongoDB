const db = require('../db/connection'); 
const bcrypt = require('bcrypt');

exports.createUser = (req, res) => { 
    
    bcrypt.hash(req.body.senha_usuario,12,(error, novasenha)=>{
        if (error) {
            return res.status(500).send({msg:`Erro ao tentar cadastrar. Tente novamente mais tarde.`})
        } else {
            // Vamos fazer a devolução da senha criptografata para o body.
            req.body.senha_usuario = novasenha 
    
    const { nome_usuario, email_usuario, senha_usuario } = req.body; 
    const sql = 'INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario)VALUES (?, ?, ?)'; 
    db.query(sql, [nome_usuario, email_usuario, senha_usuario], (err, result) => { 
    if (err) return res.status(500).send(err); 
    res.status(201).json({ id: result.insertId, nome_usuario, email_usuario ,senha_usuario}); 
    
    }); 
}
    })
}; 


   exports.getUsers = (req, res) => { 
    db.query('SELECT nome_usuario, email_usuario FROM usuarios', (err, results) => { 
    if (err) return res.status(500).send(err); 
    res.json(results); 
    }); 
   }; 
   

   exports.updateUser = (req, res) => { 
    const { id } = req.params; 
    const { nome_usuario, email_usuario, senha_usuario } = req.body; 
    const sql = 'UPDATE usuarios SET nome_usuario = ?, email_usuario = ? WHERE id = ?'; 
    db.query(sql, [nome_usuario, email_usuario, id], (err) => { 
    if (err) return res.status(500).send(err); 
    res.json({ id, nome_usuario, email_usuario }); 
    }); 
   }; 

   exports.deleteUser = (req, res) => { 
 const { id } = req.params; 
 const sql = 'DELETE FROM usuarios WHERE id = ?'; 
 db.query(sql, [id], (err) => { 
 if (err) return res.status(500).send(err); 
 res.json({ message: `Usuário com ID ${id} deletado` }); 
 }); 
}; 

    exports.loginUser = (req,res)=>{
    db.query("select * from usuarios where nome_usuario=?",req.body.nome_usuario,(error,result)=>{
        if (error){
            return res.status(500).send({msg:`Erro ao tentar logar ${error}`})
        }else if(result[0] == null){
            return res.status(400).send({msg:`Usuario ou senha errada ${error}`})
        }else{
            bcrypt.compare(req.body.senha_usuario,result[0].senha_usuario).then((igual)=>{
                if (!igual){
                    res.status(400).send({msg:`Usuario ou senha errada ${error}`})
                }else{
                    res.status(200).send({msg:`Usuario logado`})
                }
            }).catch((error)=>res.status(500).send({msg:`Usuario ou senha errado`}))
        }  
    })
}