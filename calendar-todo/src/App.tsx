import React, { useState } from 'react';
import styles from './App.module.css'
import { DatePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

function MyComponent() {
     const [date, setDate] = useState<Date | null>(null);

     const handleDateChange = (newDate: Date | null) => {
          setDate(newDate);
          console.log(newDate);
     };

     return (
          <div>
               <h3>Escolha a data:</h3>
               <DatePicker 
                    className={styles.robotoMono}
                    value={date} 
                    onChange={handleDateChange} 
                    placeholder="Selecione uma data" 
                    format="dd/MM/yyyy"
               />
          </div>
     );
}

export default MyComponent;
