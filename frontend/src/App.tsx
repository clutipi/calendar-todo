import React, { useState } from 'react';
import styles from './App.module.css'
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { Checkbox } from '@mui/material';
import { Button } from '@mui/material';

interface Task {
     _id: string;
     title: string;
     description?: string;
     date: string;
     status: boolean;
}

function MyComponent() {

     const [date, setDate] = useState<Date | null>(null);
     const [tasks, setTasks] = useState<Task[]>([]);

     const handleDateChange = (newDate: Date | null) => {
          setDate(newDate);
          console.log(newDate);
          if (newDate) {
               fetchTasksByDate(newDate);
          }
     };
     
     const fetchTasksByDate = async (selectedDate: Date) => {
          try {
               const formattedDate = selectedDate.toISOString().split('T')[0];

               const response = await axios.get('http://localhost:5000/tasks', {
                    params: { date: formattedDate }
               });
               setTasks(response.data)
          } catch (error) {
               console.error(error);
          }
     };

     const handleCheck = async (taskId: string, checked: boolean) => {
          try { // Atualizando o status da task no backend
               await axios.put(`http://localhost:5000/tasks/${taskId}`, {
                    status: checked
               });
               
               setTasks((prevTasks) => // Atualizando o status da task no frontend
                    prevTasks.map((task) =>
                         task._id === taskId ? { ... task, status: checked } : task   
                    )
               );
          } catch (error) {
               console.error(error);
          }
     }


     return (
          <div className={styles.robotoMono}>
               <h3>Escolha a data:</h3>
               <DatePicker 
                    className={styles.robotoMono}
                    value={date} 
                    onChange={handleDateChange} 
                    placeholder="Selecione uma data" 
                    format="dd/MM/yyyy"
               />
               <h3>Tarefas para {date && date.toLocaleDateString()}:</h3>
                    <input 
                         className={styles.adicionarTarefa}
                         type="text" 
                         placeholder="Adicione uma tarefa"
                    />
                    <Button 
                         variant="contained"
                         sx={{
                              backgroundColor: '#e5b333',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#b48817',
                              },
                              '&:focus': {
                                   outline: 'none',
                              }
                            }}
                    >enviar</Button>
               <ul>
                    {tasks.map((task) => (
                         <div>
                              <h2 
                                   className={styles.taskTitle} 
                                   key={task._id}
                              >{task.title}</h2>
                              <p key={task._id+1}>{task.description}</p>
                              <p key={task._id+2}>{task.status ? 'feito':'precisa fazer'}</p>
                              <Checkbox 
                                   key={task._id+3}
                                   checked={task.status}
                                   onChange={(e) => handleCheck(task._id, e.target.checked)}
                                   inputProps={{ 'aria-label': 'controlled' }}
                                   color="default"
                              />
                         </div>
                    ))}
               </ul>
          </div>
     );
}

export default MyComponent;
