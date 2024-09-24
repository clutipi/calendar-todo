const mongoose = require('mongoose');
const express = require('express');

// Importações e inicialização do router
const router = express.Router();
const Task = require('../models/Task');

// Rota POST
router.post('/', async (req, res) => {
     try {
          const { title, description, date, status } = req.body;
          
          // Cria um novo objeto date da string que foi recebida
          const taskDate = new Date(date);

          // Formata a string para 'YYYY-MM-DD'
          const formattedDate = taskDate.toISOString().split('T')[0];
     
          const task = new Task({
          title,
          description,
          date: formattedDate,
          status
          });
     
          await task.save();
          res.status(201).send(task);
          } catch (error) {
          res.status(400).send(error);
          }
   });
   

// Rota GET
router.get('/', async(req, res) => {
     try {
          const { date } = req.query;

          let tasks;
          if (date) {
               tasks = await Task.find({ date });
          } else {
               tasks = await Task.find();
          }
          
          res.send(tasks);
     } catch (error) {
          res.status(500).send(error);
     }
});

// Rota GET task específica
router.get('/:id', async(req, res) => {
     try {
          // Validação do ID
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
               return res.status(400).send({ message: 'ID inválido'});
          }

          const task = await Task.findById(req.params.id);
          if (!task) {
               return res.status(404).send({ message: 'Tarefa não encontrada'});
          }
          res.send(task);
     } catch (error) {
          res.status(500).send(error);
     }
});

// Rota PUT
router.put('/:id', async(req, res) => {
     try {
          // Validação do ID
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
               return res.status(400).send({ message: 'ID inválido'});
          }

          const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
          /*
               new: true: Retorna o documento atualizado em vez do original.
               runValidators: true: Executa as validações definidas no modelo.
          */
          if (!task) {
               return res.status(404).send({ message: 'ID inválido'});
          }
          res.send(task);
     } catch (error) {
          res.status(400).send(error);
     }
});

// Rota DELETE
router.delete('/:id', async(req, res) => {
     try {
     // Validação do ID
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).send({ message: 'ID Inválido'});
     }

     const task = await Task.findByIdAndDelete(req.params.id);

     if (!task) {
          return res.status(404).send({ message: 'task não encontrada'});
     }

     res.status(200).send({ message: 'Tarefa excluída com sucesso'});

     } catch (error) {
          return res.status(500).send(error);
     }
});

module.exports = router;