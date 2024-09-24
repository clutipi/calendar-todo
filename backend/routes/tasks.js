const mongoose = require('mongoose');
const express = require('express');

// Importações e inicialização do router
const router = express.Router();
const Task = require('../models/Task');

// Rota POST
router.post('/', async(req, res) => {// Definindo uma rota HTTP POST no caminho '/' *******router.post(caminho, função)
     try {
          const task = new Task({
               title: req.body.title,
               description: req.body.description,
               date: req.body.date,
               status: req.body.status
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
          const tasks = await Task.find();
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
          return req.status(404).send({ message: 'task não encontrada'});
     }

     res.status(200).send({ message: 'Tarefa excluída com sucesso'});

     } catch (error) {
          return res.status(500).send(error);
     }
});

module.exports = router;