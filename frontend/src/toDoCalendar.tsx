import React, { useState } from 'react';
import styles from './toDoCalendar.module.css'
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { Checkbox } from '@mui/material';
import { Button } from '@mui/material';
import { BiTrash } from 'react-icons/bi';

interface Task {
     _id: string;
     title: string;
     description?: string;
     date: string;
     status: boolean;
}

export function TodoCalendar() {
// Declarações de UseState
     const [date, setDate] = useState<Date | null>(null);
     const [tasks, setTasks] = useState<Task[]>([]);
     const [titleInput, setTitle] = useState<string>('');
     const [descriptionInput, setDescription] = useState<string>('');

// Funções de handle
     const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          console.log('Title input:', event.target.value);
          setTitle(event.target.value);
     }

     const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          setDescription(event.target.value);
     }

     const handleDateChange = (newDate: Date | null) => {
          setDate(newDate);
          console.log(newDate);
          if (newDate) {
               fetchTasksByDate(newDate);
          }
     };
     
     const handleSubmit = async (selectedDate: Date, titleInput: string, descriptionInput: string) => {
          try {
               const formattedDate = selectedDate.toISOString().split('T')[0];
               const defaultStatus = false;


               const response = await axios.post(`http://localhost:5000/tasks/`, {
                         title: titleInput,
                         date: formattedDate,
                         description: descriptionInput,
                         status: defaultStatus 
               });


               setTasks((prevTasks) => [...prevTasks, response.data]);
               console.log('POST response data:', response.data);
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

     const handleDelete = async (taskId: string) => {
          try {
               await axios.delete(`http://localhost:5000/tasks/${taskId}`);
          
               // Filtrando a task deletada
               setTasks((prevTasks) => 
                    prevTasks.filter((task) =>
                         task._id !== taskId
                    ));
          } catch (error) {
               console.error(error);
          }
     }

// Função para atualizar as tasks de acordo com a data selecionada
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
                         placeholder="Título"
                         value={titleInput}
                         onChange={handleTitleChange}
                    />
                    <input 
                         className={styles.adicionarTarefa}
                         type="text" 
                         placeholder="Descrição"
                         value={descriptionInput}
                         onChange={handleDescriptionChange}
                    />
                    <Button 
                         variant="contained"
                         onClick={() => {
                              if (date && titleInput) {
                                   handleSubmit(date, titleInput, descriptionInput);
                              } else {
                                   console.log("Data ou titulo são obrigatórios");
                              }
                         }}
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
                         <div key={task._id}>
                              <h2 className={styles.taskTitle}>{task.title}</h2>
                              <p>{task.description}</p>
                              <p>{task.status ? 'feito':'precisa fazer'}</p>
                              <Checkbox 
                                   checked={task.status}
                                   onChange={(e) => handleCheck(task._id, e.target.checked)}
                                   inputProps={{ 'aria-label': 'controlled' }}
                                   color="default"
                              />
                              <div 
                                   onClick={() => handleDelete(task._id)}
                                   className={styles.deleteTaskContainer}>
                                        <BiTrash className={styles.deleteTaskIcon} size={24}/>
                              </div>
                         </div>
                    ))}
               </ul>
          </div>
     );
}